import json
import time
import os

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

from constants import *
from path_config import PathOptions
from map_navigator import MapNavigator
from map_types import MapData

import logging

logging.basicConfig(level=logging.INFO)
logging.info("Logging initialized")

navigator = None
current_act = None

last_event_time = 0

class LogHandler(FileSystemEventHandler):
    # runs if log file created while program running
    def on_created(self, event):
        global navigator
        if event.src_path.endswith(CURRENT_SAVE_LOG_PATH_END):
            logging.info(f"File {event.src_path} has been created")
            if not navigator:
                data = load_json(event.src_path)
                create_navigator(data)

    def on_modified(self, event):
        global last_event_time
        current_time = time.time()
        if current_time - last_event_time < 1.0:  # Limit updates to once per second
            return
        

        if event.src_path.endswith(CURRENT_SAVE_LOG_PATH_END):
            last_event_time = current_time
            logging.info(f"-Main-: event.src_path is {event.src_path}")
            try:
                data = load_json(event.src_path)
                logging.info("-Main-: loaded data from log file, attempting to update")
                update(data)
            except Exception as e:
                logging.error(f"-Main-: error error error: {e}")

def load_json(path: str, max_retries: int = 3, delay: float = 0.1):
    for _ in range(max_retries):
        try:
            with open(path, "r") as f:
                return json.load(f)
        except json.JSONDecodeError as e:
            logging.error(f"-Main-: error loading data from log file: {e}")
            time.sleep(delay)
        except FileNotFoundError as e:
            logging.error(f"-Main-: log file not found: {e}")
            return None
    raise Exception("Failed to load JSON file after multiple retries")

def create_navigator(data: dict):
    global navigator, current_act
    if navigator or not data:
        return
    current_act = data.get("current_act_index")
    map_data = data["acts"][current_act]["saved_map"]
    navigator = MapNavigator(map_data)
    logging.info("-Main-: Navigator created")

def update(data: dict):
    logging.info("-Main- [update()]: Updating navigator with new data")
    update_navigator_map_data(data)

    current_node_obj = data["visited_map_coords"].pop() if data.get("visited_map_coords") else None
    logging.info(f"-Main- [update()]: Current node object: {current_node_obj}")
    if not current_node_obj:
        return
    
    # Coords are in the format (col, row)
    current_node_coords = (current_node_obj["col"], current_node_obj["row"])
    logging.info(f"-Main- [update()]: Current node coords: {current_node_coords}")
    if current_node_coords:
        direction = navigator.step_to_coords_in_path(current_node_coords)
        logging.info(f"-Main- [update()]: Direction: {direction}")
        print(f"{direction} to next node.")

def update_navigator_map_data(data: dict):
    global navigator, current_act

    if not navigator or not data:
        return
    
    if data.get("current_act_index") is not current_act:
        logging.info("-Main-: Current act index has changed")
        current_act = data.get("current_act_index")
        map_data = data["acts"][current_act]["saved_map"]
        navigator.update_map_data(map_data)
        logging.info("-Main-: Navigator map data updated")
    else:
        map_data = data["acts"][current_act]["saved_map"]
        if navigator.map_data is map_data:
            return
        
        # might need to make stricter
        navigator.update_map_data(map_data)
        logging.info("-Main-: Navigator map data updated")


def set_up_observer():
    observer = Observer()
    handler = LogHandler()

    observer.schedule(handler, path=WATCH_DIR, recursive=False)
    observer.start()

    logging.info("-Main-: Observer started")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()

    

def main():
    global navigator
    logging.info("-Main-: Main function initialized")
    data = load_json(CURRENT_SAVE_LOG_PATH)
    if not data:
        logging.error("-Main-: Failed to load data from log file, waiting for run to start...")
    else:
        create_navigator(data)

    set_up_observer()



if __name__ == "__main__":
    main()
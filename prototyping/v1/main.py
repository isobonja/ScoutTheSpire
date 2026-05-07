import json
import time
import os

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

from prototyping.v1.constants import *
from prototyping.v1.path_config import PathOptions
from prototyping.v1.map_navigator import MapNavigator

navigator = None

last_event_time = 0

class LogHandler(FileSystemEventHandler):
    def on_modified(self, event):
        global last_event_time
        current_time = time.time()
        if current_time - last_event_time < 0.1:  # 100ms debounce
            return
        last_event_time = current_time
        if event.src_path.endswith(CURRENT_SAVE_LOG_PATH_END):
            try:
                data = load_current_run_json_safe()
                print("-Main-: loaded log file")
                if not navigator:
                    print("-Main-: creating navigator")
                    create_navigator(data)
                print("-Main-: updating navigator run data")
                update_navigator_run_data(data)
            except Exception as e:
                print(f"Error processing log file: {e}")


def load_current_run_json_safe(path=CURRENT_SAVE_LOG_PATH, max_retries=5, delay=0.1):
    for _ in range(max_retries):
        try:
            with open(path, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError as e:
            print(f"Error loading JSON: {e}")
            time.sleep(delay)
        except FileNotFoundError:
            return None
    raise Exception(f"Failed to load JSON after {max_retries} retries")

def update_navigator_run_data(data):
    navigator.update_run_data(data)
    print_direction()

def select_path_option():
    print("Available Path Options:\n")
    for i, option in enumerate(PathOptions, start=1):
        print(f'{i} - {option.name}')
    selection = input("Select a path option: ")
    # might be inefficient
    return list(PathOptions)[int(selection) - 1]

def print_direction():
    print(navigator.get_direction_str())

def create_navigator(current_run_data):
    global navigator
    path_option = select_path_option()
    navigator = MapNavigator(current_run_data, path_option)
    print("Navigator initialized successfully.")

def main():
    global navigator
    current_run_data = load_current_run_json_safe()
    if current_run_data is not None:
        create_navigator(current_run_data)
        if navigator:
            #score_results = navigator.score_paths(path_option)
            #print(score_results)
            #print(f'Best path: {score_results["path"]}')
            print_direction()
            

        #node_map = construct_node_map()
        #scores_result = determine_best_scores(node_map, path_option)

        #go_to_most_recently_visited()

    else:
        print("No current run active. Start a run!")
    
    set_up_observer()
    

def set_up_observer():
    observer = Observer()
    handler = LogHandler()

    observer.schedule(handler, path=WATCH_DIR, recursive=False)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()

if __name__ == "__main__":
    main()

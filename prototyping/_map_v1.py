# INITIAL VERSION, DEPRECATED

import json
import time
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

from path_config import PathOptions

CURRENT_SAVE_LOG_PATH = "C:\\Users\\User\\AppData\\Roaming\\SlayTheSpire2\\steam\\76561198052895501\\profile1\\saves\\current_run.save"
CURRENT_SAVE_LOG_PATH_END = "current_run.save"
WATCH_DIR = os.path.dirname(CURRENT_SAVE_LOG_PATH)

current_run_data = None
node_map = None
scores_result = None
current_node = None

last_event_time = 0

class LogHandler(FileSystemEventHandler):
    def on_modified(self, event):
        global last_event_time
        current_time = time.time()
        if current_time - last_event_time < 0.05:  # 50ms debounce
            return
        last_event_time = current_time
        if event.src_path.endswith(CURRENT_SAVE_LOG_PATH_END):
            try:
                data = load_current_run_json_safe()
                process_current_run_data(data)
            except Exception as e:
                print(f"Error processing log file: {e}")

class Node:
    def __init__(self, type, coords):
        self.type = type
        self.coords = coords
        self.children = []
    
    def __repr__(self):
        return f'Node_{self.coords} [{self.type}]'
    
    def get_children(self):
        return self.children

#
# --- CONSTRUCT NODES ---
#
def load_current_run_json():
    try:
        with open(CURRENT_SAVE_LOG_PATH, 'r') as f:
            return json.load(f)
    except OSError as e:
        print(f"Error opening file: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None

def load_current_run_json_safe(path=CURRENT_SAVE_LOG_PATH, max_retries=5, delay=0.1):
    for _ in range(max_retries):
        try:
            with open(path, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError as e:
            print(f"Error loading JSON: {e}")
            time.sleep(delay)
    raise Exception(f"Failed to load JSON after {max_retries} retries")

def process_current_run_data(data):
    global current_run_data
    if data is not current_run_data:
        current_run_data = data
        go_to_most_recently_visited()


def construct_nodes(data):
    node_map = {}

    start = data["start"]
    end = data["boss"]
    points = data["points"]

    start_coord = (start["coord"]["col"], start["coord"]["row"])
    start_node = Node(
        start["type"],
        start_coord
    )
    node_map[start_coord] = start_node

    end_coord = (end["coord"]["col"], end["coord"]["row"])
    end_node = Node(
        end["type"],
        end_coord
    )
    node_map[end_coord] = end_node

    for p in points:
        coord = (p["coord"]["col"], p["coord"]["row"])
        node = Node(p["type"], coord)
        node_map[coord] = node
    
    connect_children(start, node_map)

    for p in points:
        connect_children(p, node_map)
    
    return node_map

def connect_children(point_data: dict, nodes: list[dict]) -> bool:
    coord = (point_data["coord"]["col"], point_data["coord"]["row"])
    node = nodes[coord]

    for child in point_data.get("children", []):
        child_coord = (child["col"], child["row"])
        node.children.append(nodes[child_coord])
    
    return True

#
# --- DETERMINE BEST PATH ---
#

def determine_best_scores(
    node_map: dict[tuple, Node], 
    config: PathOptions = PathOptions.MOST_ELITES
):
    config = config.value

    best = {} # best scores
    parent = {} # previous nodes

    start = next(n for n in node_map.values() if n.type == "ancient")

    # state = (coord, can_take_elite: bool)
    best[(start.coords, True)] = 0

    nodes_by_row = sorted(node_map.values(), key=lambda n: n.coords[1])

    for node in nodes_by_row:
        # would likely need to figure out more efficient way of doing this 
        # if/when more states are added
        for can_take_elite in [True, False]:
            key = (node.coords, can_take_elite)

            if key not in best:
                continue

            current_score = best[key]

            for child in node.children:
                child_type = child.type


                # --- Condition Handling ---
                new_can_take_elite = can_take_elite
                # skip if does not match with config
                if config.no_consecutive_elites:
                    if child_type == "elite":
                        if not can_take_elite:
                            continue
                        new_can_take_elite = False
                    elif child_type == "rest_site":
                        new_can_take_elite = True
                
                # --- Scoring ---
                new_score = current_score + config.weights.get(child_type, 0)

                child_key = (child.coords, new_can_take_elite)

                if child_key not in best or best[child_key] < new_score:
                    best[child_key] = new_score
                    parent[child_key] = key
    
    end = next(n for n in node_map.values() if n.type == "boss")

    end_key = max(
        [(end.coords, True), (end.coords, False)], 
        key=lambda k: best.get(k, float('-inf'))
    )

    path = []
    cur = end_key

    while cur in parent:
        coord, _ = cur
        path.append(node_map[coord])
        cur = parent[cur]

    # add start
    path.append(node_map[cur[0]])
    path.reverse()

    return {
        "score": best[end_key],
        "path": path,
        "dp_table": best
    }

# NOT IN USE

def step_through_path(path: list[Node]):
    num_steps = len(path)
    for i, node in enumerate(path):
        if i == num_steps - 1:
            print(f'At node {node.coords} of type {node.type} (END)')
            break

        direction_str = ""
        node_children = node.children
        if len(node_children) > 1:
            next_step_direction = ""
            node_children_cols = [c.coords[0] for c in node_children]
            if path[i+1].coords[0] == max(node_children_cols):
                next_step_direction = "right"
            elif path[i+1].coords[0] == min(node_children_cols):
                next_step_direction = "left"
            else:
                next_step_direction = "middle"
            
            direction_str = f'Go {next_step_direction}'
        print(f'At node {node.coords} of type {node.type}')
        print(direction_str)
        input("Press Enter to continue...")



def construct_node_map():
    global current_run_data
    current_act = current_run_data["current_act_index"]
    map_data = current_run_data["acts"][current_act]["saved_map"]
    return construct_nodes(map_data)

def go_to_most_recently_visited():
    global current_run_data, node_map, scores_result, current_node
    most_recently_visited_coords = current_run_data["visited_map_coords"].pop() if current_run_data["visited_map_coords"] else None
    if most_recently_visited_coords is not None:
        most_recently_visited_node = node_map[(most_recently_visited_coords["col"], most_recently_visited_coords["row"])]
        if most_recently_visited_node is not current_node:
            step_until(most_recently_visited_node)

def step_until(node: Node):
    global current_run_data, node_map, scores_result, current_node
    path = scores_result["path"]
    for n in path:
        if n == node:
            current_node = n
            break
    
    print_direction()

def print_direction():
    global current_node, scores_result
    node = current_node
    path = scores_result["path"]
    i = path.index(node)
    direction_str = ""
    node_children = node.children

    if len(node_children) > 1:
        next_step_direction = ""
        node_children_cols = [c.coords[0] for c in node_children]
        if path[i+1].coords[0] == max(node_children_cols):
            next_step_direction = "right"
        elif path[i+1].coords[0] == min(node_children_cols):
            next_step_direction = "left"
        else:
            next_step_direction = "middle"
        
        direction_str = f'Go {next_step_direction}'
    print(f'At node {node.coords} of type {node.type}\n{direction_str}')


def select_path_option():
    print("Available Path Options:\n")
    for i, option in enumerate(PathOptions, start=1):
        print(f'{i} - {option.name}')
    selection = input("Select a path option: ")
    # might be inefficient
    return list(PathOptions)[int(selection) - 1]


def main():
    global current_run_data, node_map, scores_result, current_node
    current_run_data = load_current_run_json()
    path_option = select_path_option()
    if current_run_data is not None:
        node_map = construct_node_map()
        scores_result = determine_best_scores(node_map, path_option)

        go_to_most_recently_visited()

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


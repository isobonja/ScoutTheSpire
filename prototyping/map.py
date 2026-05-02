from enum import Enum
import json

from path_config import PathConfig, PathOptions

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
def load_map_json():
    try:
        with open('prototyping/map.json', 'r') as f:
            return json.load(f)
    except Exception:
        print("oops")

def construct_nodes(data):
    node_map = {}

    start = data["saved_map"]["start"]
    end = data["saved_map"]["boss"]
    points = data["saved_map"]["points"]

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
            




def main():
    map_data = load_map_json()
    num_rows = map_data["saved_map"]["boss"]["coord"]["row"] + 1
    #print(map_data)
    node_map = construct_nodes(map_data)
    print(node_map)

    for n in node_map.values():
        print(f'Children: {n.children}')

    result = determine_best_scores(node_map, PathOptions.MOST_SHOPS)
    for k, v in result.items():
        print(f'{k}: {v}')
    
    print('\n\n\n\n')
    step_through_path(result["path"])



if __name__ == "__main__":
    main()


from map_types import *
from path_config import PathOptions, PathConfig

import logging

logging.basicConfig(level=logging.INFO)
logging.info("Logging initialized")

class Node:
    def __init__(self, type: str, coords: tuple):
        self.type = type
        self.coords = coords
        self.children = []
    
    def __repr__(self):
        return f'Node_{self.coords} [{self.type}]'
    
    def get_children(self):
        return self.children
    
class MapNavigator:
    def __init__(self, map_data: MapData):
        self.map_data = map_data

        #self.current_act = None - purpose of this class is to navigate the map
        # it doesn't care what the current act is
        self.map_height = self.map_data["height"] + 1
        self.node_map = {}
        self.current_node = None
        self.best_path = None

        self.construct_nodes()

    def update_map_data(self, map_data: MapData):
        self.map_data = map_data
        self.map_height = self.map_data["height"] + 1
        self.node_map = {}
        self.current_node = None
        self.best_path = None

        self.construct_nodes()

    #######################
    #   Construct Nodes   #
    #######################
    def construct_nodes(self, map_data: MapData = None):
        if map_data:
            self.map_data = map_data
        if self.map_data:
            return self._construct_nodes()
        else:
            raise ValueError("Invalid map data")

    def _construct_nodes(self):
        start = self.map_data["start"]
        end = self.map_data["boss"]
        points = self.map_data["points"]

        # Create start node and add to node map
        start_coord = (start["coord"]["col"], start["coord"]["row"])
        start_node = Node(
            start["type"],
            start_coord
        )
        self.node_map[start_coord] = start_node

        # Create end node and add to node map
        end_coord = (end["coord"]["col"], end["coord"]["row"])
        end_node = Node(
            end["type"],
            end_coord
        )
        self.node_map[end_coord] = end_node

        # Create body nodes and add to node map
        for p in points:
            coord = (p["coord"]["col"], p["coord"]["row"])
            node = Node(p["type"], coord)
            self.node_map[coord] = node
        
        # Connect start node to its children
        self._connect_children(start)

        # Connect all other nodes to their children
        for p in points:
            self._connect_children(p)

        # Boss node has no children
        
        return self.node_map

    def _connect_children(self, point_data: MapPoint) -> bool:
        '''Create a connection between a node and its children.'''
        coord = (point_data["coord"]["col"], point_data["coord"]["row"])
        node = self.node_map[coord]

        for child in point_data.get("children", []):
            child_coord = (child["col"], child["row"])
            node.children.append(self.node_map[child_coord])
        
        # temp bool return val
        return True
        

    # Function for getting score based on selected path option
    def get_best_path(self, config: PathOptions, start_node: Node = None):
        path_config = config.value

        results = {}

        if start_node.type != "ancient" or start_node.type != "boss":
            past_result = self._calculate_scores(path_config, None, start_node)
            future_result = self._calculate_scores(path_config, start_node, None)

            full_path = past_result["path"] + future_result["path"]
            full_score = past_result["score"] = future_result["score"]

            results = {
                "start_node": past_result["start_node"],
                "score": full_score,
                "path": full_path,
                "dp_table": future_result["dp_table"]
            }
        else:
            results = self._calculate_scores(path_config, None, None)
        
        self.best_path = results["path"]

        return results

    def _calculate_scores(self, config: PathConfig, start_node: Node = None, end_node: Node = None):

        
        best = {} # best scores
        parent = {} # previous nodes

        start = None
        if start_node is None:
            start = next(n for n in self.node_map.values() if n.type == "ancient")
        else:
            start = start_node
        
        best[start.coords] = 0

        nodes_by_row = sorted(self.node_map.values(), key=lambda n: n.coords[1])
        
        if start_node is None:
            # Filter nodes to only include those on a row below the end node
            nodes_by_row = [n for n in nodes_by_row if n.coords[1] < end_node.coords[1]]
        else:
            # Filter nodes to only include those on a row at or above the start node
            nodes_by_row = [n for n in nodes_by_row if n.coords[1] >= start.coords[1]]
    
        for n in nodes_by_row:
            key = n.coords

            if key not in best:
                continue

            current_score = best[key]

            for child in n.children:
                child_type = child.type
                # any condition handling would go here

                # scoring
                new_score = current_score + config.weights.get(child_type, 0)

                child_key = child.coords

                if child_key not in best or new_score > best[child_key]:
                    best[child_key] = new_score
                    parent[child_key] = key
        
        end = None
        if end_node is None:
            end = next(n for n in self.node_map.values() if n.type == "boss")
        else:
            end = end_node

        end_key = max(
            [end.coords],
            key=lambda k: best.get(k, float('-inf'))
        )

        path = []
        cur = end_key

        while cur in parent:
            coord = cur
            path.append(self.node_map[coord])
            cur = parent[cur]

        # add start
        path.append(self.node_map[cur])
        path.reverse()

        print(f'-MapNavigator-: New path: {[n.coords for n in path]}')

        result = {
            "start_node": start,
            "score": best[end_key],
            "path": path,
            "dp_table": best
        }

        return result
    
    def step_to_coords_in_path(self, coords: tuple):
        logging.info(f"-MapNavigator- [step_to_coords_in_path()]: Coords: {coords}")
        path = self.best_path
        logging.info(f"-MapNavigator- [step_to_coords_in_path()]: best path: {path}")
        node = self.node_map.get(coords)
        logging.info(f"-MapNavigator- [step_to_coords_in_path()]: Node: {node}")
        if node in path:
            self.current_node = node

            return self.get_direction_to_next_node()
        else:
            print(f'-MapNavigator-: Node {node.coords} is not in the best path')
    
    def step_to_node_in_path(self, node: Node):
        path = self.best_path
        if node in path:
            self.current_node = node

            return self.get_direction_to_next_node()
        else:
            print(f'-MapNavigator-: Node {node.coords} is not in the best path')

    def get_direction_to_next_node(self):
        logging.info(f"-MapNavigator- [get_direction_to_next_node()]")
        if not self.best_path or not self.current_node:
            return "No best path or current node available"

        
        current_index = self.best_path.index(self.current_node)
        if current_index < len(self.best_path) - 1:
            next_node = self.best_path[current_index + 1]
            return self._get_direction_str_between_nodes(self.current_node, next_node)
        else:
            return "At the end of the path"
        
    def _get_direction_str_between_nodes(self, node1: Node, node2: Node):
        if not node1 or not node2:
            return "Invalid nodes"

        node_children = node1.children
        node2_index = node_children.index(node2)
        if len(node_children) == 1:
            return "Go straight"
        else:
            if node2_index == 0:
                return "Go left"
            elif node2_index == len(node_children) - 1:
                return "Go right"
            elif len(node_children) == 4:
                if node2_index == 1:
                    return "Go slightly left"
                elif node2_index == 2:
                    return "Go slightly right"
            else:
                return "Go straight"
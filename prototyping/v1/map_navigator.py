from prototyping.v1.constants import *
from prototyping.v1.map_types import *

from prototyping.v1.path_config import PathOptions


class Node:
    def __init__(self, type, coords):
        self.type = type
        self.coords = coords
        self.children = []
    
    def __repr__(self):
        return f'Node_{self.coords} [{self.type}]'
    
    def get_children(self):
        return self.children


class MapNavigator:
    '''
    A class for navigating the map.
    It determines the best path through the map 
      based on the available data and the user's preferences.
    '''
    def __init__(
        self, 
        current_run_data = None,
        path_option = None
    ):
        self.current_run_data = current_run_data
        
        self.path_option = path_option
        self.node_map = {}
        self.scores_result = None
        self.current_node = None

        self.current_act = None
        self.map_height = None

        self.construct_node_map()
        print(f'-MapNavigator-: Node map constructed: {len(self.node_map)} nodes')
        self.step_to_most_recently_visited_node()
    

    #####################
    #   CONSTRUCT MAP   #
    #####################
    def _construct_nodes(self, data: MapData):
        '''Construct all nodes.'''
        start = data["start"]
        end = data["boss"]
        points = data["points"]

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
    
    def construct_node_map(self):
        self.current_act = self.current_run_data["current_act_index"]
        map_data = self.current_run_data["acts"][self.current_act]["saved_map"]
        self.map_height = self.current_run_data["acts"][self.current_act]["saved_map"]["height"] + 1
        return self._construct_nodes(map_data)


    ###########################################
    #   DYNAMIC PROGRAMMING - SCORING PATHS   #
    ###########################################
    #def score_paths(self, config: PathOptions, start_node: Node = None):
    def score_paths(self, start_node: Node = None):
        config = self.path_option.value

        results = {}

        # should only occur if app is started while in the middle of a run
        # will need to reconstruct the path the user took previously, and 
        # combine it with the newly calculated path from their current position 
        # to the boss to get the full path.
        if start_node.type is not "ancient" or start_node.type is not "boss":
            # get results from path user has taken already
            old_results = self._score_paths(config, None, start_node)
            # get results of new path
            new_results = self._score_paths(config, start_node, None)

            # Combine the old and new paths
            full_path = old_results["path"] + new_results["path"][1:]

            print(f'-MapNavigator-: Combined path: {full_path}')

            # the rest of the results values take on new_results
            results = {
                "score": new_results["score"] + old_results["score"],
                "path": full_path,
                "dp_table": new_results["dp_table"]
            }

        else:
            # get results of the current path
            results = self._score_paths(config, start_node, None)

        self.scores_result = results

        return results



    def _score_paths(self, config: PathOptions, start_node: Node = None, end_node: Node = None):

        best = {} # best scores
        parent = {} # previous nodes
        start = None

        if start_node is None:
            print(f'-MapNavigator-: start from beginning')
            start = next(n for n in self.node_map.values() if n.type == "ancient")
        else:
            print(f'-MapNavigator-: Using start node: {start_node}')
            start = start_node

        # state = (coord, can_take_elite: bool)
        best[(start.coords, True)] = 0

        nodes_by_row = sorted(self.node_map.values(), key=lambda n: n.coords[1])

        
        if start_node is None:
            # Filter nodes to only include those on a row below the end node
            nodes_by_row = [n for n in nodes_by_row if n.coords[1] < end_node.coords[1]]
        else:
            # Filter nodes to only include those on a row at or above the start node
            nodes_by_row = [n for n in nodes_by_row if n.coords[1] >= start.coords[1]]

        print(f'-MapNavigator-: filtered nodes by row {nodes_by_row}')

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
        
        if end_node is None:
            print(f'-MapNavigator-: end at boss')
            end = next(n for n in self.node_map.values() if n.type == "boss")
        else:
            print(f'-MapNavigator-: Using end node: {end_node}')
            end = end_node

        end_key = max(
            [(end.coords, True), (end.coords, False)], 
            key=lambda k: best.get(k, float('-inf'))
        )


        #num_nodes_in_path = self.map_height
        #if self.scores_result:
        #    old_path = self.scores_result["path"]
        #else:
        #    old_path = []
        new_path = []
        cur = end_key


        print(f'-MapNavigator-: Parent length: {len(parent)}')

        while cur in parent:
            coord, _ = cur
            new_path.append(self.node_map[coord])
            cur = parent[cur]

        # add start
        new_path.append(self.node_map[cur[0]])
        
        #if old_path:
        #    old_path = old_path[:(num_nodes_in_path - len(new_path))]
        #    old_path.reverse()

        #new_path.extend(old_path)
        new_path.reverse()

        print(f'-MapNavigator-: New path: {[n.coords for n in new_path]}')

        self.scores_result = {
            "score": best[end_key],
            "path": new_path,
            "dp_table": best
        }

        return self.scores_result

    def step_to_most_recently_visited_node(self):
        most_recently_visited_coords = (
            self.current_run_data["visited_map_coords"].pop() 
            if self.current_run_data["visited_map_coords"] 
            else None
        )

        print(f"-MapNavigator-: most_recently_visited_coords: {most_recently_visited_coords}")

        if most_recently_visited_coords is not None:
            most_recently_visited_node = self.node_map[
                (most_recently_visited_coords["col"], most_recently_visited_coords["row"])
            ]

            # If most_recently_visited_node is not in the current determined best path, 
            # recalculate the path using most_recently_visited_node as the new start.

            if not self.scores_result or most_recently_visited_node not in self.scores_result["path"]:
                self.score_paths(most_recently_visited_node)

            #if most_recently_visited_node is not self.current_node:
            return self._step_until(most_recently_visited_node)

        
        return "NODE STEPPING FAILURE!!"

    def _step_until(self, node: Node):
        path = self.scores_result["path"]
        for n in path:
            if n == node:
                self.current_node = n
                break
        
        return self._get_next_direction_str()

    def _get_next_direction_str(self):
        node = self.current_node
        path = self.scores_result["path"]
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
        else:
            direction_str = 'Go straight!'
        return f'At node {node.coords} of type {node.type}\n{direction_str}'
    
    def get_direction_str(self):
        return self._get_next_direction_str()

    def update_run_data(self, data):
        # Update data if visited coords differ
        if self.current_run_data and (
            self.current_run_data["visited_map_coords"]
            is not data["visited_map_coords"]
        ):
            self.current_run_data = data
            self.score_paths(None)

        if data["current_act_index"] != self.current_act:
            self.current_act = data["current_act_index"]
            self.map_height = data["acts"][self.current_act]["saved_map"]["height"] + 1
            print(f'Moving on to act {self.current_act}, map height: {self.map_height}')
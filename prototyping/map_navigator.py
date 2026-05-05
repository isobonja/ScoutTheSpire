from constants import *
from map_types import *

from path_config import PathOptions


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
        current_run_data = None
    ):
        self.current_run_data = current_run_data
        
        self.path_option = PathOptions.MOST_REST_SITES
        self.node_map = {}
        self.scores_result = None
        self.current_node = None
    
    

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
        current_act = self.current_run_data["current_act_index"]
        map_data = self.current_run_data["acts"][current_act]["saved_map"]
        return self._construct_nodes(map_data)


    ###########################################
    #   DYNAMIC PROGRAMMING - SCORING PATHS   #
    ###########################################
    def score_paths(self, config: PathOptions):
        config = config.value

        best = {} # best scores
        parent = {} # previous nodes

        start = next(n for n in self.node_map.values() if n.type == "ancient")

        # state = (coord, can_take_elite: bool)
        best[(start.coords, True)] = 0

        nodes_by_row = sorted(self.node_map.values(), key=lambda n: n.coords[1])

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
        
        end = next(n for n in self.node_map.values() if n.type == "boss")

        end_key = max(
            [(end.coords, True), (end.coords, False)], 
            key=lambda k: best.get(k, float('-inf'))
        )

        path = []
        cur = end_key

        while cur in parent:
            coord, _ = cur
            path.append(self.node_map[coord])
            cur = parent[cur]

        # add start
        path.append(self.node_map[cur[0]])
        path.reverse()

        self.scores_result = {
            "score": best[end_key],
            "path": path,
            "dp_table": best
        }

        return self.scores_result

    def step_to_most_recently_visited_node(self):

        # The log updates when a node is selected, and when the event/combat ends.
        # This leads to multiple instances of the print statements being printed for the 
        #   same node.
        # I will need to implement a stricter system for when this runs, instead of running 
        # every time the log file changes.
        #
        # ANALYSE THE LOG FILE BETWEEN THE BEGINNING OF A NODE EVENT/COMBAT AND THE END!!!


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
    

    def update_run_data(self, data):
        if self.current_run_data and self.current_run_data is not data:
            self.current_run_data = data
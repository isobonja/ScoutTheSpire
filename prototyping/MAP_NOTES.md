# Notes for recreating in-game map for each act

## Log file info
While there exists a run, there is a `current_run.save` file which contains info about that particular run.

Below will be the info that becomes available after certain stages of a run:

### Immediately after starting run
Before selecting the Neow relic, the information that is available in the log file is:
- Information about each act, including
    - Act ID
    - Ancient
    - Act boss ID
    - Possible elite/enemy/event IDs
- Act 1 Map
- Ascension
- "current_act_index"
- "extra_fields"
- "game_mode"
- "map_drawings"
- "modifiers"
- "odds"
- "platform_type"
- "players" - details about all player characters in run
- "pre_finished_room": null
- "rng" - includes seed
- "run_time" - might be way to track when file is modified?
- "start_time"
- "visited_map_coords"
- "win_time"

#### Act 1 Map
In the log, the map information is stored under `data["acts"][0]["saved_map"]`.

This "saved_map" object has the structure:
```json
"saved_map": {
    "boss": {
        "can_modify": true,
        "coord": {
            "col": 3,
            "row": 16
        },
        "type": "boss"
    },
    "height": number,
    "points": [
        {
            "can_modify": true,
            "children": [
                {
                    "col": number,
                    "row": number
                }
            ],
            "coord": {
                "col": number,
                "row": number
            },
            "type": "unknown" | "monster" | "rest_site" | "elite" | "treasure" | "shop"
        },
        ...
    ],
    "start": {
        "can_modify": true,
        "children": [...],
        "coord": {...},
        "type": "ancient"
    },
    "start_coords": [...],
    "width": 7
}

```

I'll create a recreation of the map by using the "points" list. The "children" subkey will be used to mark which points follow. 

##### Ideas for how to do this:
Idea A: 
- Save "width" (num cols) and determine height (num rows) from "boss" object coords
- Create Node class with variables "type", "coordinate" (tuple), "children" (Node objects)
- Create a Map of Nodes (including start and boss) with keys of coordinate tuples 
- Go thru each node and update its "children" list with all other corresponding Nodes, using the Set to find the nodes

- Implement the "best path" determination using dynamic programming - save scores for each node based on weight set for each type of node for different conditions

i.e. the "most rest sites" condition would have a simple scoring dict such as:

{
    "rest_site": 1,
    "elite": 0,
    "monster": 0,
    "unknown": 0,
    "shop": 0,
}

For cases such as "most elites, but avoid having 2+ elites w/o rest site between them, you can just add a massive negative score to the score map for that node if it violates this constraint. 




## NEXT STEPS

If I deviate off of the recommended path, the app should recalculate the path, using my current node as the starting node, and determine a new path. 
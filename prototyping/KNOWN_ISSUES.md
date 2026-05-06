 - Currently, each node is "stepped to" multiple times, as the condition for this is too lax - it runs whenever the log file changes, not specifically when the player location changes. 

 ** Might be possible to be fixed simply by comparing only "visited_map_coords" instead of the whole of the data. **

 - If the player strays from the initial path determined on app startup, the app gets stuck repeatedly suggesting a direction from the last node of the path the player has gone past.

 - When switching to the next act, "Error Processing log File" keeps being printed out. Look closely at how the log changes when switching acts. 
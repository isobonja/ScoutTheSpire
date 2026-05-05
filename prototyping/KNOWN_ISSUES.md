 - Currently, each node is "stepped to" multiple times, as the condition for this is to lax - it runs whenever the log file changes, not specifically when the player location changes. 

 - If the player strays from the initial path determined on app startup, the app gets stuck repeatedly suggesting a direction from the last node of the path the player has gone past.

 - When switching to the next act, "Error Processing log File" keeps being printed out. Look closely at how the log changes when switching acts. 
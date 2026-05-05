from dataclasses import dataclass
from enum import Enum

@dataclass
class PathConfig:
    weights: dict
    no_consecutive_elites: bool = False

class PathOptions(Enum):
    MOST_ELITES = PathConfig(weights={"elite": 1})
    MOST_REST_SITES = PathConfig(weights={"rest_site": 1})
    MOST_SHOPS = PathConfig(weights={"shop": 1})
    MOST_UNKNOWN = PathConfig(weights={"unknown": 1})
    MOST_MONSTERS = PathConfig(weights={"monster": 1})
    LEAST_ELITES = PathConfig(weights={"elite": -1})
    LEAST_MONSTERS = PathConfig(weights={"monster": -1})
    MOST_ELITES_NO_CONSECUTIVE = PathConfig(
        weights={"elite": 1},
        no_consecutive_elites=True
    )
    MOST_ELITES_NO_CONSECUTIVE_AND_REST_SITES = PathConfig(
        weights={"elite": 1, "rest_site": 1},
        no_consecutive_elites=True
    )

# Could be worthwhile maybe setting up a system that allows 
# thing such as "prefer short strings of nodes between rest sites", 
# or maybe "prefer paths where the number of nodes between rest 
# sites is as close to the same as any other set of nodes between 
# rest sites"


# Set up a system where options can be combined or set up with 
# priorities, such as "most elites, but also prefer rest sites"

# instead of having extra options for base critera with modifications, 
# separate modifications into a different system
# i.e. instead of having MOST_ELITES_NO_CONSECUTIVE, only have the 
# MOST_ELITES base option, but then attach a modifier of "no conseuctive
# elites"
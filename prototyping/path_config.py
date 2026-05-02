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
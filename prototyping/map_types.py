from __future__ import annotations
from dataclasses import dataclass


@dataclass
class MapData:
    boss: MapPoint
    height: int
    points: list[MapPoint]
    start: MapPoint
    start_coords: list[MapCoord]
    width: int

@dataclass
class MapPoint:
    can_modify: bool
    children: list[MapCoord]
    coord: MapCoord
    type: str

@dataclass
class MapCoord:
    col: int
    row: int
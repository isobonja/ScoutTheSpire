# ScoutTheSpire (IN DEVELOPMENT)

A Slay the Spire 2 Assistant App. This monorepo contains the app, as well as tools and prototypes for certain app features. No features are final, as the app is very much still in development.

## Directory

- app/ - *The main ScoutTheSpire app*
- prototyping/ - *Python prototypes for future features*
- data/ - *Constant JSON data to be used in the main app or the tagger*
- tagger/ - *A tool for attaching tags to card options from the game (NEEDS COMPLETE REWORK)*

## Architecture

ScoutTheSpire is built using a combination of Electron.js, Vite, and React, and is primarily written in TypeScript. The app uses Tailwind CSS v4 and shadcn/ui for layout and design. The app uses the spire-codex API (https://www.spire-codex.com) to retrieve game info/assets. The app retrieves data using the 'axios' library, and caches data locally to prevent unnecessarily repetitive requests towards the API.

## Features

Currently, the main ScoutTheSpire app only displays various types of player data, including:
- Overall Stats (architect damage, floors climbed, total playtime, overall WL ratio)
- Character Stats (WL ratio, playtime, best win streak, max ascension)
- Ancient Stats (per-character WL ratios)
- Encounter Stats (times encountered/defeated/lost to)
- Enemy Stats (times encountered/defeated/lost to)
- Epochs

This player info panel includes a dynamic and responsive layout. 

## Future Features/Goals

The ultimate goal for the app is to have it serve as the ultimate companion for Slay the Spire 2 players. As such, many ideas for useful features are yet to be started on:

### Discoveries Panel
A panel that will display all cards, relics, and potions, and whether they have yet to be discovered or not. 

### Run History
If available on the local machine, this panel will display data from a user's previous runs, including their run outcome, playtime, deck, relics, etc. It will also include a separate statistics section that will contain statistical analyses using the run data to present information not available directly in the game's profile JSON.

### Map Navigator
This panel will display a model of the map from the user's current run in real time, and will provide advice as to which path(s) would be best to take, based on defined requirements and/or preferences. This will also be accompanied by directional guidance in the game overlay during the user's run.

### Synergy Graph
Within the game, cards are grouped into sets for each character, plus colorless cards. However, there are opportunities in the game to be able to acquire cards from a character the player is not currently using, but in many of these situations, you need to select the character whose deck to pick from before you see the card options, and it is tricky to remember all of the cards from other characters' decks that might work with your current strategy. Thus, this panel would be useful, as it would display a massive graph of nodes and edges, where every card in the game is a node, and the edges between nodes represent the level of synergy between any pair of cards. When a selection would need to be made in-game, cards with the highest synergy would be marked for the user. 

This graph will also be able to be used outside of a run for any research/planning purposes. It would include a full suite of search/filter/sorting options as well.

The primary purpose of the 'tagger' tool within this monorepo is to attach tags to every card in the game so that an algorithm could determine a "synergy score" for each pair of cards, which would be used to create this graph.

### In-Game Overlay
The app would include the option for an in-game overlay, which would give suggestions/advice during card selections, shops, ancient relic options, events, etc. In the accessible game logs, the options for a card choice, for example, are only added after the choice has been made, which defeats the purpose, so some sort of OCR screen-reading system will need to be implemented for this overlay.

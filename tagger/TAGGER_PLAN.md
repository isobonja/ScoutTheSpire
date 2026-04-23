# The Plan

Each card is represented as an object with the structure below:
```json
{
    "id": "ABRASIVE",
    "name": "Abrasive",
    "description": "Gain 1 [gold]Dexterity[/gold].\nGain 4 [gold]Thorns[/gold].",
    "description_raw": "Gain {DexterityPower:diff()} [gold]Dexterity[/gold].\nGain {ThornsPower:diff()} [gold]Thorns[/gold].",
    "cost": 3,
    "is_x_cost": null,
    "is_x_star_cost": null,
    "star_cost": null,
    "type": "Power",
    "type_key": "Power",
    "rarity": "Rare",
    "rarity_key": "Rare",
    "target": "Self",
    "color": "silent",
    "damage": null,
    "block": null,
    "hit_count": null,
    "powers_applied": [
        {
            "power": "Thorns",
            "power_key": "Thorns",
            "amount": 4
        },
        {
            "power": "Dexterity",
            "power_key": "Dexterity",
            "amount": 1
        }
    ],
    "cards_draw": null,
    "energy_gain": null,
    "hp_loss": null,
    "keywords": [
        "Sly"
    ],
    "keywords_key": [
        "Sly"
    ],
    "tags": null,
    "spawns_cards": null,
    "vars": {
        "ThornsPower": 4,
        "Thorns": 4,
        "DexterityPower": 1,
        "Dexterity": 1
    },
    "upgrade": {
        "thornspower": "+2"
    },
    "image_url": "/static/images/cards/abrasive.png",
    "beta_image_url": "/static/images/cards/beta/abrasive.png",
    "type_variants": null,
    "compendium_order": 147
}
```

The tagger app will need to display the values of these keys:
```json
["name", "description", "cost", "type", "rarity", "color", "keywords", "image_url"]
```

The "id" key will be used internally to refer to each card. 

Those values will be displayed in a similar structure to the in game cards. Itll probably be placed on the left-hand side of the app window.

On the right will be the tags. It will start blank, but will allow me to create tag categories and then tags.

THese tags will be displayed as a checkbox (or equivalent selectable component), then, with a button (or key) press, the selected 
tags get saved with that card in the `data/card_tags.json` file. ["card_tags.json  will use the structure `<card_id>: [tags]`."]

---

For the time being, the card info will be read locally from `data/cards.json`, but this should eventually be replaced with fetch/axios 
requests to fetch from spire-codex.com (mainly to handle any card updates/additions made in the game).


The resulting JSON with the card to tags maps will be used within the main app.


# TO DO

Update tag pre-selection code to include as many cases as possible (mostly relating to the card desciption) 

Preload image for next card (so that there's no loading time)


Instead of only retrieving card data directly from the spire-codex site in the final version, save a local copy of the data to read from.
 - Retrieve card data JSON on app open (maybe less frequently instead?), compare it to existing saved card data (if file exists); if requested data has differences compared to locally saved data (if it exists), then update locally saved data with new data
 - Determine which cards are updated to present the user with those cards to update their tags if necessary
    - REMEMBER: some cards can be removed from the game, so will need to check that as well
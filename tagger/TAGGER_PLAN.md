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





Pre-select tags that can be determined from card info, such as rarity, type, keywords, as well as the description (would need some kind of parsing function).
 - If the app thinks a tag should exist and it doesn't, include a phantom tag in the respective column (that is still automatically selected). If the user does not interact with it, the tag will be created. If they do, then ask them whether the tag should be kept or not. 


Add visual indicators for required columns, as well as when users try to attach tags to a card without having selected tags from all required columns. 

Preload image for next card (so that there's no loading time)
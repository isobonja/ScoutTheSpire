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

---

So an issue with the current tagging app is it is missing any kind of indication about whether cards are dependent on having certain 



# BIG UPDATE:

## Tagging system
I need to rework the tagging system almost completely. The tags currently are kind of all over the place, and also only describe what systems each card interacts with, not how.

I will keep the "objective" tag categories (class, type, rarity, cost) as is.

Other categories related to strats, debuffs, buffs, etc. will be more complex. Each tag will be represented as a dropdown/submenu toggle in the UI that will present the user with role tags that describe what purpose the card serves:

- *Enabler*: Cards that create conditions needed for certain strats
- *Payoff*: Cards that benefit only when conditions for a strat exist (i.e. Accelerant requiring poison sources)
- *Scaler*: Cards that make strat stronger over time (i.e. Molten Fist) 
- *Consistency*: Cards that make the strat more reliable (i.e. draw, retain, energy gain)
- *Setup*: Cards that setup a strat at the beginning of a combat (i.e a lot of powers)
- *Frontload*: Cards that provide powerful early impacts
- *Finisher*: Cards intended to finish combats

Not all of the above have to be implemented immediately, but it would be useful.

### Example
Within the 'debuff' group, we would have 'vulnerable' with a sub-menu containing 'Enabler', 'Payoff', 'Scaler', etc. toggles. If any of these are toggled on, the base tag 'vulnerable' is also automatically selected. 


## JSON Structure Change
With these changes, the structure for both the `tags.json` and `card_tags.json` files will need to be changed:

### Tags.json
Currently the structure is:
```json
[
    ...
    "debuffs": {
        "limit": 0,
        "required": false,
        "weight": 1,
        "tags": [
            "poison",
            "vulnerable",
            "doom",
            "weak",
            "strength_loss",
            "enemy_strength_loss",
            "status_removal",
            "block_removal"
        ]
    }
    ...
]
```

** Actually, this file might not need to be changed. If we just let every tag (outside of the "objective" tags) have choices for all role tags (Enabler, Payoff, etc.), then we'd just generate those options in the frontend. Then, once a tag is added to a card, it would be saved properly in `card_tags.json` (i.e. 'vulnerable_payoff'). **

******************** ACTUALLY ACTUALLY, Do change it and include specific lists of allowed roles for each tag (because some role tags would not make sense for some tags). Use the structure shown as an example at the bottom of the section below. *********************

### card_tags.json

ChatGPT suggested something like:
```json
{
  "objective": {
    "class": "ironclad",
    "type": "attack",
    "rarity": "uncommon",
    "cost": 1
  },

  "mechanics": {
    "vulnerable": {
      "apply": true,
      "payoff": true,
      "scale": false,
      "convert": false,
      "support": false
    },

    "weak": {
      "apply": true,
      "payoff": false
    },

    "exhaust": {
      "enable": false,
      "payoff": true
    }
  },

  "strategic_roles": {
    "frontload": true,
    "anti_elite": true,
    "setup": false,
    "scaling": false
  },

  "dependencies": [
    {
      "requires": "poison_apply",
      "minimum": 2
    }
  ],

  // IDEA: Include a section for "anti-synergy" of some kind

  "notes": [
    "Only strong if poison source already exists"
  ]
}
```

I am not sure about the "mechanics" and "strategic_roles" keys in this schema, but I like the "objective" key, the inclusion of explicit dependencies (though I don't know if I'll need the "minimum"), and "notes" just in case.

This example has different amounts of role tags available for different mechanics. If I don't have all role tags available as subroles for all tags, then in `tags.json`, I will need to change the structure to include the specific role tags that should be presented as options for tags, such as this:

```json
[
    "debuffs": {
        "limit": 0,
        "required": false,
        "weight": 1,
        "tags": [
            {
                "name": "poison",
                "roles": ["enabler", "payoff", "scaler"]
            },
            {
                "name": "vulnerable",
                "roles": ["enabler", "payoff", "scaler", "support", "frontload"]
            },
            ...
        ]
    }
]
```

That seems like it might be pretty clunky, and I'm starting to think I should have maybe just decided to use SQLite3 instead of JSON for all of this, but for now, I'll commit to keep using JSON.


## Similar Card display
When presented with a card in the tagging app, below the current card, show a display of a card with similar tags based on the selected tags for the current card. Since the app has some auto-selection capabilities, it might be possible to immediately display a similar card. It should update if a new tag selection makes another card more similar though.

## Layout Changes
Swap the sides of the Card Display and Tagging Panel, so that the Tagging Panel is on the left and the Card Display is on the right. Place the "Attach tags to card" button at the bottom right corner of the app window. 

## Extra
Include version numbers for each schema attempt.
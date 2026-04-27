import { useEffect, useMemo, useState } from 'react';
import './App.css';
import CardDisplay from './components/CardDisplay';
import TaggingPanel from './components/TaggingPanel';

import { TagsData, Card, SelectedTags, CardTagData } from '../shared/types';
import { Button } from './components/ui/button';
import { toast } from 'sonner';

function App() {
  const [cardData, setCardData] = useState<Card[] | null>(null);
  
  const [tagsData, setTagsData] = useState<TagsData | null>(null);

  // List of category to tag lists
  const [selectedTags, setSelectedTags] = useState<SelectedTags>({});

  const [cardTagData, setCardTagData] = useState<CardTagData>({});

  // Things the pre-select algorithm determines should be tags, but do not exist yet
  // Ideally, they would show up visually as "phantom tags", selected by default.
  // If the user clicks the Add Tags button without unselecting them, they will be created and added to the card as normal.
  // If the user deselects the tag, there should be a popup asking if it should be created or ignored.
  //const [temporaryTags, setTemporaryTags] = useState<SelectedTags>({});

  const currentCard = useMemo(() => {
    if (!cardData) return null;
    return cardData.find(card => !cardTagData[card.id]) ?? null;
  }, [cardData, cardTagData]);

  const currentCardIndex = useMemo(() => {
    if (!cardData) return null;
    return cardData.findIndex(card => !cardTagData[card.id]);
  }, [cardData, cardTagData]);

  useEffect(() => {
    const fetchCardData = async () => {
      const data = await window.api.readCards();
      setCardData(data);
      //console.log('Card Data:', data);
    };

    const fetchTagsData = async () => {
      const data = await window.api.readTags();
      setTagsData(data);
      //console.log('Tags Data:', data);
    };

    const fetchCardTagsData = async () => {
      const data = await window.api.readCardTags();
      setCardTagData(data);

    };

    fetchCardData();
    fetchTagsData();
    fetchCardTagsData();
  }, []);

  useEffect(() => {
    if (!tagsData) return;

    setSelectedTags(prev => {
      const updated: SelectedTags = { ...prev };

      for (const category in tagsData) {
        if (!updated[category]) {
          updated[category] = [];
        }
      }

      return updated;
    });
  }, [tagsData]);

  const tagIndex = useMemo(() => {
    const map = new Map<string, string>();

    for (const [category, data] of Object.entries(tagsData ?? {})) {
      for (const tag of data.tags) {
        map.set(tag, category);
      }
    }

    return map;
  }, [tagsData]);

  function resolveTag(tag: string) {
    return tagIndex.get(tag);
  }

  function preSelectTags() {
    if (!currentCard || !tagsData) return;

    //console.log("Base selectedTags", structuredClone(selectedTags));
    
    const newSelectedTags: SelectedTags = Object.fromEntries(
      Object.keys(selectedTags).map(category => [category, []])
    );

    //console.log("Base newSelectedTags", structuredClone(newSelectedTags));

    function addPreSelectedTagFromBasicCategory(category: string, value: string) {
      const tag = value.toLowerCase();
      //console.log('tag', tag);
      if (!currentCard || !tagsData) return;
      const categoryData = tagsData[category];
      if (categoryData) {
        const tagExists = categoryData.tags.includes(tag);
        //console.log('tagExists', tagExists);
        if (!newSelectedTags[category]) {
          newSelectedTags[category] = [];
        }
        newSelectedTags[category].push({ value: tag, isTemporary: !tagExists });
      }
    }

    function addPreSelectedTagFromUnknownCategory(value: string, override?: string) {
      const tag = value.toLowerCase().replace(/\s+/g, "_");

      const category = resolveTag(tag);
      if (!category) return;

      if (!newSelectedTags[category]) {
        newSelectedTags[category] = [];
      }

      newSelectedTags[category].push({
        value: override ?? tag,
        isTemporary: false,
      });
    }


    // cost
    if (currentCard.cost !== undefined) {
      addPreSelectedTagFromBasicCategory('cost', currentCard.is_x_cost ? 'X_cost' : currentCard.cost.toString());
    }

    //console.log('newSelectedTags after cost:', structuredClone(newSelectedTags));

    // type
    if (currentCard.type) {
      addPreSelectedTagFromBasicCategory('type', currentCard.type);
    }

    //console.log('newSelectedTags after type:', structuredClone(newSelectedTags));

    // rarity
    if (currentCard.rarity) {
      addPreSelectedTagFromBasicCategory('rarity', currentCard.rarity);
    }

    console.log('newSelectedTags after rarity:', structuredClone(newSelectedTags));

    // color/class
    if (currentCard.color) {
      addPreSelectedTagFromBasicCategory('class', currentCard.color);
    }

    // keywords
    if (currentCard.keywords) {
      currentCard.keywords.forEach(keyword => {
        addPreSelectedTagFromBasicCategory('keywords', keyword);
      });
    }

    // description: could be complicated
    // an idea would be to parse the description for any words that match existing tags in any 
    //   category that is not used above
    // this would be alright, but it could be more effective.

    // some tags, such as "summon_osty", would need to be mapped to 'Osty' and/or 'Summon', so 
    //   to get the most effectiveness from this, I'd need to store some kind of map of tag names 
    //   to keywords to look for in the desc. 

    // atm that would have to be hardcoded, but ideally the user should be able to add to this 
    //   mapping. 

    // IMPLEMENT LATER



    // For now, check for text between [gold][/gold] tags
    if (currentCard.description) {
      if (currentCard.is_x_star_cost || currentCard.star_cost) {
        addPreSelectedTagFromUnknownCategory('stars');
      }

      if (currentCard.is_x_cost) {
        addPreSelectedTagFromBasicCategory('cost', 'x_cost');
      }
      /*
        TO ADD: 
        - discard
        - [Pp]ut\s.+\sinto\s.+\shand -> put_into_hand
        - [Ll]ose\s\d+\s[Ss]trength -> strength_loss
        - /[Ee]nem(?:(?:y)|(?:ies))\s[Ll]oses?\s\d+\s[Ss]trength/ -> enemy_strength_loss

      */
      const patterns = [
        {
          regex: /\[gold\](.*?)\[\/gold\]/g,
          transform: (m: RegExpMatchArray) => m[1],
          override: undefined,
        },
        {
          regex: /[Ll]ose\s+\d+\s+HP/g,
          transform: () => "hp_loss",
          override: "hp_loss",
        },
        {
          regex: /[Gg]ain\s\[energy:+\d+\]/g,
          transform: () => "energy_gain",
          override: "energy_gain",
        },
        {
          regex: /[Dd]raw\s\d*\s?cards?/g,
          transform: () => "draw",
          override: "draw",
        },
        {
          regex: /[Oo]sty|Summon/g,
          transform: () => "summon_osty",
          override: "summon_osty",
        },
        {
          regex: /[Pp]ut\s.+\sinto\s.+\s[Hh]and/g, // Is not functioning for some reason
          transform: () => "put_into_hand",
          override: "put_into_hand",
        },
        {
          regex: /[Ll]ose\s\d+\s[Ss]trength/g,
          transform: () => "strength_loss",
          override: "strength_loss",
        },
        {
          regex: /[Ee]nem(?:(?:y)|(?:ies))\s[Ll]oses?\s\d+\s[Ss]trength/g,
          transform: () => "enemy_strength_loss",
          override: "enemy_strength_loss",
        }
      ];
      patterns.forEach(({ regex, transform, override }) => {
        let match;

        while ((match = regex.exec(currentCard.description)) !== null) {
          const value = transform(match);
          addPreSelectedTagFromUnknownCategory(value, override);
        }
      });
    }

    setSelectedTags(newSelectedTags);

  }


  // PRE-SELECTION ALGORITHM BASED ON CARD PROPERTIES (cost, type, rarity, color, keywords, description parsing for potential tags)
  // WIP; might be better placed in a separate file.

  useEffect(() => {
    // Select tags ahead of time based on current card info
    if (!currentCard || !tagsData) return;
    preSelectTags();

  }, [currentCard]);

  useEffect(() => {
    console.log('Selected Tags:', selectedTags);
  }, [selectedTags]);

  const handleAddCategory = async (category: string, required: boolean, limit: number) => {
    if (category.trim() === '') return; // Prevent adding empty category
    const result = await window.api.addTagCategory(category, limit, required);
    if (result.success) {
      setTagsData(result.data);
    }
  }

  const handleAddTag = async (category: string, tag: string) => {
    await window.api.addTagsToCategory(category, [tag]);
    const updatedTags = await window.api.readTags();
    setTagsData(updatedTags);
  }

  const handleSelectTag = async (category: string, tag: string) => {
    setSelectedTags(prev => {
      const currentTags = prev[category] || [];
      const categoryConfig = tagsData?.[category];

      if (!categoryConfig) return prev;

      const limit = categoryConfig.limit;

      const isSelected = currentTags.some(t => t.value === tag);

      // If removing, always allowed
      if (isSelected) {
        return {
          ...prev,
          [category]: currentTags.filter(t => t.value !== tag)
        };
      }

      // If adding, enforce limit
      if (limit !== 0 && currentTags.length >= limit) {
        // Option 1: do nothing (hard limit)
        return prev;

        // Option 2 (alternative UX): replace oldest
        // return {
        //   ...prev,
        //   [category]: [...currentTags.slice(1), tag]
        // };
      }

      // Otherwise add normally
      return {
        ...prev,
        [category]: [...currentTags, { value: tag }]
      };
    });
  };

  const handleAddTagsToCard = async () => {
    if (!currentCard || !tagsData) return;

    const requiredCategories = Object.entries(tagsData)
      .filter(([_, value]) => value.required)
      .map(([key]) => key);

    const selectedCategories = Object.entries(selectedTags)
      .filter(([_, tags]) => tags.length > 0)
      .map(([key]) => key);

    const missingRequired = requiredCategories.filter(
      c => !selectedCategories.includes(c)
    );

    if (missingRequired.length > 0) {
      toast.error("Not all required categories had tags selected!", {
        position: "bottom-left",
      });
      return;
    }

    const selectedTagsList = Object.values(selectedTags)
      .flat()
      .map(tag => tag.value);

    if (selectedTagsList.length === 0) return;

    await window.api.addTagsToCard(currentCard.id, selectedTagsList);

    toast.success(`Added tags ${selectedTagsList.join(", ")} to card ${currentCard.id}`, { position: "bottom-left", className: "bg-amber-500"});

    const groupedTemporaryTags = Object.entries(selectedTags).reduce(
      (acc, [category, tags]) => {
        const values = tags
          .filter(t => t.isTemporary)
          .map(t => t.value);

        if (values.length > 0) {
          acc[category] = Array.from(new Set(values)); // dedupe per category
        }

        return acc;
      },
      {} as Record<string, string[]>
    );

    const tempPromises = Object.entries(groupedTemporaryTags).map(
      ([category, values]) =>
        window.api.addTagsToCategory(category, values)
    );

    await Promise.all(tempPromises);

    setTagsData(prev => {
      if (!prev) return prev;

      const updated = { ...prev };

      for (const [category, tags] of Object.entries(groupedTemporaryTags)) {
        const categoryData = updated[category];
        if (!categoryData) continue;

        const existing = new Set(categoryData.tags);

        for (const value of tags) {
          const normalized = value.toLowerCase();

          // Only add if not already present
          if (!existing.has(normalized)) {
            categoryData.tags.push(normalized);
          }
        }
      }

      return updated;
    });

    setSelectedTags(
      Object.fromEntries(
        Object.keys(tagsData).map(category => [category, []])
      )
    );

    setCardTagData(prev => ({
      ...prev,
      [currentCard.id]: selectedTagsList,
    }));
  };

  //const card = cardData?.[230];

  return (
    <div className="h-screen min-h-screen min-w-screen bg-app flex gap-4 p-6 items-start">
      <div className='aspect-9/13 min-w-2xs flex-3'>
        <CardDisplay card={currentCard} />
        {/*<CardDisplay
          name={currentCard?.name}
          description={currentCard?.description}
          cost={currentCard?.cost}
          cardType={currentCard?.type}
          rarity={currentCard?.rarity}
          cardClass={currentCard?.color}
          imageUrl={currentCard?.image_url ? 'https://spire-codex.com' + currentCard.image_url : undefined}
          keywords={currentCard?.keywords || []}
        />*/}
        <div className='w-full flex flex-col items-center mt-2 gap-2'>
          <span className='text-gray-400 text-md italic'>Card {currentCardIndex !== null ? `(${currentCardIndex + 1}/${cardData?.length})` : ""}</span>
        </div>
        <Button 
          className='mt-4 w-full hover:bg-gray-700 hover:border hover:border-white' 
          onClick={() => console.log('Selected Tags:', selectedTags)}
        >
          Log Selected Tags
        </Button>
        <Button 
          className='mt-4 w-full bg-green-800 hover:bg-green-700 hover:border hover:border-white text-white' 
          onClick={handleAddTagsToCard}
        >
          + Attach Selected Tags
        </Button>
      </div>

      <TaggingPanel 
        className='flex-9 h-full min-h-0 min-w-0' 
        tagData={tagsData ?? {}} // Pass empty object if tagsData is null to avoid errors in child components
        addCategory={handleAddCategory}
        addTag={handleAddTag}
        selectedTags={selectedTags}
        onSelectTag={handleSelectTag}
      />
    </div>
  );
}

export default App;
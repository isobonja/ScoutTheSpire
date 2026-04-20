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

  const currentCard = useMemo(() => {
    if (!cardData) return null;
    return cardData.find(card => !cardTagData[card.id]) ?? null;
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

  const handleSelectTag = (category: string, tag: string) => {
    setSelectedTags(prev => {
      const currentTags = prev[category] || [];
      const categoryConfig = tagsData?.[category];

      if (!categoryConfig) return prev;

      const limit = categoryConfig.limit;

      const isSelected = currentTags.includes(tag);

      // If removing, always allowed
      if (isSelected) {
        return {
          ...prev,
          [category]: currentTags.filter(t => t !== tag)
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
        [category]: [...currentTags, tag]
      };
    });
  };

  const handleAddTagsToCard = async () => {
    // NEED TO ENFORCE REQUIRED CATEGORIES
    const requiredCategories = Object.entries(tagsData ?? {})
      .filter(([_, value]) => value.required)
      .map(([key]) => key)
    
    const selectedCategories = Object.keys(selectedTags);

    if (!requiredCategories.every(c => selectedCategories.includes(c))){
      toast.error("Not all required categories had tags selected!", { position: 'bottom-center' })
      return;
    };


    const selectedTagsList = Object.values(selectedTags ?? []).flat();
    if (selectedTagsList.length === 0 || !currentCard) return;
    const res = await window.api.addTagsToCard(currentCard.id, selectedTagsList)
    //console.log('Tags added to card', currentCard, ':', selectedTagsList);
    toast.success(`Added tags ${selectedTagsList} to card ${currentCard.id}`, { position: "bottom-center", className: 'bg-amber-500' });

    setSelectedTags(prev => {
      const updated: SelectedTags = { ...prev };

      for (const category in tagsData) {
        updated[category] = [];
      }

      return updated;
    });

    setCardTagData(prev => ({
      ...prev,
      [currentCard!.id]: selectedTagsList
    }));
  }

  //const card = cardData?.[230];

  return (
    <div className="h-screen min-h-screen min-w-screen bg-app flex gap-4 p-6 items-start">
      <div className='aspect-9/13 min-w-2xs flex-3'>
        <CardDisplay
          name={currentCard?.name}
          description={currentCard?.description}
          cost={currentCard?.cost}
          cardType={currentCard?.type}
          rarity={currentCard?.rarity}
          cardClass={currentCard?.color}
          imageUrl={currentCard?.image_url ? 'https://spire-codex.com' + currentCard.image_url : undefined}
          keywords={currentCard?.keywords}
        />
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
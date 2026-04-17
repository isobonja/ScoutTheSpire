import { useEffect, useMemo, useState } from 'react';
import './App.css';
import CardDisplay from './components/CardDisplay';
import TaggingPanel from './components/TaggingPanel';

import { TagsData, Card, SelectedTags } from '../shared/types';
import { Button } from './components/ui/button';

function App() {
  const [cardData, setCardData] = useState<Card[] | null>(null);
  const [tagsData, setTagsData] = useState<TagsData | null>(null);

  // List of category to tag lists
  const [selectedTags, setSelectedTags] = useState<SelectedTags>({});

  useEffect(() => {
    const fetchCardData = async () => {
      const data = await window.api.readCards();
      setCardData(data);
      console.log('Card Data:', data);
    };

    const fetchTagsData = async () => {
      const data = await window.api.readTags();
      setTagsData(data);
      console.log('Tags Data:', data);
    };

    fetchCardData();
    fetchTagsData();
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

  useEffect(() => {
    console.log('selected tags: ', selectedTags);
  }, [selectedTags]);

  const handleAddCategory = async (category: string) => {
    if (category.trim() === '') return; // Prevent adding empty category
    const result = await window.api.addTagCategory(category);
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
      if (currentTags.length >= limit) {
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

  const card = cardData?.[230];

  return (
    <div className="h-screen min-h-screen min-w-screen bg-app flex gap-4 p-6 items-start">
      <div className='aspect-[9/13] min-w-2xs flex-3'>
        <CardDisplay
          name={card?.name}
          description={card?.description}
          cost={card?.cost}
          cardType={card?.type}
          rarity={card?.rarity}
          cardClass={card?.color}
          imageUrl={card?.image_url ? 'https://spire-codex.com' + card.image_url : undefined}
          keywords={card?.keywords}
        />
        <Button className='mt-4 w-full hover:bg-gray-700 hover:border hover:border-white' onClick={() => console.log('Selected Tags:', selectedTags)}>Log Selected Tags</Button>
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
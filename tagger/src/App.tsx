import { useEffect, useMemo, useState } from 'react';
import './App.css';
import CardDisplay from './components/CardDisplay';
import TaggingPanel from './components/TaggingPanel';

import { TagsData, Card } from '../shared/types';

function App() {
  const [cardData, setCardData] = useState<Card[] | null>(null);
  const [tagsData, setTagsData] = useState<TagsData | null>(null);

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

  const handleAddCategory = async (category: string) => {
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

  const card = cardData?.[0];

  return (
    <div className="h-screen min-h-screen min-w-screen bg-slate-900 flex gap-6 p-6 items-start">
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

      <TaggingPanel 
        className='flex-1 h-full min-h-0 min-w-0' 
        categories={tagsData ? Object.keys(tagsData) : []} // Extract categories for passing to form
        addCategory={handleAddCategory}
        addTag={handleAddTag}
      />
    </div>
  );
}

export default App;
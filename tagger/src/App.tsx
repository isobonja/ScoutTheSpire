import { useEffect, useMemo, useState } from 'react';
import './App.css';
import CardDisplay from './components/CardDisplay';

function App() {
  const [cardData, setCardData] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await window.api.readPrototypeJSONFromFile();
      setCardData(data);
      console.log('Card Data:', data);
    };
    fetchData();
  }, []);

  const card = cardData?.[0];

  return (
    <div className="min-h-screen min-w-screen bg-slate-900 flex gap-6 p-6 items-start">
      <CardDisplay
        name={card?.name}
        imageUrl={card?.image_url ? 'https://spire-codex.com' + card.image_url : undefined}
        cost={card?.cost}
        cardClass={card?.color}
        cardType={card?.type}
        description={card?.description}
        keywords={card?.keywords}
      />
    </div>
  );
}

export default App;
import EpochTimelineBox from "./EpochTimelineBox";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { EpochsData } from '../../shared/types/epochs';
import { useState, useEffect } from "react";


function EpochsInfoBox() {

  const [epochsData, setEpochsData] = useState<EpochsData[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const epochs = await window.api.fetchEpochsData();
        setEpochsData(epochs);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [])

  return (
    <div className={`
        w-full
        h-200
        info-panel-colorless
        border-2!
        border-slate-300
        bg-black
        rounded-md
        mt-0!
        relative
      `}
    >
      <h1 className='absolute text-4xl top-4 left-6 text-orange-300 font-extrabold font-heading tracking-wide'>Epochs</h1>
      <ScrollArea className="w-full h-full pt-16 relative whitespace-nowrap">
        {/* Epoch timeline boxes will go here 
        
        The 'left-6' will need to be removed and calculated for each column 
        */}
        <div className="absolute bottom-16 left-6 flex flex-col-reverse min-w-max gap-2 p-2 border border-red-300">
          <EpochTimelineBox text="a"/>
          <EpochTimelineBox text="b" />
          <EpochTimelineBox text="c" />
          <EpochTimelineBox text="d" />
          <EpochTimelineBox text="e" />
        </div>
        <div className='absolute bg-slate-200 w-full h-0.5 left-6 bottom-10' />
        <ScrollBar orientation="horizontal" className="bg-slate-700/50" />
      </ScrollArea>
    </div>
  )
}

export default EpochsInfoBox;

/*
<div className='w-full h-auto info-panel-colorless border-2 border-slate-500 rounded-md p-4'>
        <h2 className='text-xl font-bold mb-4'>Epochs</h2>
        <p className='text-sm text-gray-300'>
          Epochs information will be displayed here. The plan is to have a timeline graphic 
          similar to the one in-game displaying all of the epochs. The user should be 
          able to scroll horizontally by default. Each epoch should be able to be clicked 
          on to show a popup within this EpochsInfoBox with all info about the epoch, 
          including the description, unlock condition, and rewards. Maybe, in the future, 
          filtering options could be added to display only locked/unlocked epochs, 
          epochs that give card rewards, etc.
        </p>
      </div>
      */
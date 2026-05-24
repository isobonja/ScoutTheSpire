import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { capitalize } from "@/utils/general";



function EnemyEncounterInfoBox() {

  const TABS = ["Encounters", "Enemies"]

  return (
    <Tabs defaultValue={TABS[0]} className="w-full h-160 pb-2 mb-2">
      <TabsList className='bg-transparent p-0 h-auto gap-2 mb-0 ps-4'>
        {TABS.map((tab) => (
          <TabsTrigger 
            key={tab} 
            value={tab} 
            className={`
              px-4
              rounded-b-none
              ring ring-slate-700
              text-white!
              animation-none!
              bg-slate-600
              data-active:bg-slate-400!
              data-active:ring-0!
              data-active:border!
              data-active:border-slate-300!
              data-active:border-b-0!
              data-active:-mb-5.25!
              data-active:shadow-none!
              z-10
              mb-0!
            `}
          >
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      {Object.values(TABS).map((tab) => (
        <TabsContent 
          key={tab} 
          value={tab} 
          className={`
            w-full
            h-full 
            info-panel-colorless
            border-2!
            border-slate-300
            bg-transparent
            rounded-md
            mt-0!
            relative
          `}
        >
          <h1 className='text-4xl ms-4 mt-2 text-orange-300 font-extrabold font-heading tracking-wide'>{capitalize(tab)}</h1>
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default EnemyEncounterInfoBox;
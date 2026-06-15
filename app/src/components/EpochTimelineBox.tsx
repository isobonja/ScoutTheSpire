import { EPOCH_TIMELINE_BOX_HEIGHT, EPOCH_TIMELINE_BOX_WIDTH } from "@/constants/epochs";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

type EpochTimelineBoxProps = {
  id: string
  title: string
  description: string
  unlock_info: string
  unlock_text: string | null
  unlocks_cards: string[]
  unlocks_relics: string[]
  unlocks_potions: string[]
  expands_timeline: string[]
}

function EpochTimelineBox({ 
  id, 
  title, 
  description, 
  unlock_info, 
  unlock_text, 
  unlocks_cards, 
  unlocks_relics, 
  unlocks_potions, 
  expands_timeline 
}: EpochTimelineBoxProps) {
  return (
    <div key={id} className="w-full border border-slate-300" style={{ width: EPOCH_TIMELINE_BOX_WIDTH, height: EPOCH_TIMELINE_BOX_HEIGHT }}>
      <HoverCard openDelay={10} closeDelay={100} >
        <HoverCardTrigger asChild>
          <div className="w-full p-2 flex flex-col">
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="flex w-64 flex-col gap-0.5">
          <div>{unlock_info}</div>
          {unlock_text && <div>{unlock_text}</div>}
          {unlocks_cards.length > 0 && (
            <div>
              <h2 className="font-bold">Unlocks Cards:</h2>
              <ul className="list-disc list-inside">
                {unlocks_cards.map((card) => (
                  <li key={card}>{card}</li>
                ))}
              </ul>
            </div>
          )}
          {unlocks_relics.length > 0 && (
            <div>
              <h2 className="font-bold">Unlocks Relics:</h2>
              <ul className="list-disc list-inside">
                {unlocks_relics.map((relic) => (
                  <li key={relic}>{relic}</li>
                ))}
              </ul>
            </div>
          )}
          {unlocks_potions.length > 0 && (
            <div>
              <h2 className="font-bold">Unlocks Potions:</h2>
              <ul className="list-disc list-inside">
                {unlocks_potions.map((potion) => (
                  <li key={potion}>{potion}</li>
                ))}
              </ul>
            </div>
          )}
          {expands_timeline.length > 0 && (
            <div>
              <h2 className="font-bold">Expands Timeline:</h2>
              <ul className="list-disc list-inside">
                {expands_timeline.map((epoch) => (
                  <li key={epoch}>{epoch}</li>
                ))}
              </ul>
            </div>
          )}

        </HoverCardContent>
      </HoverCard>
    {/*<div className="w-full border border-slate-300 p-2 flex" style={{ width: EPOCH_TIMELINE_BOX_WIDTH, height: EPOCH_TIMELINE_BOX_HEIGHT }}>
      {/* Timeline graphic will go here *
      <h1>{title}</h1>
      <p>{description}</p>
    </div>*/}
    </div>
  )
}

export default EpochTimelineBox;
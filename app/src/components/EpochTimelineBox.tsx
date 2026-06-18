import { EPOCH_TIMELINE_BOX_HEIGHT, EPOCH_TIMELINE_BOX_WIDTH } from "@/constants/epochs";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { EpochUnlockType } from "../../shared/types/epochs";

type EpochTimelineBoxProps = {
  id: string
  title: string
  description: string
  unlock_info: string
  unlock_text: string | null
  unlock_type: EpochUnlockType
  unlocks: string[]
  revealed_epochs: string[]
}

function EpochTimelineBox({ 
  id, 
  title, 
  description, 
  unlock_info, 
  unlock_text, 
  unlock_type,
  unlocks,
  revealed_epochs 
}: EpochTimelineBoxProps) {
  return (
    <div key={id} className="w-full border border-slate-300 rounded-lg overflow-hidden" style={{ width: EPOCH_TIMELINE_BOX_WIDTH, height: EPOCH_TIMELINE_BOX_HEIGHT }}>
      <HoverCard openDelay={10} closeDelay={100} >
        <HoverCardTrigger asChild>
          <div className={`
            w-full 
            h-full 
            p-2 
            text-xl 
            flex 
            flex-col 
            select-none 
            justify-center 
            items-center 
            text-center 
            rounded-lg 
            hover:inset-ring-2 hover:inset-ring-purple-300 
            hover:inset-shadow-sm hover:inset-shadow-sky-300
            hover:text-2xl
            `}
          >
            <h1 className=''>{title}</h1>
            {/*<p>{description}</p>*/}
          </div>
        </HoverCardTrigger>
        <HoverCardContent side="left" className="flex w-64 flex-col gap-0.5">
          <div>{unlock_info}</div>
          {unlock_text && <div>{unlock_text}</div>}
          {unlocks.length > 0 && (
            <div>
              <h2 className="font-bold">{unlock_type + " unlocks"}:</h2>
              <ul className="list-disc list-inside">
                {unlocks.map((unlock) => (
                  <li key={unlock}>{unlock}</li>
                ))}
              </ul>
            </div>
          )}
          {revealed_epochs.length > 0 && (
            <div>
              <h2 className="font-bold">Revealed Epochs:</h2>
              <ul className="list-disc list-inside">
                {revealed_epochs.map((epoch) => (
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
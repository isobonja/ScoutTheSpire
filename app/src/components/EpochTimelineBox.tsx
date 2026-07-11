import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";

import { EPOCH_TIMELINE_BOX_HEIGHT, EPOCH_TIMELINE_BOX_WIDTH } from "@/constants/epochs";
import { resolveSTSTextColorFormatTag } from '@/utils/general';

import type { EpochUnlockType } from "shared/types/epochs";

type EpochTimelineBoxProps = {
  /** Epoch ID */
  id: string

  /** Epoch title */
  title: string

  /** Epoch description */
  description: string

  /** Unlock requirements */
  unlock_info: string

  /** Unlock text description */
  unlock_text: string | null

  /** What type of rewards are unlocked by this epoch */
  unlock_type: EpochUnlockType

  /** List of rewards unlocked by this epoch */
  unlocks: string[]

  /** List of other epochs revealed by this epoch */
  revealed_epochs: string[]
}

/**
 * Renders a box representing an epoch in the timeline, displaying its title and providing detailed information on hover.
 */
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
    <div key={id} className="w-full border border-slate-300 bg-gray-950 rounded-lg overflow-hidden" style={{ width: EPOCH_TIMELINE_BOX_WIDTH, height: EPOCH_TIMELINE_BOX_HEIGHT }}>
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
        <HoverCardContent side="left" className="flex flex-col gap-0.5 w-100">
          <div className='text-justify'>{resolveSTSTextColorFormatTag(description)}</div>
          <Separator className='bg-white my-2' />
          <div>{resolveSTSTextColorFormatTag(unlock_info)}</div>
          {unlock_text && <div>{resolveSTSTextColorFormatTag(unlock_text)}</div>}
          <Separator className='bg-white my-2' />
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
          <Separator className='bg-white my-2' />
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
    </div>
  )
}

export default EpochTimelineBox;
/*******************************
 * CURRENTLY UNUSED
 *******************************/
import { PanelType } from "@/types/general";

type ContentPanelProps = {
  selectedPanel: PanelType;
};

function ContentPanel({ selectedPanel }: ContentPanelProps) {

  return (
    <div className='flex-1 p-4 dark:bg-slate-900 h-full'>
      {/*<PlayerInfoPanel hidden={selectedPanel !== 'profile'} />*/}
    </div>
  )
}
  
export default ContentPanel;
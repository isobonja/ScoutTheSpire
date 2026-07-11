import { Map, SearchAlert, UserRoundSearch, Waypoints, History } from "lucide-react";
import SideNavItem from "./SideNavItem";
import type { PanelType } from "@/types/general";

type SideNavProps = {
  /** The currently selected panel */
  selected: PanelType;

  /** Function to handle panel changes */
  onPanelChange: (panel: PanelType) => void;
}

function SideNav({ selected, onPanelChange }: SideNavProps) {
  return (
    <div className="h-full">
      <SideNavItem 
        selected={selected === 'profile'} 
        icon={<UserRoundSearch className='pb-1 w-16 h-16' />} 
        label="Player Info" onClick={() => onPanelChange('profile')}  
      />
      <SideNavItem 
        selected={selected === 'discoveries'} 
        icon={<SearchAlert className='pb-1 w-16 h-16' />} 
        label="Discoveries" onClick={() => onPanelChange('discoveries')} 
      />
      <SideNavItem 
        selected={selected === 'run_history'} 
        icon={<History className='pb-1 w-16 h-16' />} 
        label="Run History" 
        onClick={() => onPanelChange('run_history')} 
      />
      <SideNavItem 
        selected={selected === 'map'} 
        icon={<Map className='pb-1 w-16 h-16' />} 
        label="Map Navigator" 
        onClick={() => onPanelChange('map')} 
      />
      <SideNavItem 
        selected={selected === 'graph'} 
        icon={<Waypoints className='pb-1 w-16 h-16' />} 
        label="Synergy Graph" 
        onClick={() => onPanelChange('graph')} 
      />
    </div>
  )
}

export default SideNav;
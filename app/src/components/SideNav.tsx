import { Map, UserRoundSearch, Waypoints } from "lucide-react";
import SideNavItem from "./SideNavItem";
import { PanelType } from "@/types/general";

type SideNavProps = {
  selected: PanelType;
  onPanelChange: (panel: PanelType) => void;
}

function SideNav({ selected, onPanelChange }: SideNavProps) {


  return (
    <div className="h-full">
      <SideNavItem selected={selected === 'profile'} icon={<UserRoundSearch className='pb-1 w-16 h-16' />} label="Player Info" onClick={() => onPanelChange('profile')}  />
      <SideNavItem selected={selected === 'map'} icon={<Map className='pb-1 w-16 h-16' />} label="Map Navigator" onClick={() => onPanelChange('map')} />
      <SideNavItem selected={selected === 'graph'} icon={<Waypoints className='pb-1 w-16 h-16' />} label="Synergy Graph" onClick={() => onPanelChange('graph')} />

    </div>
  )
}

export default SideNav;
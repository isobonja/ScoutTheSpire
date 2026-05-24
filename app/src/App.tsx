import { useEffect, useState } from 'react'
import TopBar from './components/TopBar'
import SideNav from './components/SideNav'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ProfileSaveData } from '../shared/types/profileData'
import { PanelType } from './types/general'
import PlayerInfoPanel from './panels/PlayerInfoPanel'
//import SpireCodexChangelog from './components/SpireCodexChangelog'

function App() {
  const DATA_REFRESH_INTERVAL = 30000; // ms
  const [profileData, setProfileData] = useState<ProfileSaveData | null>(null);
  const [selectedPanel, setSelectedPanel] = useState<PanelType>('profile')

  async function refreshProfileData() {
    console.log('Refreshing profile data');
    const data = await window.api.readProfileSave();
    console.log('Profile data:', data);
    setProfileData(data);
  }

  useEffect(() => {
    refreshProfileData();

    const interval = setInterval(() => {
      console.log(profileData);
      refreshProfileData();
    }, DATA_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [])

  return (
    <div className='h-screen flex flex-col'>
      <TopBar />
      {/* Put Changelog in designated area later */}
      {/*<SpireCodexChangelog className='max-h-80 max-w-64 overflow-y-scroll' />*/}
      <ResizablePanelGroup orientation='horizontal' className='flex-1 flex min-h-0 w-full'>
        <ResizablePanel className='' defaultSize={'10%'} minSize={'128px'} maxSize={'20%'}>
          <SideNav selected={selectedPanel} onPanelChange={setSelectedPanel} />
        </ResizablePanel>
        <ResizableHandle withHandle className=''/>
        <ResizablePanel className=''>
          {/*<ContentPanel selectedPanel={selectedPanel} />*/}
          <div className='flex-1 p-4 pt-0 pe-0 dark:bg-slate-900 h-full'>
            <PlayerInfoPanel active={selectedPanel == 'profile'} profileData={profileData} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default App

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { capitalize } from "@/utils/general";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Payment } from "electron/utility";
import { CharacterWLData } from "shared/types/profileData";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { Button } from "./ui/button";
import { ArrowUpDown } from "lucide-react";



function EnemyEncounterInfoBox() {

  const TABS = ["Encounters", "Enemies"]


  /*
    Enemies tab will include a table with rows containing 
    enemy icon, name, act(s), times encountered, total times killed, 
    total times died to.

    Clicking on a row will show per-character stats on the right of the 
    table for large window sizes. 

    For smaller window sizes, the table will act as an accordian, 
    where clicking on a row will expand a section below the row 
    with the per-character stats.

    -----

    The data table columns will be Name, Act(s), Times Encountered, 
      Times Killed, Times Died To.

    The icon will be created from enemy images retrieved from Spire-Codex. 
    Act info is located in the /api/enemies endpoint.
    Times Encountered, Killed, and Died To can be calculated from the 
    fight_stats array in the profile data.

    Each data object for the table will look like this:
    {
      id: string
      name: string
      type: "Normal" | "Elite" | "Boss"
      icon: string (url)
      acts: number[]
      timesEncountered: number
      timesKilled: number
      timesDiedTo: number
      fightStats: {
        character: string
        losses: number
        wins: number
      }[]
    }


  */


  /* The following is temporary just for testing purposes:
  */
 type Enemy = {
    id: string
    name: string
    type: "Normal" | "Elite" | "Boss"
    icon: null // temp null
    // So the /api/monsters endpoint does not include act info. It includes 
    // encounter info, so I will need to look at the encounter data from 
    // /api/encounters to get the acts in which each enemy is encountered. 
    acts: number[]
    totalTimesEncountered: number
    totalTimesKilled: number
    totalTimesDiedTo: number
    fightStats: CharacterWLData[]
  }
  
  const enemies: Enemy[] = [
    {
      id: "test1",
      name: "Test Enemy 1",
      type: "Normal",
      icon: null,
      acts: [1, 2],
      totalTimesEncountered: 5,
      totalTimesKilled: 3,
      totalTimesDiedTo: 2,
      fightStats: [
        {
          character: "CHARACTER.IRONCLAD",
          losses: 1,
          wins: 2
        }
      ]
    },
    {
      id: "489e1d42",
      name: "Test Enemy 2",
      type: "Elite",
      icon: null,
      acts: [2, 3],
      totalTimesEncountered: 4,
      totalTimesKilled: 2,
      totalTimesDiedTo: 2,
      fightStats: [
        {
          character: "CHARACTER.IRONCLAD",
          losses: 2,
          wins: 1
        },
        {
          character: "CHARACTER.SILENT",
          losses: 0,
          wins: 1
        }
      ]
    }
  ]

  const columns: ColumnDef<Enemy>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "acts",
      header: "Act(s)",
      cell: ({ row }) => row.original.acts.join(", ")
    },
    {
      accessorKey: "totalTimesEncountered",
      header: "Times Encountered"
    },
    {
      accessorKey: "totalTimesKilled",
      header: "Times Killed"
    },
    { 
      accessorKey: "totalTimesDiedTo",
      header: "Times Died To"
    }
  ]


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

      <TabsContent 
        key="Encounters" 
        value="Encounters" 
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
        <h1 className='text-4xl ms-4 mt-2 text-orange-300 font-extrabold font-heading tracking-wide'>{capitalize(TABS[0])}</h1>
      </TabsContent>

      <TabsContent 
        key="Enemies" 
        value="Enemies" 
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
        <h1 className='text-4xl ms-4 mt-2 text-orange-300 font-extrabold font-heading tracking-wide'>{capitalize(TABS[1])}</h1>
        <DataTable columns={columns} data={enemies} />
      </TabsContent>

      
    </Tabs>
  )
}

export default EnemyEncounterInfoBox;
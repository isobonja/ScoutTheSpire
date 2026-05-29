import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { capitalize, extractNameFromSTSID } from "@/utils/general";
import type { EnemyProfileStats } from "shared/types/profileData";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { Button } from "./ui/button";
import { ArrowUpDown } from "lucide-react";
import type { EnemiesData, EnemyTableRowData } from "shared/types/enemies";
import { useState, useEffect, useMemo } from "react";
import { ACT_MAPPINGS } from "@/constants/acts";
import { ENEMY_ACT_EXCEPTIONS, ENEMY_ID_MAPPINGS } from "@/constants/enemies";
import CharacterWLStatsCard from "./CharacterWLStatsCard";
import { CHARACTER_COLORS, CHARACTER_ICONS } from "@/constants/characters";

type EnemyEncounterInfoBoxProps = {
  enemiesStats: EnemyProfileStats[] | null;
  //encounterData: EncounterData[] | null;
}

function EnemyEncounterInfoBox({ enemiesStats }: EnemyEncounterInfoBoxProps) {

  const TABS = ["Encounters", "Enemies"]

  const [enemiesData, setEnemiesData] = useState<EnemiesData[] | null>(null);
  //const [encounterData, setEncounterData] = useState<EncounterData[] | null>(null);

  const [selectedEnemyId, setSelectedEnemyId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const enemies = await window.api.fetchEnemyData();
        setEnemiesData(enemies);
      } catch (error) {
        console.error("Error fetching enemy data:", error);
      }
      /*try {
        const [enemies, encounters] = await Promise.all([
          window.api.fetchEnemyData(),
          window.api.fetchEncounterData()
        ]);
        setEnemiesData(enemies);
        //setEncounterData(encounters);
      } catch (error) {
        console.error("Error fetching data:", error);
      }*/
    }

    fetchData();
  }, [])

  const enemyTableRows = useMemo(() => {
    if (!enemiesData) return [];

    //console.log("Exceptions:" + Object.keys(ENEMY_ACT_EXCEPTIONS).join(", "))

    //console.log("enemiesData:" + JSON.stringify(enemiesData));

    return enemiesData.map((enemy) => {
      const acts = new Set<number>();

      if (Object.keys(ENEMY_ACT_EXCEPTIONS).includes(enemy.id)) {
        console.log(`Enemy ${enemy.id} is an exception, adding acts ${ENEMY_ACT_EXCEPTIONS[enemy.id].join(", ")}`);
        ENEMY_ACT_EXCEPTIONS[enemy.id].forEach((actNum) => acts.add(actNum));
      } else {
        enemy.encounters?.forEach((encounter) => {
          const actNum = ACT_MAPPINGS[encounter.act];
          if (actNum) {
            acts.add(actNum);
          }
        });
      }
      
      

      const enemyStats = enemiesStats?.find((es) =>(
        es.enemy_id.split(".")[1] === enemy.id || 
        ENEMY_ID_MAPPINGS[es.enemy_id] === enemy.id
      ));

      const totalTimesEncountered = enemyStats?.fight_stats.reduce(
        (sum, cs) => sum + cs.wins + cs.losses, 0
      ) ?? null;

      const totalTimesKilled = enemyStats?.fight_stats.reduce(
        (sum, cs) => sum + cs.wins, 0
      ) ?? null;

      const totalTimesDiedTo = enemyStats?.fight_stats.reduce(
        (sum, cs) => sum + cs.losses, 0
      ) ?? null;

      //console.log("Fight stats for enemy " + enemy.name + ": " + JSON.stringify(enemyStats?.fight_stats));

      return {
        id: enemy.id,
        name: enemy.name,
        type: enemy.type,
        icon: null, // temp null, will replace with actual image url later
        acts: Array.from(acts).sort((a, b) => a - b),
        totalTimesEncountered,
        totalTimesKilled,
        totalTimesDiedTo,
        fightStats: [...(enemyStats?.fight_stats ?? [])]
      };
    })
  }, [enemiesStats, enemiesData])
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
 /*type Enemy = {
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
  ]*/

  const handleEnemyRowClick = (rowId: number) => {
    console.log("Clicked enemy with row id:", rowId);
    if (selectedEnemyId === enemyTableRows[rowId]?.id) {
      setSelectedEnemyId(null); // Deselect if the same row is clicked again
    } else {
      setSelectedEnemyId(enemyTableRows[rowId]?.id || null);
    }
  }

  const columns: ColumnDef<EnemyTableRowData>[] = [
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
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Act(s)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="ps-6">
          {row.original.acts.join(", ")}
        </div>
      ),
    },
    {
      accessorKey: "totalTimesEncountered",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Times Encountered
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ getValue }) => (
        <div className="ps-6">
          {getValue<number>()}
        </div>
      ),
    },
    {
      accessorKey: "totalTimesKilled",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Times Killed
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ getValue }) => (
        <div className="ps-6">
          {getValue<number>()}
        </div>
      ),
    },
    { 
      accessorKey: "totalTimesDiedTo",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Times Died To
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ getValue }) => (
        <div className="ps-6">
          {getValue<number>()}
        </div>
      ),
    }
  ]


  return (
    <Tabs defaultValue={TABS[0]} className="w-full h-150 pb-2 mb-2">
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
        <div className="flex gap-2">
          <DataTable columns={columns} data={enemyTableRows} handleRowClick={handleEnemyRowClick} />
          <div className="p-4 border border-slate-600 rounded-md mb-4 w-full">
            {selectedEnemyId ? (
              <div>
                <h2 className="text-2xl font-bold mb-4 w-full text-center">{enemyTableRows.find((e) => e.id === selectedEnemyId)?.name} Character Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  {enemyTableRows
                    .find((e) => e.id === selectedEnemyId)
                    ?.fightStats
                    .slice()
                    .sort((a, b) => {
                      const order = Object.keys(CHARACTER_COLORS);

                      return (
                        order.indexOf(a.character) -
                        order.indexOf(b.character)
                      );
                    })
                    .map((fs) => (
                      <CharacterWLStatsCard 
                        key={fs.character} 
                        title={extractNameFromSTSID(fs.character)} 
                        image={CHARACTER_ICONS[fs.character]}
                        wins={fs.wins}
                        losses={fs.losses}
                        bg={CHARACTER_COLORS[fs.character].dark.bg} 
                      />
                    ))
                  }
                </div>
              </div>
            ) : (
              <div className="h-full w-full text-center text-slate-400">Click on an enemy to see character stats</div>
            )}
          </div>
        </div>
        
      </TabsContent>

      
    </Tabs>
  )
}

export default EnemyEncounterInfoBox;
import { CHARACTER_RESTS } from "@/constants/characters";
import { CharacterID, CharacterName } from "@/types/general";
import { capitalize } from "@/utils/general";
import { CharacterStats } from "shared/types/profileData";


type CharacterInfoBoxProps = {
  character: {
    id: CharacterID;
    name: CharacterName;
  };
  info: CharacterStats | undefined;
};

function CharacterInfoBox({ character, info }: CharacterInfoBoxProps) {

  
  return (
    <div className='space-y-2 p-2'>
      <div className='flex flex-col gap-2 items-center rounded-lg bg-slate-950 p-2 relative h-80 w-72'>
        <h1 className='text-4xl text-orange-300 font-extrabold font-heading'>{capitalize(character.name)}</h1>
        <img src={CHARACTER_RESTS[character.id]} alt={character.name} className="max-w-64 max-h-64" />
        {character.id == "CHARACTER.NECROBINDER" && (
          <img src={CHARACTER_RESTS["CHARACTER.OSTY"]} alt="Osty" className="absolute left-2 bottom-0 max-w-32" />
        )}
      </div>
      <p className='font-mono'>Wins: {info?.total_wins}</p>
      <p className='font-mono'>Losses: {info?.total_losses}</p>
    </div>
  )
}

export default CharacterInfoBox;


type ToggleableTagProps = {
  tag: string;
  selected: boolean;
  onToggle: (tag: string) => void;
}

function ToggleableTag({ tag, selected = false, onToggle }: ToggleableTagProps) {


  {/* Maybe switch this to use shadcn/ui Toggle component*/}
  return (
    <div 
      onClick={() => onToggle(tag)} 
      className={`
        text-white 
        cursor-pointer
        text-center 
        rounded-md 
        py-1 
        select-none 
        ${selected 
          ? 'bg-fuchsia-800 hover:bg-fuchsia-700 border-fuchsia-400 ring-1 ring-white/80' 
          : 'bg-slate-700 hover:bg-slate-600'
        }
      `}
    >
      <span className="">{tag}</span>
    </div>
  )
}

export default ToggleableTag;
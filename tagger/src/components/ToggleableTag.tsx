

type ToggleableTagProps = {
  tag: string;
  onToggle: (tag: string) => void;
}

function ToggleableTag({ tag, onToggle }: ToggleableTagProps) {

  return (
    <div onClick={() => onToggle(tag)} className="text-white cursor-pointer">
      <span className="text-white">{tag}</span>
    </div>
  )
}

export default ToggleableTag;
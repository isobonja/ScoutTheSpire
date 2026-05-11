type SideNavItemProps = {
  selected: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

function SideNavItem({ selected, icon, label, onClick }: SideNavItemProps) {


  return (
    <div 
      className={`
        h-32 
        w-full 
        flex 
        flex-col 
        items-center 
        justify-center 
        border 
        ${selected 
          ? 'border-orange-500 bg-orange-950 hover:bg-orange-900' 
          : 'border-gray-300 bg-gray-950 hover:bg-gray-900'
        }
        select-none 
        cursor-pointer
        
      `}
      onClick={onClick}
    >
      {icon}
      <h1 className="text-sm font-extrabold">{label}</h1>
    </div>
  )
}

export default SideNavItem;
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SelectedTags, CategoryData } from "../../shared/types";
import ToggleableTag from "./ToggleableTag";
import { Separator } from "@/components/ui/separator";
import { capitalize } from "@/util/utils";

type TagColumnProps = {
  category: string;
  categoryData: CategoryData;
  selectedTags: SelectedTags;
  onSelectTag: (category: string, tag: string) => void;
}

function TagColumn({ category, categoryData, selectedTags, onSelectTag }: TagColumnProps) {

  {/* NEED TO ENFORCE REQUIRED */}

  const handleToggleTag = (tag: string) => {
    onSelectTag(category, tag);
  }

  return (
    <Card 
      className="
        w-64 
        min-w-64
        h-full 
        min-h-0 
        bg-transparent
        border-r border-t
        rounded-sm
        text-muted
      "
    >
      <CardHeader className=''>
        <CardTitle className='text-white font-bold text-lg text-center'>{capitalize(category)}</CardTitle>
        {/*<CardDescription className=''></CardDescription>*/}
      </CardHeader>
      <div className='w-full flex items-center justify-center'>
        <Separator className='bg-slate-600 data-horizontal:w-[90%]' />
      </div>
      
      <CardContent>
        {/* map through tags in category and display as checkboxes or toggles */}
        <div className="flex flex-col gap-2">
          {categoryData.tags.map((tag) => (
            <ToggleableTag key={tag} tag={tag} selected={selectedTags?.[category]?.includes(tag)} onToggle={handleToggleTag} />
          ))}

        </div>
      </CardContent>
    </Card>
  )
}

export default TagColumn;
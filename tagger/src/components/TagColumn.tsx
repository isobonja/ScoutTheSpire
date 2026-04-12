import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TagCategory } from "../../shared/types";
import ToggleableTag from "./ToggleableTag";

type TagColumnProps = {
  category: string;
  categoryData: TagCategory;
}

function TagColumn({ category, categoryData }: TagColumnProps) {


  return (
    <Card 
      className="
        w-72 
        min-w-72 
        h-full 
        min-h-0 
        bg-transparent
        border-r border-t
        rounded-sm
        text-muted
      "
    >
      <CardHeader>
        <CardTitle className='text-white font-bold text-lg text-center'>{category}</CardTitle>
        {/*<CardDescription className=''></CardDescription>*/}
      </CardHeader>
      <CardContent>
        {/* map through tags in category and display as checkboxes or toggles */}
        <div className="flex flex-col gap-2">
          {categoryData.tags.map((tag) => (
            <ToggleableTag key={tag} tag={tag} onToggle={() => console.log(tag)}/>
          ))}

        </div>
      </CardContent>
    </Card>
  )
}

export default TagColumn;
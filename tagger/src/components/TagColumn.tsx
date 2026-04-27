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
import { useEffect, useMemo, useRef, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type TagColumnProps = {
  category: string;
  categoryData: CategoryData;
  selectedTags: SelectedTags;
  onSelectTag: (category: string, tag: string) => void;
}

function TagColumn({ category, categoryData, selectedTags, onSelectTag }: TagColumnProps) {
  const tags = useMemo(() => {
    const initialTags = categoryData.tags || [];
    const temporarySelectedTags = selectedTags?.[category]?.filter(t => t.isTemporary).map(t => t.value) || [];
    const allTags = Array.from(new Set([...initialTags, ...temporarySelectedTags]));
    //console.log('Updating tags for category', category, 'with allTags', allTags);
    return allTags;
  }, [categoryData.tags, selectedTags, category]);

  const ITEM_HEIGHT = 28 + 8; // Height of ToggleableTag + bottom margin in px

  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const compute = () => {
      const containerHeight = el.clientHeight;

      // how many items fit in ONE column
      const itemsPerColumn = Math.floor(containerHeight / ITEM_HEIGHT);

      // if we exceed that → need 2 columns
      setIsExpanded(tags.length > itemsPerColumn);
    };

    compute();

    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [tags]);

  const handleToggleTag = (tag: string) => {
    onSelectTag(category, tag);
  }

  return (
    <Card 
      className={`
        ${isExpanded ? "w-96 min-w-96" : "w-48 min-w-48"}
        h-full min-h-0 bg-transparent border-r border-t rounded-sm text-muted relative overflow-clip
      `}
    >
      <div
        className={`
          absolute inset-0 pointer-events-none
          transition-opacity duration-300
          ${categoryData.required && selectedTags[category]?.length === 0 ? "opacity-100" : "opacity-0"}
        `}
      >
        <div className="w-full h-full border-6 border-green-700/50 rounded-sm animate-pulse" />
      </div>
      <CardHeader className=''>
        <CardTitle className='text-white font-bold text-lg text-center'>{capitalize(category)}</CardTitle>
        {/*<CardDescription className=''></CardDescription>*/}
      </CardHeader>
      <div className='w-full flex items-center justify-center'>
        <Separator className='bg-slate-600 data-horizontal:w-[90%]' />
      </div>
      
      <CardContent className='h-full min-h-0 pt-1'>
        {/* map through tags in category and display as checkboxes or toggles */}
        <div
          ref={containerRef}
          className="h-full"
        >
          <div className={`${isExpanded ? "columns-2" : "columns-1"} gap-2`}>
            {tags.map((tag) => (
              <div key={tag} className="break-inside-avoid mb-2">
                <ToggleableTag
                  tag={tag}
                  selected={selectedTags?.[category]?.some(t => t.value === tag)}
                  temporary={selectedTags?.[category]?.some(t => t.value === tag && t.isTemporary)}
                  onToggle={handleToggleTag}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TagColumn;
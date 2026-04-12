import { useEffect, useRef } from "react";
import TagColumn from "./TagColumn";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { TagsData } from "../../shared/types";

type TagColumnContainerProps = {
  tagData: TagsData;
}

function TagColumnContainer({ tagData }: TagColumnContainerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const viewport = containerRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLDivElement | null;

    if (!viewport) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;

      e.preventDefault();
      viewport.scrollLeft += e.deltaY;
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      viewport.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div ref={containerRef} className="h-full min-h-0">
      <ScrollArea
        type="hover"
        className="h-full min-h-0 p-2 border border-slate-400 rounded-xl"
      >
        <div className="flex flex-row gap-2 items-stretch min-h-full w-max">
          {tagData && Object.entries(tagData).map(([category, categoryData]) => (
            <TagColumn key={category} category={category} categoryData={categoryData} />
          ))}
        </div>

        <ScrollBar orientation="horizontal" className="bg-black w-full" />
      </ScrollArea>
    </div>
  );
}

export default TagColumnContainer;
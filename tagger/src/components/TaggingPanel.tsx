import { Separator } from "@/components/ui/separator";
import NewTagCategoryForm from "./NewTagCategoryForm";
import TagColumnContainer from "./TagColumnContainer";
import { SelectedTags, TagsData } from "../../shared/types";


type TaggingPanelProps = {
  tagData: TagsData;
  addTag?: (category: string, tag: string) => void;
  addCategory?: (category: string) => void;
  selectedTags: SelectedTags;
  onSelectTag: (category: string, tag: string) => void;
  className?: string;
}

function TaggingPanel({ 
  tagData, 
  addTag, 
  addCategory,
  selectedTags,
  onSelectTag,
  className, 
  ...props 
}: TaggingPanelProps & React.HTMLAttributes<HTMLDivElement>) {


  return (
    <div className={`bg-panel-background text-white border border-panel-border rounded-lg p-4 h-full min-h-0 ${className}`} {...props}>
      <div className='h-full w-full min-h-0 border-gray-300 items-center flex flex-col'>
        <h1 className='text-5xl w-full text-center font-bold mb-4'>Tagging Panel</h1>
        <Separator className='' />

        {/* Actual tagging UI 
        
        
          shadcn/ui components to use:
          - Input
          - Field (for new tag/category layout)
          - Label (FieldLabel)
          - Card
          - ScrollArea (for scrollable tag/category list and horizontal scrolling of category columns)
          - Toggle/ToggleGroup for tag selection (alternative is Checkbox)
        */}
        <div className='w-full h-full min-h-0 border-green-300 p-4 flex flex-col'>
          {/* New tag/category form */}
          <div className='w-full bg-form-background p-4 rounded-lg border border-form-border'>
            <NewTagCategoryForm 
              categories={tagData ? Object.keys(tagData) : []} // Extract categories for passing to form
              addCategory={addCategory}
              addTag={addTag}
            />
          </div>
          <Separator className='my-4' />
          {/* Existing tags/categories */}
          <div className='w-full flex-1 min-h-0'>
            {/* 
              CURRENT IDEA: Scrollable row of columns, each column is a category.
              Tags are displayed within respective category column as checkboxes (or equivalent selectable element).
              If a category is added, new column is created and JSON with all category-to-tag-list data is updated.

              Maybe use shad/cn Card for columns?
            
            */}
            <TagColumnContainer 
              tagData={tagData}
              selectedTags={selectedTags}
              onSelectTag={onSelectTag}
            />

          </div>

          {/* button to assign tags to card */}
        </div>
      </div>
    </div>
  )
}

export default TaggingPanel;
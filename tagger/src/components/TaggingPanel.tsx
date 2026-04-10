import { Separator } from "@/components/ui/separator";
import NewTagCategoryForm from "./NewTagCategoryForm";


type TaggingPanelProps = {
  categories: string[];
  addTag?: (category: string, tag: string) => void;
  addCategory?: (category: string) => void;
  className?: string;
}

function TaggingPanel({ 
  categories, 
  addTag, 
  addCategory,
  className, 
  ...props 
}: TaggingPanelProps & React.HTMLAttributes<HTMLDivElement>) {


  return (
    <div className={`text-white border border-pink-500 rounded-lg p-4 h-full min-h-0 ${className}`} {...props}>
      <div className='h-full w-full min-h-0 border border-gray-300 items-center flex flex-col'>
        <h1 className='text-5xl w-full text-center font-bold mt-4 mb-2'>Tagging Panel</h1>
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
        <div className='w-full h-full border border-green-300 p-4'>
          {/* New tag/category form */}
          <div className='w-full bg-indigo-950 p-4 rounded-lg border border-slate-700'>
            <NewTagCategoryForm 
              categories={categories}
              addCategory={addCategory}
              addTag={addTag}
            />
            {/* New tag field: will require state */}

            {/* Category select: will have custom dropdown with existing categories + "Create new" option */}

            {/* Add button; also set up Enter key functionality */}
          </div>
          <Separator className='my-4' />
          {/* Existing tags/categories */}
          <div>
            <p>test</p>
            {/* 
              CURRENT IDEA: Scrollable row of columns, each column is a category.
              Tags are displayed within respective category column as checkboxes (or equivalent selectable element).
              If a category is added, new column is created and JSON with all category-to-tag-list data is updated.

              Maybe use shad/cn Card for columns?
            
            */}

          </div>

          {/* button to assign tags to card */}
        </div>
      </div>
    </div>
  )
}

export default TaggingPanel;
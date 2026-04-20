import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { CheckCircle, Plus } from "lucide-react";
import { useState } from "react";
import { CategoryInfo } from "../../shared/types";

/* NEED TO CHANGE categories TO INCLUDE THEIR RESPECTIVE required AND limit VALUES */

type CategorySelectProps = {
  categories: CategoryInfo[];
  value?: string;
  onChange?: (value: string) => void;
  addCategory: (category: string, required: boolean, limit: number) => void;
}

function CategorySelect({ categories, value, onChange, addCategory }: CategorySelectProps) {
  const [newCategoryName, setNewCategoryName] = useState('');

  const [isRequired, setIsRequired] = useState(false);
  const [hasLimit, setHasLimit] = useState(false);
  const [limit, setLimit] = useState(0);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-45 bg-field-background text-white border border-field-border">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent 
        position='popper' 
        className='
          text-white 
          p-1 
          border 
          border-slate-500
          bg-linear-to-b
          from-slate-800
          to-slate-900
        '
      >
        <SelectGroup>
          <SelectLabel className='font-bold font-mono'>New Category</SelectLabel>
          <div className='flex flex-col gap-1 items-center'>
            
            <Input 
              placeholder="Enter category name" 
              value={newCategoryName} 
              onChange={(e) => setNewCategoryName(e.target.value)} 
              className='mb-1 flex-1 bg-field-background border border-field-border focus-visible:border-field-border-focus focus-visible:ring-field-border-focus-ring/20'
            />
            <div className='mb-1 flex flex-row gap-1'>
              {/*
                Figure out how to make it more clear when 
                the toggles are on or off, maybe with an icon 
                or checkmark/X

                Figure out how to use the state of Toggle to 
                change what is displayed.
              
              */}
              <Toggle 
                size='sm'
                variant='outline' 
                pressed={isRequired}
                onPressedChange={setIsRequired}
                className={`
                  flex-5 
                  relative 
                  bg-field-background 
                  border-field-border
                  hover:bg-field-background-hover
                  hover:text-white
                  data-[state=on]:bg-slate-100
                  data-[state=on]:text-black
                `}
                
              >
                {isRequired && <CheckCircle className='absolute left-2'/>}
                Mark as Required
              </Toggle>
              <Toggle 
                size='sm'
                variant='outline' 
                pressed={hasLimit}
                onPressedChange={setHasLimit}
                className={`
                  flex-5 
                  relative
                  bg-field-background 
                  border-field-border
                  hover:bg-field-background-hover
                  hover:text-white
                  data-[state=on]:bg-slate-100
                  data-[state=on]:text-black
                `}
              >
                {}
                {/* Find a better icon */}
                {hasLimit && <CheckCircle className='absolute left-2'/>}
                Limit Max Number of Tags
              </Toggle>
              <Input 
                type='number' 
                disabled={!hasLimit} 
                className='
                  h-7 
                  flex-2 
                  bg-field-background 
                  border-field-border 
                  ring-2 
                  ring-sky-200/80 
                  disabled:bg-black 
                  disabled:text-slate-900 
                  disabled:ring-0 
                ' 
                placeholder="0"
                value={limit} 
                onChange={(e) => setLimit(parseInt(e.target.value))}
              />
            </div>
            <Button size='sm' className='text-white mb-1 w-full bg-green-800 border border-field-border hover:border-2 hover:bg-green-700' onClick={() => {
              if (newCategoryName.trim()) {
                addCategory(
                  newCategoryName.trim(),
                  isRequired,
                  hasLimit ? limit : 0
                );
                setNewCategoryName('');
                setIsRequired(false);
                setHasLimit(false);
                setLimit(0);
              }
            }}>
              <Plus />
              Add Category
            </Button>
          </div>
        </SelectGroup>
        <SelectSeparator className='bg-field-border'/>
        <SelectGroup>
          <SelectLabel className='font-bold text-lg font-mono'>Existing Categories</SelectLabel>
          {categories.map((category) => (
            <SelectItem key={category.name} value={category.name} label={category.name} className='hover:bg-slate-700 font-mono w-full' hideIndicator>
              <div className='w-full text-end'>
            
                <span className='text-xs text-slate-500'>{
                  (category.required ? "Required" : '') +
                  ((category.required && category.limit > 0) ? ', ' : '') +
                  (category.limit > 0 ? ('Limit: ' + category.limit.toString()) : '')
                  }
                </span>
              </div>
              
                
              
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default CategorySelect
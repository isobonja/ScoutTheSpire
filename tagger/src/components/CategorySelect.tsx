import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react";

type CategorySelectProps = {
  categories: string[];
  value?: string;
  onChange?: (value: string) => void;
  addCategory?: (category: string) => void;
}

function CategorySelect({ categories, value, onChange, addCategory }: CategorySelectProps) {
  const [newCategoryName, setNewCategoryName] = useState('');

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
          
          <div className='flex flex-row gap-1 items-center'>
            <SelectLabel className='font-bold font-mono'>New Category</SelectLabel>
            <Input 
              placeholder="Enter category name" 
              value={newCategoryName} 
              onChange={(e) => setNewCategoryName(e.target.value)} 
              className='flex-1 bg-field-background border border-field-border focus-visible:border-field-border-focus focus-visible:ring-field-border-focus-ring/20'
            />
            <Button size='icon' className='border border-field-border hover:border-2 hover:text-xl' onClick={() => {
              if (newCategoryName.trim()) {
                addCategory?.(newCategoryName.trim());
                setNewCategoryName('');
              }
            }}>
              +
            </Button>
          </div>
        </SelectGroup>
        <SelectSeparator className='bg-field-border'/>
        <SelectGroup>
          <SelectLabel className='font-bold text-lg font-mono'>Existing Categories</SelectLabel>
          {categories.map((category) => (
            <SelectItem key={category} value={category} className='hover:bg-slate-700 font-mono'>
              {category}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default CategorySelect
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
      <SelectTrigger className="w-[180px] bg-slate-900 text-white">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent position='popper' className='bg-slate-900 text-white p-1 border border-slate-700'>
        <SelectGroup>
          <SelectLabel>New Category</SelectLabel>
          <div className='flex flex-row gap-1'>
            <Input placeholder="Enter category name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
            <Button size='icon' className='border border-white' onClick={() => {
              if (newCategoryName.trim()) {
                addCategory?.(newCategoryName.trim());
                setNewCategoryName('');
              }
            }}>
              +
            </Button>
          </div>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Existing Categories</SelectLabel>
          {categories.map((category) => (
            <SelectItem key={category} value={category} className='hover:bg-slate-700'>
              {category}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default CategorySelect
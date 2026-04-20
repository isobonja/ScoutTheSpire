import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import CategorySelect from "./CategorySelect";
import { Button } from "./ui/button";
import { useState } from "react";
import { CategoryInfo } from "../../shared/types";

type NewTagCategoryFormProps = {
  categories: CategoryInfo[];
  addCategory: (category: string, required: boolean, limit: number) => void;
  addTag?: (category: string, tag: string) => void;
}

function NewTagCategoryForm({ categories, addCategory, addTag }: NewTagCategoryFormProps) {
  const [tagName, setTagName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  return (
    <div className='w-full min-w-100'>
      <FieldSet>
        <FieldLegend className='underline'>Add Tags or Categories</FieldLegend> {/* prob remove */}
        <FieldGroup>
          <div className='flex flex-row gap-2 pt-2'>
            <Field className='flex-5 bg-field-background'>
              {/*<FieldLabel htmlFor="tag-name">Tag Name</FieldLabel>*/}
              <Input
                id="tag-name" 
                placeholder="Enter tag name" 
                value={tagName} 
                onChange={(e) => setTagName(e.target.value)} 
                className='border border-field-border focus-visible:border-field-border-focus focus-visible:ring-field-border-focus-ring/20'
              />
            </Field>
            <Field className='flex-5'>
              {/*<FieldLabel htmlFor="category">Category</FieldLabel>*/}
              <CategorySelect 
                categories={categories} 
                value={selectedCategory} 
                onChange={(value) => setSelectedCategory(value)} 
                addCategory={addCategory}
              />
            </Field>
            <Field className='flex-2'>
              <Button 
                className='border border-gray-100 bg-blue-900 self-end text-white'
                onClick={() => {
                  addTag?.(selectedCategory, tagName);
                  setTagName('');
                  setSelectedCategory('');
                }}
              >
                Add Tag
              </Button>
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>
    </div>
  )
}

export default NewTagCategoryForm;
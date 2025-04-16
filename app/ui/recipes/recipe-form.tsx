'use client';

import Image from 'next/image';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { convertMinToHrMin } from '@/app/lib/utils';
import { useActionState, useState } from 'react';
import { RecipeState, updateRecipe } from '@/app/lib/actions';
import { Tag } from '@/app/lib/definitions';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export default function RecipeForm ({
  id, name, description, calories, cookTimeMin, recipeTags, allTags, ingredients, steps
}: {
  id: string, name: string, description: string, calories: number, cookTimeMin: number,
  recipeTags: Tag[], allTags: Tag[], ingredients: string[], steps: string[]
}) {
  let initialIngredients = ingredients;
  if (!ingredients) initialIngredients = [''];
  let initialSteps = steps;
  if (!steps) initialSteps = [''];
  let initialTags = recipeTags;
  if (!recipeTags) initialTags = [];
  const { cookTimeHr, leftoverCookTimeMin } = convertMinToHrMin(cookTimeMin);
  const [newIngredients, setNewIngredients] = useState(initialIngredients);
  const [newSteps, setNewSteps] = useState(initialSteps);
  const [tags, setTags] = useState<string[]>(initialTags.map((tag) => tag.tag_id));

  const initialState: RecipeState = { message: null, errors: {} };
  const updateRecipeWithId = updateRecipe.bind(null, id);
  const [state, formAction] = useActionState(updateRecipeWithId, initialState);

  function handleTagChange(tagIDs: string[]) {
    setTags(tagIDs);
  }

  return (
    <form id="recipe-form" action={formAction}>
      {/* Picture */}
      <div>
        <Image 
          src="/recipe-image.jpg"
          width={500}
          height={500}
          alt="Picture of the meal"
        />
      </div>
      {/* Name */}
      <div>
        <input
          className="peer block rounded-md w-9/12 py-[9px] pl-2 bg-zinc-800 text-sm outline-2 placeholder:text-gray-500"
          id="recipeName"
          type="text"
          name="recipeName"
          defaultValue={`${name}`}
          placeholder={`${name}`}
          required
        />
      </div>
      {/* Description */}
      <div>
        <input
          className="peer block rounded-md w-full py-[9px] pl-2 bg-zinc-800 text-sm outline-2 placeholder:text-gray-500"
          id="recipeDescription"
          type="text"
          name="recipeDescription"
          defaultValue={`${description == null ? "" : description}`}
          placeholder={`${description == null ? "Description" : description}`}
          // required
        />
      </div>
      {/* Calories */}
      <label
      >
        Calories
      </label>
      <div>
        <input
          className="peer block rounded-md w-16 py-[9px] pl-2 bg-zinc-800 text-sm outline-2 placeholder:text-gray-500"
          id="calories"
          type="number"
          name="calories"
          defaultValue={`${calories}`}
          placeholder={`${calories}`}
          required
        />
      </div>
      {/* Time */}
      <label
      >
        Time
      </label>
      <div className="flex justify-start">
        <input
          className="peer block rounded-md w-12 py-[9px] pl-2 bg-zinc-800 text-sm outline-2 placeholder:text-gray-500"
          id="cookTimeHr"
          type="number"
          name="cookTimeHr"
          min="0"
          defaultValue={`${cookTimeHr}`}
          placeholder={`${cookTimeHr}`}
          // required
        />
        <input
          className="peer block rounded-md w-12 py-[9px] pl-2 bg-zinc-800 text-sm outline-2 placeholder:text-gray-500"
          id="cookTimeMin"
          type="number"
          name="cookTimeMin"
          min="0"
          defaultValue={`${leftoverCookTimeMin}`}
          placeholder={`${leftoverCookTimeMin}`}
          // required
        />
      </div>
      {/* Tags */}
      <label>Choose tags</label>
      <ToggleGroup
        type='multiple'
        value={tags}
        onValueChange={handleTagChange}
      >
        {allTags.map((tag) => {
          return (
            <ToggleGroupItem
              key={tag.tag_id}
              value={tag.tag_id}
              aria-label={tag.tag_name}
            >
              {tag.tag_name}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
      {tags.map((tagId) => {
        return (
          <input
            key={tagId}
            type="hidden"
            name="tagIDs"
            value={tagId}
          />
        );
      })}
      {/* Ingredients */}
      <div className="pb-3">
        <label
        >
          Ingredients
        </label>
        <div id="ingredients" className="grid grid-cols-2">
          {newIngredients?.map((ingredient, index) => {
            return (
              <div 
                key={index}
                className="flex flex-cols-2 rounded-md pr-3"
              >
                <input
                  className="rounded-md py-2 pl-2 w-full bg-zinc-800"
                  name="ingredient"
                  type="text"
                  value={ingredient}
                  placeholder={ingredient}
                  onChange={(e) => {
                    setNewIngredients(newIngredients.toSpliced(index, 1, e.target.value));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setNewIngredients(newIngredients.filter((_ingredient, _index) =>
                      _index !== index));
                  }}
                >
                  <TrashIcon className="w-6" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-center">
        <button
          type="button"
          className="rounded-md p-2 hover:bg-gray-800"
          onClick={() => setNewIngredients([...newIngredients, ''])}
        >
          <PlusIcon className="w-6" />
        </button>
      </div>
      {/* Steps */}
      <label>Steps</label>
      <div>
        <div className="flex flex-col">
          {newSteps?.map((step, index) => {
            return (
              <div 
                key={index}
                className="flex pr-3"
              >
                <input
                  className="w-full rounded-md py-2 pl-2 bg-zinc-800"
                  name="step"
                  type="text"
                  value={step}
                  placeholder={step}
                  onChange={(e) => {
                    setNewSteps(newSteps.toSpliced(index, 1, e.target.value));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setNewSteps(newSteps.filter((_step, _index) =>
                      _index !== index));
                  }}
                >
                  <TrashIcon className="w-6" />
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex items-center">
          <button
            type="button"
            className="rounded-md p-2 hover:bg-gray-800"
            onClick={() => setNewSteps([...newSteps, ''])}
          >
            <PlusIcon className="w-6" />
          </button>
        </div>
      </div>
      {/* Submit button */}
      <div id="recipe-error" aria-live="polite" aria-atomic="true">
        {state?.errors?.name}
      </div>
      <button
        className="rounded-md p-2 hover:bg-gray-800"
        type="submit"
      >
        Save Changes to Recipe
      </button>
    </form>
  );
}
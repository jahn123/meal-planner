'use client';

import { createRecipe, RecipeState } from '@/app/lib/actions';
import { useActionState, useState } from 'react';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { NewTag, Tag } from '@/app/lib/definitions';

export default function CreateRecipeForm({ allTags }: { allTags: Tag[] }) {
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);
  const [tags, setTags] = useState<NewTag[]>([]);
  const defaultTagOption = '--Select a tag to add--';
  const tagOptions = [{ tag_name: defaultTagOption, tag_icon: ''}, ...allTags];
  console.log('tags: ', tags)

  const initialState: RecipeState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createRecipe, initialState);

  return (
    <form action={formAction}>
    {/* <form> */}
      <label>
        Enter the recipe name
      </label>
      <div>
        <input
          className="peer block rounded-md py-[9px] pl-10 bg-zinc-800 text-sm outline-2 placeholder:text-gray-500"
          id="recipeName"
          type="text"
          name="recipeName"
          placeholder="Name"
          // required
        />
      </div>
      {/* Description */}
      <label>
        Enter recipe description
      </label>
      <div>
        <input
          className="peer block rounded-md py-[9px] pl-10 bg-zinc-800 text-sm outline-2 placeholder:text-gray-500"
          id="recipeDescription"
          type="text"
          name="recipeDescription"
          placeholder="Description"
          // required
        />
      </div>
      {/* Calories */}
      <label
      >
        Enter the amount of calories per serving
      </label>
      <div>
        <input
          className="peer block rounded-md py-[9px] pl-10 bg-zinc-800 text-sm outline-2 placeholder:text-gray-500"
          id="calories"
          type="number"
          name="calories"
          placeholder="0"
          // required
        />
      </div>
      {/* Cook time */}
      <label
      >
        Enter cook time
      </label>
      <div className="flex justify-start">
        <input
          className="peer block rounded-md py-[9px] pl-10 bg-zinc-800 text-sm outline-2 placeholder:text-gray-500"
          id="cookTimeHr"
          type="number"
          name="cookTimeHr"
          min="0"
          placeholder="0"
          // required
        />
        <span>:</span>
        <input
          className="peer block rounded-md py-[9px] pl-10 bg-zinc-800 text-sm outline-2 placeholder:text-gray-500"
          id="cookTimeMin"
          type="number"
          name="cookTimeMin"
          min="0"
          placeholder="0"
          // required
        />
      </div>
      {/* Ingredients */}
      <div className="pb-3">
        <label
        >
          Enter ingredients
        </label>
        <div className="grid grid-cols-2">
          {ingredients?.map((ingredient, index) => {
            return (
              <div 
                key={index}
                className="flex flex-cols-2 rounded-md pr-3"
              >
                <input
                  id={ingredient}
                  name="ingredient"
                  className="rounded-md py-2 w-full bg-zinc-800"
                  type="text"
                  value={ingredient}
                  placeholder={ingredient}
                  onChange={(e) => {
                    setIngredients(ingredients.toSpliced(index, 1, e.target.value))
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setIngredients(ingredients?.filter((_ingredient, _index) =>
                      _index !== index
                    ));
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
          onClick={() => setIngredients([...ingredients, ''])}
        >
          <PlusIcon className="w-6" />
        </button>
      </div>
      {/* Steps */}
      <div className="pb-3">
        <label>Enter steps</label>
        <div>
          <div className="flex flex-col">
            {steps?.map((step, index) => {
              return (
                <div 
                  key={index}
                  className="flex pr-3"
                >
                  <input
                    className="w-full rounded-md py-2 bg-zinc-800"
                    name="step"
                    type="text"
                    value={step}
                    placeholder={step}
                    onChange={(e) => {
                      setSteps(steps.toSpliced(index, 1, e.target.value));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSteps(steps?.filter((_step, _index) =>
                        _index !== index
                      ));
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
              onClick={() => setSteps([...steps, ''])}
            >
              <PlusIcon className="w-6" />
            </button>
          </div>
        </div>
      </div>
      {/* Tags */}
      <label>Choose tags</label>
      <div className="flex">
        {tags?.map((tag, index) => {
          return (
            <div
              key={index}
              className="flex"
            >
              <select
                name="tag"
                className="w-48 rounded-md p-2 bg-zinc-800"
                value={tag.tag_name}
                onChange={(e) => {
                  setTags(tags.toSpliced(index, 1, { tag_name: e.target.value, tag_icon: '' }));
                }}
              >
                {tagOptions.map((tag, index) => {
                  let isDisabled = false;
                  if (tag.tag_name !== defaultTagOption) {
                    isDisabled = tags.find((_tag) => tag.tag_name == _tag.tag_name) ? true : false;
                  }

                  return (
                    <option
                      key={index}
                      value={tag.tag_name}
                      disabled={isDisabled}
                    >
                      {tag.tag_name}
                    </option>
                  );
                })}
              </select>
              <button
                type="button"
                onClick={() => setTags(tags.filter((_tag, _index) => _index !== index))}
              >
                <TrashIcon className="w-6" />
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex">
        <button
          type="button"
          onClick={(e) => {
            if (tags.length < allTags.length) {
              setTags([...tags, { tag_name: defaultTagOption, tag_icon: ''}]);
            }
          }}
        >
          <PlusIcon className="w-6" />
        </button>
      </div>
      {/* Submit button */}
      <div id="recipe-error" aria-live="polite" aria-atomic="true">
        {state?.errors?.name}
      </div>
      <button type="submit">Add New Recipe</button>
    </form>
  );
}
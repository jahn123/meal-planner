'use client';

import Image from 'next/image';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { convertHrToHrMin } from '@/app/lib/utils';
import { useActionState, useState } from 'react';
import { RecipeState, updateRecipe } from '@/app/lib/actions';

export default function RecipeForm ({
  id, name, description, calories, cookTimeMin, ingredients, steps
}: {
  id: string, name: string, description: string, calories: number, cookTimeMin: number, ingredients: string[], steps: string[]
}
) {
  let initialIngredients = ingredients;
  if (!ingredients) initialIngredients = [];
  let initialSteps = steps;
  if (!steps) initialSteps = [];
  const { cookTimeHr, leftoverCookTimeMin } = convertHrToHrMin(cookTimeMin);
  const [newIngredient, setNewIngredient] = useState("");
  const [newIngredients, setNewIngredients] = useState(initialIngredients);
  const [newStep, setNewStep] = useState("");
  const [newSteps, setNewSteps] = useState(initialSteps);

  const initialState: RecipeState = { message: null, errors: {} };
  const updateRecipeWithId = updateRecipe.bind(null, id)
  const [state, formAction] = useActionState(updateRecipeWithId, initialState);

  return (
    <form action={formAction}>
      {/* Meal picture */}
      <div>
        <Image 
          src="/recipe-image.jpg"
          width={500}
          height={500}
          alt="Picture of the meal"
        />
      </div>
      {/* Meal name */}
      <div>
        <input
          className="peer block rounded-md py-[9px] pl-10 bg-zinc-800 text-sm outline-2 placeholder:text-gray-500"
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
          className="peer block rounded-md py-[9px] pl-10 bg-zinc-800 text-sm outline-2 placeholder:text-gray-500"
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
          className="peer block rounded-md py-[9px] pl-10 bg-zinc-800 text-sm outline-2 placeholder:text-gray-500"
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
          className="peer block rounded-md py-[9px] bg-zinc-800 text-sm outline-2 placeholder:text-gray-500"
          id="cookTimeHr"
          type="number"
          name="cookTimeHr"
          min="0"
          defaultValue={`${cookTimeHr}`}
          placeholder={`${cookTimeHr}`}
          required
        />
        <span>:</span>
        <input
          className="peer block rounded-md py-[9px] bg-zinc-800 text-sm outline-2 placeholder:text-gray-500"
          id="cookTimeMin"
          type="number"
          name="cookTimeMin"
          min="0"
          defaultValue={`${leftoverCookTimeMin}`}
          placeholder={`${leftoverCookTimeMin}`}
          required
        />
      </div>
      {/* Ingredients */}
      <div className="pb-3">
        <label
        >
          Ingredients
        </label>
        <div className="grid grid-cols-2">
          {newIngredients?.map((ingredient, index = 0) => {
            return (
              <div 
                key={++index}
                className="flex flex-cols-2 rounded-md pr-3"
              >
                <input
                  id={ingredient}
                  name="ingredient"
                  className="rounded-md py-2 w-full bg-zinc-800"
                  type="text"
                  defaultValue={ingredient}
                  placeholder={ingredient}
                />
                <button
                  type="button"
                  onClick={() => {
                    setNewIngredients(newIngredients?.filter(ingred =>
                      ingred !== ingredient
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
        <textarea
          id="newIngredient"
          className="rounded-md py-2 bg-zinc-800"
          value={newIngredient}
          onChange={(e) => {
            setNewIngredient(e.target.value);
            console.log(newIngredient)
          }}
        />
        <button
          type="button"
          className="rounded-md p-2 hover:bg-gray-800"
          onClick={() => setNewIngredients([...newIngredients, newIngredient])}
        >
          <PlusIcon className="w-6" />
        </button>
      </div>
      {/* Steps */}
      <label>Steps</label>
      <div>
        <div className="flex flex-col">
          {newSteps?.map((step, index = 0) => {
            return (
              <div 
                key={++index}
                className="flex pr-3"
              >
                <input
                  className="w-full rounded-md py-2 bg-zinc-800"
                  name="step"
                  type="text"
                  defaultValue={step}
                  placeholder={step}
                />
                <button
                  type="button"
                  onClick={() => {
                    setNewSteps(newSteps?.filter(tempStep =>
                      tempStep !== step
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
          <textarea
            id="newStep"
            className="rounded-md py-2 bg-zinc-800"
            value={newStep}
            onChange={(e) => {
              setNewStep(e.target.value);
              console.log(newStep)
            }}
          />
          <button
            type="button"
            className="rounded-md p-2 hover:bg-gray-800"
            onClick={() => setNewSteps([...newSteps, newStep])}
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
'use client';

import { useState, useActionState } from 'react';
import { FullPlanInfo, RecipePreviewInfo } from '@/app/lib/definitions';
import RecipesTable from '../recipes/recipes-table';
import RecipeSearch from '../recipe-search';
import { PlanState, updatePlan } from '@/app/lib/actions';

export default function PlanForm({ plan, recipes }: { plan: FullPlanInfo, recipes: RecipePreviewInfo[] | [] }) {
  const [addedRecipes, setAddedRecipes] = useState<RecipePreviewInfo[]>(plan.recipes);

  const initialState: PlanState = { message: null, errors: {} };
  const updatePlanWithId = updatePlan.bind(null, plan.plan_id);
  const [state, formAction] = useActionState(updatePlanWithId, initialState);

  function handleAddClick(recipeId: string, recipeName: string, calories: number, cookTimeMin: number) {
    setAddedRecipes([...addedRecipes, { 
      recipe_id: recipeId,
      recipe_name: recipeName,
      calories: calories,
      cook_time_min: cookTimeMin
    }]);
  }

  function handleRemoveClick(recipeId: string, recipeName: string, removeIndex: number) {
    setAddedRecipes(addedRecipes.filter((recipe, index) => index !== removeIndex));
  }

  return (
    <>
      <form action={formAction}>
        <label>Plan name</label>
        <div className="flex justify-between">
          <input
            className="rounded-md p-2 bg-zinc-800 focus:outline-none focus:outline-slate-600 hover:bg-zinc-700"
            name="planName"
            type="text"
            placeholder={plan.plan_name}
            defaultValue={plan.plan_name}
          />
          <button
            type="submit"
          >
            Save changes
          </button>
        </div>
        <label>Plan description</label>
        <div>
          <input
            className="rounded-md p-2 bg-zinc-800 focus:outline-none focus:outline-slate-600 hover:bg-zinc-700"
            name="planDescription"
            type="text"
            placeholder={plan.plan_description}
            defaultValue={plan.plan_description}
          />
        </div>
        {addedRecipes.map((recipe, index) => {
            return (
              <input
                key={index}
                type="hidden"
                name="recipeIDs"
                value={recipe.recipe_id}
              />
            );
        })}
      </form>
      <span>Added recipes</span>
      {addedRecipes.length === 0 ? <div>Add some recipes to get started!</div> : <></>}
      <RecipesTable recipes={addedRecipes ? addedRecipes : []} handleButtonClick={handleRemoveClick} buttonAction='remove' />
      <RecipeSearch placeholder="Search Recipes..." />
      <RecipesTable recipes={recipes ? recipes : []} handleButtonClick={handleAddClick} buttonAction='add' />
    </>
  );
}
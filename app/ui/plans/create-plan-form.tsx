'use client';

import { useState } from 'react';
import { Recipe, RecipePreviewInfo } from '@/app/lib/definitions'
import RecipeSearch from '@/app/ui/recipe-search';
import RecipesTable from '@/app/ui/recipes/recipes-table';

export default function CreatePlanForm({ recipes }: { recipes: Recipe[] }) {
  const [addedRecipes, setAddedRecipes] = useState<RecipePreviewInfo[]>([]);

  function handleAddClick(recipeId: string, recipeName: string, calories: number, cookTimeMin: number) {
    setAddedRecipes([...addedRecipes, { 
      recipe_id: recipeId,
      recipe_name: recipeName,
      calories: calories,
      cook_time_min: cookTimeMin
    }]);
  }

  function handleRemoveClick(recipeId: string) {
    console.log("removed")
    setAddedRecipes(addedRecipes.filter((recipe) => recipe.recipe_id !== recipeId));
  }

  return (
    <>
      <form>
        <label>Enter plan name</label>
        <div>
          <input
            className="rounded-md p-2 bg-zinc-800 focus:outline-none focus:outline-slate-600 hover:bg-zinc-700"
            type="text"
          />
        </div>
        <label>Enter plan description</label>
        <div>
          <input
            className="rounded-md p-2 bg-zinc-800 focus:outline-none focus:outline-slate-600 hover:bg-zinc-700"
          />
        </div>
      </form>
      <span>Added recipes</span>
      <RecipesTable recipes={addedRecipes ? addedRecipes : []} handleButtonClick={handleRemoveClick} buttonAction='remove' />
      <RecipeSearch placeholder="Search Recipes..." />
      <RecipesTable recipes={recipes ? recipes : []} handleButtonClick={handleAddClick} buttonAction='add' />
    </>
  );
}
'use client';

import { createPlan, PlanState } from '@/app/lib/actions';
import { useState, useActionState } from 'react';
import { Recipe, RecipePreviewInfo } from '@/app/lib/definitions';
import RecipeSearch from '@/app/ui/recipe-search';
import RecipesTable from '@/app/ui/recipes/recipes-table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tag } from '@/app/lib/definitions';

export default function CreatePlanForm({ recipes, allTags }: { recipes: Recipe[], allTags: Tag[] }) {
  const [addedRecipes, setAddedRecipes] = useState<RecipePreviewInfo[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const initialState: PlanState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createPlan, initialState);

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

  function handleTagChange(tagIDs: string[]) {
    setTags(tagIDs);
  }

  return (
    <>
      <form action={formAction}>
        <label>Enter plan name</label>
        <div className="flex justify-between">
          <input
            className="rounded-md p-2 bg-zinc-800 focus:outline-none focus:outline-slate-600 hover:bg-zinc-700"
            name="planName"
            type="text"
          />
          <button
            type="submit"
          >
            Create plan
          </button>
        </div>
        <label>Enter plan description</label>
        <div>
          <input
            className="rounded-md p-2 bg-zinc-800 focus:outline-none focus:outline-slate-600 hover:bg-zinc-700"
            name="planDescription"
            type="text"
          />
        </div>
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
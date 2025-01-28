'use client';

import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { RecipePreviewInfo } from '@/app/lib/definitions';
import RecipePreview from './recipe-preview';

export default function RecipesTable({ recipes, handleButtonClick, buttonAction }: {
 recipes: RecipePreviewInfo[] | undefined,
 handleButtonClick?: ((arg0:string, arg1:string, arg2: number, arg3: number) => void),
 buttonAction?: string
}) {
  return (
    <div className="flex justify-around grid grid-cols-3">
      {recipes?.map((recipe, index) => {
        return (
          <div
            key={index}
            className="relative flex justify-item-center py-4"
          >
            <RecipePreview
              id={recipe.recipe_id}
              name={recipe.recipe_name}
              calories={recipe.calories}
              cookTimeMin={recipe.cook_time_min}
            />
            <button
              className={`absolute top-4 right-14${handleButtonClick ? '' : ' invisible'}`}
              type="button"
              onClick={() => {
                if (handleButtonClick && buttonAction == 'add') {
                  handleButtonClick(recipe.recipe_id, recipe.recipe_name, recipe.calories, recipe.cook_time_min);
                }
                else if (handleButtonClick && buttonAction == 'remove') {
                  handleButtonClick(recipe.recipe_id, recipe.recipe_name, recipe.calories, recipe.cook_time_min);
                }
              }}
            >
              {buttonAction == 'add' ? <PlusIcon className="w-6" /> : <TrashIcon className="w-6" />}
            </button>
          </div>
        );
      })}
    </div>
  );
}
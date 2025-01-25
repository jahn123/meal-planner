import { Recipe } from '@/app/lib/definitions';
import RecipePreview from './recipe-preview';

export default function RecipesTable({ recipes }: { recipes: Recipe[] | undefined }) {
  return (
    <div className="flex justify-around grid grid-cols-3">
      {recipes?.map((recipe) => {
        return (
          <div
            key={recipe.recipe_id}
            className="flex justify-item-center py-4"
          >
            <RecipePreview
              id={recipe.recipe_id}
              name={recipe.recipe_name}
              calories={recipe.calories}
              cookTimeMin={recipe.cook_time_min}
            />
          </div>
        );
      })}
    </div>
  );
}
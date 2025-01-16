import RecipeForm from '@/app/ui/recipes/recipe-form';
import { fetchRecipeById, fetchTags } from '@/app/lib/data';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const recipe = await fetchRecipeById(params.id);
  const tags = await fetchTags();
  if (!tags) return;
  if (!recipe) return; // TODOminor: is there a better way?

  return (
    <div>
      <RecipeForm
        id={recipe.recipe_id}
        name={recipe.recipe_name}
        description={recipe.recipe_description}
        calories={recipe.calories}
        cookTimeMin={recipe.cook_time_min}
        tags={tags}
        ingredients={recipe.ingredients}
        steps={recipe.steps}
      />
    </div>
  );
}
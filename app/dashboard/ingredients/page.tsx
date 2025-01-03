import { fetchIngredients } from "@/app/lib/data";
import IngredientPreview from "@/app/ui/ingredients/ingredient-preview";

export default async function Page() {
  const ingredients = await fetchIngredients();

  return (
    <main>
      <h1>
        Ingredients
      </h1>
      {ingredients?.map((ingredient) => {
        return (
          <div
            key={ingredient.ingredient_id}
          >
            <IngredientPreview id={ingredient.ingredient_id} name={ingredient.ingredient_name} />
          </div>
        );
      })}
    </main>
  );
}
import { fetchRecipesFromPlan } from "../lib/data";
import RecipesTable from '@/app/ui/recipes/recipes-table';

export default async function Page() {
  const recipes = await fetchRecipesFromPlan("1");
  
  return (
    <div>
      <div>
        <p>Current Plan</p>
        <RecipesTable recipes={recipes} />
      </div>
      <div>
        Plan next week{`'`}s meal
      </div>
    </div>
  );
}
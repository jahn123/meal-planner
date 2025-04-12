import { fetchRecipesFromPlan } from '../lib/data';
import RecipesTable from '@/app/ui/recipes/recipes-table';
import PlanCalendar from '../ui/plans/plan-calendar';

export default async function Page() {
  // const recipes = await fetchRecipesFromPlan("1");

  return (
    <div>
      <div>
        <PlanCalendar />
        {/* <RecipesTable recipes={recipes} /> */}
      </div>
    </div>
  );
}
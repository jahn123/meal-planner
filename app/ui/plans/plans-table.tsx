import { DeletePlan } from './buttons';
import { PlanPreviewInfo } from '@/app/lib/definitions';
import RecipePreview from '../recipes/recipe-preview';
import Link from 'next/link';

export default function PlansTable({ plans }: { plans: PlanPreviewInfo[] }) {
  return (
    <div>
      {plans.map((plan, index) => {
        return(
          <div key={index}>
            <div className="flex justify-between">
              {plan.plan_name}
              <div className="flex justify-end">
                <Link
                  href={`/dashboard/plans/${plan.plan_id}/edit`}
                  className="px-1"
                >
                  Edit
                </Link>
                {/* </button> */}
                <DeletePlan id={plan.plan_id} />
              </div>
            </div>
            <div className="flex justify-around grid grid-cols-3">
              {plan.recipes.map((recipe, index) => {
                // return <RecipesTable  />
                return (
                  <div
                    key={index}
                    // className="flex justify-item-center py-4"
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
          </div>
        );
      })}
    </div>
  );
}
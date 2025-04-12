import PlanForm from '@/app/ui/plans/plan-form';
import { fetchPlanById, fetchPagedRecipesResult } from '@/app/lib/data';

export default async function Page(props: { params: Promise<{ id: string }>, searchParams?: Promise<{
  query?: string;
  page?: string;
}> }) {
  const params = await props.params;
  const planData = await fetchPlanById(params.id);

  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const query = searchParams?.query;

  const recipes = query ? await fetchPagedRecipesResult(query, currentPage) : '';

  if (!planData) return;
  return (
    <main>
      <PlanForm plan={planData} recipes={recipes ? recipes : []} />
    </main>
  );
}
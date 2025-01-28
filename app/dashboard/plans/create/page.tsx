import { fetchPagedRecipesResult } from '@/app/lib/data';
import CreatePlanForm from '@/app/ui/plans/create-plan-form';

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const query = searchParams?.query;

  const recipes = query ? await fetchPagedRecipesResult(query, currentPage) : '';
  // console.log(recipes)

  return (
    <main>
      <CreatePlanForm recipes={recipes ? recipes : []} />
    </main>
  );
}
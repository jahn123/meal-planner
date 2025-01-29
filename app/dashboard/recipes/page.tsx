import Link from 'next/link';
import { fetchPagedRecipesResult, fetchRecipesPreview } from '@/app/lib/data';
import RecipesTable from '@/app/ui/recipes/recipes-table';
import RecipeSearch from '@/app/ui/recipe-search';
import { PlusIcon } from '@heroicons/react/24/outline';

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const query = searchParams?.query || '';

  const recipes = await fetchRecipesPreview();
  const recipeSearchResult = await fetchPagedRecipesResult(query, currentPage);

  return (
    <main>
      <h1 className="flex justify-between pb-4">
        Recipes
        <Link
          className="rounded-md p-1 bg-gray-900"
          href='/dashboard/recipes/create'
        >
          <PlusIcon className="w-6 bg-gray-900" />
        </Link>
      </h1>
      <RecipeSearch placeholder="Search Recipes..." />
      <RecipesTable recipes={recipeSearchResult ? recipeSearchResult : recipes} />
    </main>
  );
}
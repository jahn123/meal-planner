import { fetchRecipesPreview } from '@/app/lib/data';
import RecipesTable from '@/app/ui/recipes/recipes-table';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

export default async function Page() {
  const recipes = await fetchRecipesPreview();

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
      <RecipesTable recipes={recipes} />
    </main>
  );
}
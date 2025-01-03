import Image from 'next/image';
import Link from 'next/link'
import { fetchRecipeById } from '@/app/lib/data';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { DeleteRecipe } from './buttons';

export default async function RecipeView({ id }: { id: string }) {
  const recipe = await fetchRecipeById(id);

  return (
    <div>
      <Image 
        src="/ramen-recipe-image.jpg"
        width={1000}
        height={500}
        alt="Picture of the meal"
      />
      {/* Recipe header */}
      <div className="py-2 grid grid-cols-2">
        <div>
          <h1>{recipe?.recipe_name}</h1>
          <h2>{recipe?.recipe_description}</h2>
        </div>
        <div className="flex justify-end">
          {/* Edit button */}
          <Link
            href={`/dashboard/recipes/${id}/edit`}
            className="rounded-md p-2 hover:bg-gray-800"
          >
            <PencilSquareIcon className="w-6" />
          </Link>
          {/* Delete Button */}
          <DeleteRecipe id={id} />
        </div>
      </div>
      {/* Ingredients */}
      <div className="pb-3">
        <h1>Ingredients</h1>
        <div className="grid grid-cols-2 h-full">
          {recipe?.ingredients?.map((ingredient, index = 0) => {
            return (
              <span
                key={++index}
              >
                {ingredient}
              </span>
            );
          })}
        </div>
      </div>
      {/* Recipe steps */}
      <div>
        <h1>Steps</h1>
        <div className="flex flex-col h-full">
          {recipe?.steps?.map((step, index = 0) => {
            return (
              <span
                key={++index}
              >
                {step}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
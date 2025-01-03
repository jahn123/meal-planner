import { deleteRecipe } from '@/app/lib/actions';
import { TrashIcon } from '@heroicons/react/24/outline';

export function DeleteRecipe({ id }: { id: string }) {
  const deleteRecipeWithId = deleteRecipe.bind(null, id);

  return (
    <form action={deleteRecipeWithId}>
      <button 
        className="rounded-md p-2 hover:bg-gray-800"
      >
        <TrashIcon className="w-6" />
      </button>
    </form>
  );
}
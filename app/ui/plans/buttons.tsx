import { deletePlan } from '@/app/lib/actions';
import { TrashIcon } from '@heroicons/react/24/outline';

export function DeletePlan({ id }: { id: string }) {
  const deletePlanWithId = deletePlan.bind(null, id);

  return (
    <form action={deletePlanWithId}>
      <button 
        className="rounded-md p-2 hover:bg-gray-300"
      >
        <TrashIcon className="w-6" />
      </button>
    </form>
  );
}
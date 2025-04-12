import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { fetchPlans } from '@/app/lib/data';
import PlansTable from '@/app/ui/plans/plans-table';

export default async function Page() {
  const plans = await fetchPlans();

  return (
    <main>
      <div className="flex justify-between">
        <h1>
          Plans
        </h1>
        <Link
          href={`/dashboard/plans/create`}
        >
          <PlusIcon className="w-6" />
        </Link>
      </div>
      <PlansTable plans={plans ? plans : []} />
    </main>
  );
}
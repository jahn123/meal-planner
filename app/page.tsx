import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Page() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div>
        <h1>
          Meal Planner
        </h1>
        <Link
          href="/login"
          className="flex items-center gap-5 self-start rounded-lg px-6 py-3 text-sm font-medium transition-colors hover:bg-blue-400 md:text-base"
        >
          <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
        </Link>
      </div>
    </main>
  );
}
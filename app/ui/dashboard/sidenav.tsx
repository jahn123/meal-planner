import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { PowerIcon } from '@heroicons/react/24/outline';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      {/* Logo/Home page link */}
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-gray-900 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          {/* logo here */}
          Meal Planner
        </div>
      </Link>
      {/* Navigation menu options */}
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        {/* Hidden Block to fill out space */}
        <div className="invisible hidden h-auto w-full grow rounded-md bg-zinc-950 md:block"></div>
        <form
          action={async () => {
            'use server';
            // finish authentication
          }}
        >
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-900 p-3 text-sm font-medium hover:bg-zinc-950 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}

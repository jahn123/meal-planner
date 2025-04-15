'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function RecipeSearch({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set('query', term);
    }
    else {
      params.delete('query');
    }

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex justify-center">
      <input
        className="w-8/12 rounded-md p-2 bg-gray-200 focus:outline-none focus:outline-gray-400 hover:bg-zinc-300"
        type="text"
        placeholder={placeholder}
        defaultValue={searchParams.get('query')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
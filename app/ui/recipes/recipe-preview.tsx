import Image from 'next/image';
import Link from 'next/link';
import { convertMinToHrMin } from '@/app/lib/utils';

export default function RecipePreview({ id, name, calories, cookTimeMin }: {
  id: string, name: string, calories: number, cookTimeMin: number
}) {
  const { cookTimeHr, leftoverCookTimeMin } = convertMinToHrMin(cookTimeMin);

  return (
    <div className="flex justify-center rounded-md w-full">
      <Link
        href={`/dashboard/recipes/${id}/view`}
      >
          <Image
            src="/ramen-recipe-image.jpg"
            width={400}
            height={300}
            alt={`image of ${name}`}
            className="rounded-md bg-gray-300"
          />
        <div className="rounded-md flex justify-around bg-gray-400 text-white">
          <div>
            {name}
          </div>
          <div>
            <div>
              calories: {calories ? calories : '--'}
            </div>
            <div>
              time: {cookTimeHr ? cookTimeHr : '--'} hr. {leftoverCookTimeMin ? leftoverCookTimeMin : '--'} min.
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
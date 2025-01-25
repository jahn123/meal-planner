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
            className="rounded-md bg-gray-900"
          />
        <div className="rounded-md flex justify-around bg-gray-900 text-white">
          <div>
            {name}
          </div>
          <div>
            <div>
              calories: {calories}
            </div>
            <div>
              cook time: {cookTimeHr}
              <span>
                :{leftoverCookTimeMin}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
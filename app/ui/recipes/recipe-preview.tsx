import Image from 'next/image';
import Link from 'next/link';
import { convertMinToHrMin } from '@/app/lib/utils';

export default function RecipePreview({
  id, name, calories, cookTimeMin
}: {
  id: string, name: string, calories: number, cookTimeMin: number
}) {
  const { cookTimeHr, leftoverCookTimeMin } = convertMinToHrMin(cookTimeMin);

  return (
    <div className="rounded-md">
      <Link
        href={`/dashboard/recipes/${id}/view`}
      >
        <div>
          <Image
            src="/ramen-recipe-image.jpg"
            width={450}
            height={450}
            alt={`image of ${name}`}
            className="rounded-md bg-gray-900"
          />
        </div>
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
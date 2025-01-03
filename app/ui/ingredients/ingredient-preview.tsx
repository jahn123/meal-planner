import Link from 'next/link';
import Image from 'next/image';

export default function IngredientPreview({ id, name }: { id:string, name:string }) {
  return (
    <div>
      <Link
        href={`/dashboard/ingredients/${id}/edit`}
      >
        <Image
          src="/ingredient-image.jpg"
          width={450}
          height={450}
          alt={`image of ${name}`}
          className="rounded-md"
        />
        <div className="flex">
          <div>
            {name}
          </div>
        </div>
      </Link>
    </div>
  );
}
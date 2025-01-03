import Image from "next/image";

export default function IngredientForm () {
  return (
    <form>
      <div>
        <div>
          <Image 
            src="/ingredient-image.jpg"
            width={500}
            height={500}
            alt="Picture of the ingredient"
          />
        </div>
        <div>
          <input
            className="peer block rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            id="ingredientName"
            type="text"
            name="ingredientName"
            placeholder="Ingredient"
            required
          >
          </input>
        </div>
        <label
        >
          Calories
        </label>
        <div>
          <input
            className="peer block rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            id="calories"
            type="number"
            name="calories"
            placeholder="Calories"
            required
          >
          </input>
        </div>
        <label
        >
          Price
        </label>
        <div>
          <input
            className="peer block rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            id="price"
            type="number"
            name="price"
          >
          </input>
        </div>
      </div>
    </form>
  );
}
import CreateRecipeForm from "@/app/ui/recipes/create-recipe-form";
import { fetchTags } from '@/app/lib/data';

export default async function Page() {
  const tags = await fetchTags();
  if (!tags) return;

  return (
    <main>
      <CreateRecipeForm allTags={tags}/>
    </main>
  );
}
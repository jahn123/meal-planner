import RecipeView from "@/app/ui/recipes/recipe-view";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  return(
    <RecipeView id={params.id} />
  );
}
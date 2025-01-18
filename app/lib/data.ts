import { sql } from '@vercel/postgres';
import { Plan, Ingredient, Recipe, Tag } from './definitions'
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchRecipes() {
  noStore();
  try {
    const data = await sql<Recipe>`
      SELECT * FROM recipes
    `;
    // console.log(data)

    return data.rows;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchRecipesPreview() {
  noStore();
  try {
    const data = await sql<Recipe>`
      SELECT recipe_id, recipe_name, calories, cook_time_min
      FROM recipes
    `;
    // console.log(data)

    return data.rows;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchRecipeById(id: string) {
  noStore();
  try {
    const recipeData = await sql<Recipe>`
      SELECT *
      FROM recipes
      WHERE recipes.recipe_id = ${id}
    `;
    const recipeTagData = await sql<Tag>`
      SELECT recipe_tags.tag_id, tags.tag_name, tags.tag_icon
      FROM tags
      INNER JOIN recipe_tags ON recipe_tags.tag_id=tags.tag_id
      WHERE recipe_id = ${id}
    `;

    return { ...recipeData.rows[0], tags: recipeTagData.rows };
  } catch (error) {
    console.error(error);
  }
}

export async function fetchTags() {
  noStore();
  try {
    const data = await sql<Tag>`
      SELECT *
      FROM tags
    `;
      // console.log(data)
      return data.rows;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchCurrentPlan() {
  try {
    
  } catch (error) {
    console.error(error);
  }
}

export async function fetchPlans() {
  noStore();
  try {
    const data = await sql<Plan>`SELECT * FROM plans`;
    // console.log(data);
    return data.rows;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchRecipesFromPlan(id:string){
  noStore();
  try {
    const data = await sql<Recipe>`
      SELECT 
        recipes.recipe_id,
        recipes.recipe_name,
        recipes.calories,
        recipes.cook_time_min
      FROM plan_recipes
      JOIN recipes ON plan_recipes.recipe_id = recipes.recipe_id
      WHERE plan_recipes.plan_id = ${id}
      `;

    // console.log(data);
    return data.rows;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchIngredients() {
  noStore();
  try {
    const data = await sql<Ingredient>`SELECT * FROM ingredients`;
    // console.log(data)

    return data.rows;
  } catch (error) {
    console.error(error);
  }
}
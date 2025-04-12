import { sql } from '@vercel/postgres';
import { Plan, Ingredient, Recipe, Tag, RecipePreviewInfo } from './definitions'
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

const ITEMS_PER_PAGE = 9;
export async function fetchPagedRecipesResult(query: string, page: number) {
  noStore();
  const rowsToSkip = (page - 1) * ITEMS_PER_PAGE;

  try {
    const recipeData = await sql<Recipe>`
      SELECT recipe_id, recipe_name, calories, cook_time_min 
      FROM recipes
      WHERE recipe_name ILIKE ${`%${query}%`}
      OFFSET ${rowsToSkip} ROWS
      FETCH FIRST ${ITEMS_PER_PAGE} ROWS ONLY
    `;
    const recipeTagData = await Promise.all(recipeData.rows.map((recipe) => {
      return sql`
        SELECT recipe_tags.tag_id, tags.tag_name, tags.tag_icon
        FROM tags
        INNER JOIN recipe_tags ON recipe_tags.tag_id=tags.tag_id
        WHERE recipe_id = ${recipe.recipe_id}
      `;
    }));

    // console.log(recipeData.rows.length)
    return recipeTagData.map((tags, index) => {
      return {...recipeData.rows[index], tags: tags.rows.map((tag) => {
        return { tag_id: tag.tag_id, tag_name: tag.tag_name };
      })};
    });
  } catch (error) {
    console.error(error);
  }
}

export async function fetchRecipePageCount(query: string) {
  noStore();
  try {
    const data = await sql`
      SELECT COUNT(*)
      FROM recipes
      WHERE recipe_name ILIKE ${`${`%${query}%`}`}
    `;
    console.log(data)

    return data.rows[0].count;
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

// fetch all tags
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

// fetches plans for the current week and the next 3 weeks
export async function fetchCurrentPlans() {
  try {
    
  } catch (error) {
    console.error(error);
  }
}

export async function fetchPlans() {
  noStore();
  try {
    const plansData = await sql<Plan>`SELECT * FROM plans`;
    const planRecipeData = await Promise.all(plansData.rows.map((plan) => {
      return sql<RecipePreviewInfo>`
        SELECT recipes.recipe_id, recipe_name, calories, cook_time_min
        FROM recipes
        INNER JOIN plan_recipes
        ON recipes.recipe_id = plan_recipes.recipe_id
        WHERE plan_recipes.plan_id = ${plan.plan_id}
      `;
    }));

    return plansData.rows.map((plan, index) => {
      return {
        plan_id: plan.plan_id,
        plan_name: plan.plan_name,
        recipes: planRecipeData[index].rows
      };
    });
  } catch (error) {
    console.error(error);
  }
}

export async function fetchPlanById(id: string) {
  try {
    const planData = await sql<Plan>`
      SELECT * FROM plans
      WHERE plan_id = ${id}
    `;
    const planRecipeData = await sql<RecipePreviewInfo>`
      SELECT
        plan_recipes.recipe_id,
        recipes.recipe_name,
        recipes.calories,
        recipes.cook_time_min
      FROM recipes
      INNER JOIN plan_recipes
      ON recipes.recipe_id = plan_recipes.recipe_id
      WHERE plan_recipes.plan_id = ${id}
    `;

    return { ...planData.rows[0], recipes: planRecipeData.rows };
  } catch(error) {
    console.error(error);
  }
}

export async function fetchRecipesFromPlan(id: string) {
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
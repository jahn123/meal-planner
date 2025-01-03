'use server';

import { sql } from '@vercel/postgres';
import { neon } from '@neondatabase/serverless';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// TODO: switch to neon sql
const neonSql = neon(`${process.env.DATABASE_URL}`);

export type RecipeState = {
  errors?: {
    name?: string[];
    description?: string[];
    calories?: string[];
    cookTimeMin?: string[];
    ingredients?: string[];
    steps?: string[];
  };
  message?: string | null;
};

const RecipeFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  calories: z.coerce
    .number().optional(),
  cookTimeMin: z.coerce
    .number().optional(),
  ingredients: z.string()
    .array().optional(),
  steps: z.string()
    .array().optional(),
});

const CreateRecipe = RecipeFormSchema.omit({ id: true });
export async function createRecipe(prevState: RecipeState, formData: FormData) {
  const validatedFields = CreateRecipe.safeParse({
    name: formData.get('recipeName'),
    description: formData.get('recipeDescription'),
    calories: formData.get('calories'),
    cookTimeMin: formData.get('cookTimeMin'),
    ingredients: formData.getAll('ingredient'),
    steps: formData.getAll('step'),
  });

  if (!validatedFields.success) {
    return ({
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    });
  }

  const { name, description, calories, cookTimeMin, ingredients, steps } = validatedFields.data;

  try {
    await neonSql`
      INSERT INTO recipes (recipe_name, recipe_description, calories, cook_time_min, ingredients, steps)
      VALUES (${name}, ${description}, ${calories}, ${cookTimeMin}, ${ingredients}, ${steps})
    `;
  } catch (error) {
    console.error(error);
    return { message: 'Database Error: ' };
  }

  revalidatePath('/dashboard/recipes');
  redirect('/dashboard/recipes');
}

const UpdateRecipe = RecipeFormSchema.omit({ id: true })
export async function updateRecipe(id: string, prevState: RecipeState, formData: FormData) {
  const validatedFields = UpdateRecipe.safeParse({
    name: formData.get('recipeName'),
    description: formData.get('recipeDescription'),
    calories: formData.get('calories'),
    cookTimeMin: formData.get('cookTimeMin'),
    ingredients: formData.getAll('ingredient'),
    steps: formData.getAll('step'),
  });
  // console.log(validatedFields)
  if (!validatedFields.success) {
    return ({
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    });
  }

  const { name, description, calories, cookTimeMin, ingredients, steps } = validatedFields.data;

  try {
    await neonSql`
      UPDATE recipes
      SET recipe_name = ${name},
        recipe_description = ${description},
        calories = ${calories},
        cook_time_min = ${cookTimeMin},
        ingredients = ${ingredients},
        steps = ${steps}
      WHERE recipe_id = ${id}
    `;
  } catch (error) {
    console.log(error);
    return { message: 'Database Error: Failed to Update' };
  }

  revalidatePath(`/dashboard/recipes${id}/view`);
  redirect(`/dashboard/recipes/${id}/view`);
}

export async function deleteRecipe(id: string) {
  try {
    await sql`
      DELETE FROM recipes
      WHERE recipe_id = ${id}
    `;
    revalidatePath('/dashboard/invoices');
    // return { message: 'Deleted Invoice.' };
  } catch (error) {
    console.error(error);
    // return { message: 'Database Error: Failed to Delete' };
  }

  redirect('/dashboard/recipes');
}
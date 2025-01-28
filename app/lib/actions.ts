'use server';

import { sql } from '@vercel/postgres';
import { neon } from '@neondatabase/serverless';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { convertHrMinToMin } from './utils';

const neonSql = neon(`${process.env.DATABASE_URL}`);

export type RecipeState = {
  errors?: {
    name?: string[];
    description?: string[];
    calories?: string[];
    cookTimeHr?: string[];
    cookTimeMin?: string[];
    ingredients?: string[];
    steps?: string[];
    tagIDs?: string[];
  };
  message?: string | null;
};

export type UserState = {
  errors?: {
    username?: string[];
    // email?: string[];
    password?: string[];
  };
  message?: string | null;
};

const RecipeFormSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  calories: z.coerce
    .number().int().optional(),
  cookTimeHr: z.coerce
    .number().int().optional(),
  cookTimeMin: z.coerce
    .number().int().optional(),
  ingredients: z.string()
    .array().optional(),
  steps: z.string()
    .array().optional(),
  tagIDs: z.string().uuid()
    .array().optional(),
});

const UserFormSchema = z.object({
  id: z.string(),
  username: z.string(),
  // email: z.string().optional(),
  password: z.string().min(6),
});

const CreateRecipe = RecipeFormSchema.omit({ id: true });
export async function createRecipe(prevState: RecipeState, formData: FormData) {
  console.log(formData)
  const validatedFields = CreateRecipe.safeParse({
    name: formData.get('recipeName'),
    description: formData.get('recipeDescription'),
    calories: formData.get('calories'),
    cookTimeHr: formData.get('cookTimeHr'),
    cookTimeMin: formData.get('cookTimeMin'),
    ingredients: formData.getAll('ingredient'),
    steps: formData.getAll('step'),
    tagIDs: formData.getAll('tags[]'),
  });

  if (!validatedFields.success) {
    return ({
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    });
  }

  const { name, description, calories, cookTimeHr, cookTimeMin, ingredients, steps, tagIDs } = validatedFields.data;
  const totalCookTimeMin = convertHrMinToMin(cookTimeHr, cookTimeMin);

  try {
    const recipeResult = await neonSql`
      INSERT INTO recipes (recipe_name, recipe_description, calories, cook_time_min, ingredients, steps)
      VALUES (${name}, ${description}, ${calories}, ${totalCookTimeMin}, ${ingredients}, ${steps})
      RETURNING (recipe_id)
    `;

    const tagPromises: Promise<any>[] = [];
    tagIDs?.forEach((tagID) => { tagPromises.push(neonSql`
      INSERT INTO recipe_tags (recipe_id, tag_id)
      VALUES (${recipeResult[0].recipe_id}, ${tagID})
    `);
    });
    await Promise.all(tagPromises);
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
    cookTimeHr: formData.get('cookTimeHr'),
    cookTimeMin: formData.get('cookTimeMin'),
    ingredients: formData.getAll('ingredient'),
    steps: formData.getAll('step'),
    tagIDs: formData.getAll('tags[]'),
  });

  if (!validatedFields.success) {
    return ({
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    });
  }

  const { name, description, calories, cookTimeHr, cookTimeMin, ingredients, steps, tagIDs } = validatedFields.data;
  const totalCookTimeMin = convertHrMinToMin(cookTimeHr, cookTimeMin);
  console.log(totalCookTimeMin)

  try {
    await neonSql`
      UPDATE recipes
      SET recipe_name = ${name},
        recipe_description = ${description},
        calories = ${calories},
        cook_time_min = ${totalCookTimeMin},
        ingredients = ${ingredients},
        steps = ${steps}
      WHERE recipe_id = ${id}
    `;

    await neonSql`
      DELETE FROM recipe_tags
      WHERE recipe_id = ${id}
    `;

    const tagPromises: Promise<any>[] = [];
    tagIDs?.forEach((tagID) => { tagPromises.push(neonSql`
      INSERT INTO recipe_tags (recipe_id, tag_id)
      VALUES (${id}, ${tagID})
    `);
    });
    await Promise.all(tagPromises);
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

const CreateUser = UserFormSchema.omit({ id: true });
export async function createUser(prevState: UserState, formData: FormData) {
  const validatedFields = CreateUser.safeParse({
    username: formData.get('username'),
    // email: formData.get('ingredient'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return ({
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create User.',
    });
  }

  const { username, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await sql`
      INSERT INTO users (username, password)
      VALUES (${username}, ${hashedPassword})
    `;
  } catch (error) {
    console.error(error);
    // return 'Something went wrong.';
    return { errors: {}, message: 'Something went wrong.' };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
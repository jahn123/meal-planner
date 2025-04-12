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

export type UserState = {
  errors?: {
    username?: string[];
    // email?: string[];
    password?: string[];
  };
  message?: string | null;
};

export type PlanState = {
  errors?: {
    name?: string[];
    description?: string[];
    recipeIDs?: string[];
    tagIDs?: string[];
  };
  message?: string | null;
};

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

const UserFormSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  // email: z.string().optional(),
  password: z.string().min(6),
});

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

const PlanFormSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string(),
  recipeIDs: z.string().uuid()
    .array(),
  tagIDs: z.string().uuid()
    .array().optional(),
});

const CreatePlan = PlanFormSchema.omit({ id: true });
export async function createPlan(prevState: PlanState, formData: FormData) {
  // console.log(formData)
  const validatedFields = CreatePlan.safeParse({
    name: formData.get('planName'),
    description: formData.get('planDescription'),
    recipeIDs: formData.getAll('recipeIDs'),
    tagIDs: formData.getAll('tagIDs'),
  });

  if (!validatedFields.success) {
    return ({
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    });
  }

  const { name, description, recipeIDs, tagIDs } = validatedFields.data;
  // console.log(validatedFields.data)
  try {
    const result = await sql`
      INSERT INTO plans (plan_name, plan_description)
      VALUES (${name}, ${description})
      RETURNING (plan_id)
    `;
    const newPlanId = result.rows[0].plan_id;

    const recipePromises: Promise<any>[] = [];
    recipeIDs?.forEach((recipeID) => {
      recipePromises.push(neonSql`
        INSERT INTO plan_recipes (plan_id, recipe_id)
        VALUES (${newPlanId}, ${recipeID})
      `);
    });
    await Promise.all(recipePromises);
  } catch (error) {
    console.error(error);
    return { message: 'Database Error: ' };
  }

  revalidatePath('/dashboard/plans');
  redirect('/dashboard/plans');
}

const UpdatePlan = PlanFormSchema.omit({ id: true });
export async function updatePlan(id: string, prevState: PlanState, formData: FormData) {
  // console.log(formData)
  const validatedFields = UpdatePlan.safeParse({
    name: formData.get('planName'),
    description: formData.get('planDescription'),
    recipeIDs: formData.getAll('recipeIDs'),
    tagIDs: formData.getAll('tagIDs'),
  });

  if (!validatedFields.success) {
    return ({
      message: 'Missing Fields. Failed to Create Invoice.',
      errors: validatedFields.error.flatten().fieldErrors,
    });
  }
  // console.log(validatedFields.data)
  const { name, description, recipeIDs } = validatedFields.data;

  try {
    // await sql`
    //   UPDATE plans
    //   SET
    //     plan_name = ${name},
    //     plan_description = ${description}
    //   WHERE plan_id = ${id}
    // `;

    await sql`
      DELETE FROM plan_recipes
      WHERE plan_id = ${id}
    `;

    // (${id}, ${recipeIDs[0]})
    // console.log(recipeIDs)
    // const values = recipeIDs.map((recipeID) => `(${id}, ${recipeID})`).join(', ');
    // console.log(values)
    // const query = `
    //   INSERT INTO plan_recipes (plan_id, recipe_id)
    //   VALUES ${values}
    // `;
    // await sql.query(query, values);
    const recipePromises: Promise<any>[] = [];
    recipeIDs?.forEach((recipeID) => { 
      recipePromises.push(
        sql`
          INSERT INTO plan_recipes (plan_id, recipe_id)
          VALUES
            (${id}, ${recipeID})`
      );
    });
  } catch (error) {
    console.error(error);
    return { message: 'Database Error: Failed to Update' };
  }

  revalidatePath(`/dashboard/plans/${id}/view`);
  redirect(`/dashboard/plans/${id}/view`);
}

const CreateRecipe = RecipeFormSchema.omit({ id: true });
export async function createRecipe(prevState: RecipeState, formData: FormData) {
  // console.log(formData)
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
    tagIDs?.forEach((tagID) => {
      tagPromises.push(neonSql`
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
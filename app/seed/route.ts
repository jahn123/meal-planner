import { db } from '@vercel/postgres';

const client = await db.connect();

async function createPrimaryTables() {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createUsers = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(60) NOT NULL
      );
    `;
    console.log('Created users table');

    const createPlans = await client.sql`
      CREATE TABLE IF NOT EXISTS plans (
        plan_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY
      );
    `;
    console.log('Created plans table');

    const createRecipes = await client.sql`
      CREATE TABLE IF NOT EXISTS recipes (
        recipe_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        recipe_name VARCHAR(75) NOT NULL UNIQUE,
        recipe_description VARCHAR(300),
        calories INT,
        cook_time_min INT,
        ingredients VARCHAR[],
        steps VARCHAR[]
      );
    `;
    console.log('Created recipes table');

    const createTags = await client.sql`
      CREATE TABLE IF NOT EXISTS tags (
        tag_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        tag_name VARCHAR(75) NOT NULL UNIQUE,
        tag_icon VARCHAR(40) UNIQUE
      );
    `;
    console.log('Created tags table');

    return {
      createUsers,
      createPlans,
      createRecipes,
      createTags,
    };
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

async function createSecondaryTables() {
  try {
    const createPlanRecipes = await client.sql`
      CREATE TABLE IF NOT EXISTS plan_recipes (
        plan_recipe_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        plan_id UUID NOT NULL,
        recipe_id UUID NOT NULL,
        CONSTRAINT fk_plan
          FOREIGN KEY(plan_id)
          REFERENCES plans(plan_id),
        CONSTRAINT fk_recipe
          FOREIGN KEY(recipe_id)
          REFERENCES recipes(recipe_id)
      );
    `;
    console.log('Created plan_recipes table');

    const createRecipeTags = await client.sql`
      CREATE TABLE IF NOT EXISTS recipe_tags (
        recipe_tag_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        recipe_id UUID NOT NULL,
        tag_id UUID NOT NULL,
        CONSTRAINT fk_recipe
          FOREIGN KEY(recipe_id)
          REFERENCES recipes(recipe_id),
        CONSTRAINT fk_tag
          FOREIGN KEY(tag_id)
          REFERENCES tags(tag_id)
      );
    `;
    console.log('Created recipe_tags table');

    return {
      createPlanRecipes,
      createRecipeTags
    };
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await createPrimaryTables();
    await client.sql`COMMIT`;

    await client.sql`BEGIN`;
    await createSecondaryTables();
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database created successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}

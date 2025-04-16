'use server';

import { sql } from '@vercel/postgres';

export async function basicPlanGenerate() {
  // basic attempt using tags and basic recipe info
  // so a user selects a bunch of tags they want to characterize 
  // the plan along w/ sliders for avg. meal calorie amount and cooking time
  // as well as ingredients that they want to use throughout the plan
  // along with settings like the number of meals they want the plan to include

  // i suppose step 1 would be to create a set of recipes that fit this criteria.
  // first create subsets with the individual categories 
  // (recipes that have the tags selected, 
  // recipes that fit along a range of calories,
  // and cook time and have some or most of the desired ingredients)

  // this should supply prime recipe options. if this provides an insufficient number of 
  const tagCompatible = await sql`
  
  `;

  const calorieCompatible = await sql``;

  const cookTimeCompatible = await sql``;

  const ingredientCompatible = await sql``;
}
export type User = {
  user_id: string;
  email: string;
  password: string;
}

export type Plan = {
  plan_id: string,
};

export type Recipe = {
  recipe_id: string;
  recipe_name: string;
  recipe_description: string;
  calories: number;
  cook_time_min: number;
  ingredients: string[];
  steps: string[];
};

export type Ingredient = {
  ingredient_id: string;
  ingredient_name: string;
};
export type User = {
  user_id: string;
  email: string;
  password: string;
}

export type Plan = {
  plan_id: string;
  plan_name: string;
  plan_description: string;
};

export type FullPlanInfo = {
  plan_id: string;
  plan_name: string;
  plan_description: string;
  recipes: RecipePreviewInfo[];
  tags: Tag[];
};

export type PlanPreviewInfo = {
  plan_id: string;
  plan_name: string;
  recipes: RecipePreviewInfo[];
};

export type Recipe = {
  recipe_id: string;
  recipe_name: string;
  recipe_description: string;
  calories: number;
  cook_time_min: number;
  ingredients: string[];
  tags: Tag[];
  steps: string[];
};

export type RecipePreviewInfo = {
  recipe_id: string;
  recipe_name: string;
  calories: number;
  cook_time_min: number;
}

export type NewTag = {
  tag_name: string;
  tag_icon: string;
}

export type Tag = {
  tag_id: string;
  tag_name: string;
  tag_icon?: string;
}

export type Ingredient = {
  ingredient_id: string;
  ingredient_name: string;
};
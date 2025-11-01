/*
  # Create Helper Functions

  1. Functions
    - `calculate_bmr()` - Calculate Basal Metabolic Rate using Mifflin-St Jeor equation
    - `calculate_daily_totals()` - Get daily meal totals for a user
    - `get_user_plan()` - Get personalized plan from user profile
    - `update_daily_summary()` - Recalculate daily summary totals

  2. Purpose
    - Centralized calculation logic for database operations
    - Ensures consistency across the app
    - Enables efficient server-side aggregation

  3. Note
    - All functions are IMMUTABLE or STABLE for query optimization
*/

CREATE OR REPLACE FUNCTION calculate_bmr(
  weight_kg NUMERIC,
  height_cm NUMERIC,
  age INTEGER,
  gender TEXT
)
RETURNS INTEGER AS $$
DECLARE
  bmr NUMERIC;
BEGIN
  IF gender = 'Male' THEN
    bmr := (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5;
  ELSIF gender = 'Female' THEN
    bmr := (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161;
  ELSE
    bmr := (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 78;
  END IF;
  
  RETURN ROUND(bmr)::INTEGER;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION get_activity_multiplier(activity_level TEXT)
RETURNS NUMERIC AS $$
BEGIN
  CASE activity_level
    WHEN 'Sedentary (little or no exercise)' THEN RETURN 1.2;
    WHEN 'Lightly Active (exercise 1-3 days/week)' THEN RETURN 1.375;
    WHEN 'Moderately Active (exercise 3-5 days/week)' THEN RETURN 1.55;
    WHEN 'Very Active (exercise 6-7 days/week)' THEN RETURN 1.725;
    WHEN 'Extremely Active (physical job or training twice per day)' THEN RETURN 1.9;
    ELSE RETURN 1.2;
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION get_daily_totals(
  p_user_id UUID,
  p_date DATE
)
RETURNS TABLE(
  total_calories INTEGER,
  total_protein INTEGER,
  total_carbs INTEGER,
  total_fat INTEGER,
  meals_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(calories), 0)::INTEGER,
    COALESCE(SUM(protein), 0)::INTEGER,
    COALESCE(SUM(carbs), 0)::INTEGER,
    COALESCE(SUM(fat), 0)::INTEGER,
    COUNT(*)::INTEGER
  FROM meals
  WHERE user_id = p_user_id AND date = p_date;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION get_user_plan(p_user_id UUID)
RETURNS TABLE(
  daily_calories INTEGER,
  protein_target INTEGER,
  carbs_target INTEGER,
  fat_target INTEGER,
  goal TEXT,
  activity_level TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    user_profiles.daily_calories,
    user_profiles.protein_target,
    user_profiles.carbs_target,
    user_profiles.fat_target,
    user_profiles.goal,
    user_profiles.activity_level
  FROM user_profiles
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION update_daily_summary(p_user_id UUID, p_date DATE)
RETURNS void AS $$
DECLARE
  v_totals RECORD;
  v_daily_goal INTEGER;
BEGIN
  SELECT * INTO v_totals FROM get_daily_totals(p_user_id, p_date);
  
  SELECT daily_calories INTO v_daily_goal FROM user_profiles WHERE id = p_user_id;
  
  INSERT INTO daily_summaries (user_id, date, total_calories, total_protein, total_carbs, total_fat, meals_logged, calories_remaining)
  VALUES (
    p_user_id,
    p_date,
    v_totals.total_calories,
    v_totals.total_protein,
    v_totals.total_carbs,
    v_totals.total_fat,
    v_totals.meals_count,
    COALESCE(v_daily_goal, 0) - v_totals.total_calories
  )
  ON CONFLICT (user_id, date) DO UPDATE SET
    total_calories = v_totals.total_calories,
    total_protein = v_totals.total_protein,
    total_carbs = v_totals.total_carbs,
    total_fat = v_totals.total_fat,
    meals_logged = v_totals.meals_count,
    calories_remaining = COALESCE(v_daily_goal, 0) - v_totals.total_calories,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

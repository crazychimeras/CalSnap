/*
  # Create User Profiles Table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key) - references auth.users.id
      - `age` (integer) - user's age (13-100)
      - `gender` (text) - Male, Female, or Other
      - `height_cm` (integer) - height in centimeters
      - `weight_kg` (numeric) - current weight in kilograms
      - `activity_level` (text) - sedentary to extremely active
      - `target_weight_kg` (numeric) - goal weight
      - `goal` (text) - Lose Weight, Maintain Weight, or Gain Muscle
      - `daily_calories` (integer) - calculated daily calorie target
      - `protein_target` (integer) - daily protein goal in grams
      - `carbs_target` (integer) - daily carbs goal in grams
      - `fat_target` (integer) - daily fat goal in grams
      - `created_at` (timestamp) - when profile was created
      - `updated_at` (timestamp) - when profile was last updated

  2. Security
    - Enable RLS on `user_profiles` table
    - Users can only read and update their own profile
    - Only authenticated users can access profiles

  3. Indexes
    - Index on user_id for fast lookups
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  age integer NOT NULL CHECK (age >= 13 AND age <= 100),
  gender text NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  height_cm integer NOT NULL CHECK (height_cm >= 100 AND height_cm <= 250),
  weight_kg numeric NOT NULL CHECK (weight_kg >= 20 AND weight_kg <= 250),
  activity_level text NOT NULL CHECK (activity_level IN (
    'Sedentary (little or no exercise)',
    'Lightly Active (exercise 1-3 days/week)',
    'Moderately Active (exercise 3-5 days/week)',
    'Very Active (exercise 6-7 days/week)',
    'Extremely Active (physical job or training twice per day)'
  )),
  target_weight_kg numeric NOT NULL CHECK (target_weight_kg >= 20 AND target_weight_kg <= 250),
  goal text NOT NULL CHECK (goal IN ('Lose Weight', 'Maintain Weight', 'Gain Muscle')),
  daily_calories integer NOT NULL CHECK (daily_calories >= 1000 AND daily_calories <= 5000),
  protein_target integer NOT NULL CHECK (protein_target >= 20 AND protein_target <= 400),
  carbs_target integer NOT NULL CHECK (carbs_target >= 50 AND carbs_target <= 800),
  fat_target integer NOT NULL CHECK (fat_target >= 20 AND fat_target <= 300),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can create their profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users cannot delete their profile"
  ON user_profiles FOR DELETE
  TO authenticated
  USING (false);

CREATE INDEX idx_user_profiles_created_at ON user_profiles(created_at DESC);

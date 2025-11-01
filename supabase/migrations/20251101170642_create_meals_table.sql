/*
  # Create Meals Table

  1. New Tables
    - `meals`
      - `id` (uuid, primary key) - unique meal identifier
      - `user_id` (uuid, foreign key) - references auth.users.id
      - `meal_type` (text) - breakfast, lunch, dinner, or snacks
      - `food_name` (text) - name of the food/dish
      - `calories` (integer) - total calories
      - `protein` (integer) - protein in grams
      - `carbs` (integer) - carbohydrates in grams
      - `fat` (integer) - fat in grams
      - `image_url` (text) - base64 or URL to meal photo
      - `notes` (text) - optional user notes
      - `date` (date) - the date the meal was logged (in user's timezone)
      - `created_at` (timestamp) - when meal was created
      - `updated_at` (timestamp) - when meal was last updated

  2. Security
    - Enable RLS on `meals` table
    - Users can only read, create, update, and delete their own meals
    - Only authenticated users can access meals

  3. Indexes
    - Index on user_id for fast lookups
    - Index on date for efficient daily queries
    - Composite index on user_id + date for optimal performance
*/

CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snacks')),
  food_name text NOT NULL,
  calories integer NOT NULL CHECK (calories >= 0 AND calories <= 5000),
  protein integer NOT NULL CHECK (protein >= 0 AND protein <= 500),
  carbs integer NOT NULL CHECK (carbs >= 0 AND carbs <= 500),
  fat integer NOT NULL CHECK (fat >= 0 AND fat <= 200),
  image_url text,
  notes text,
  date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own meals"
  ON meals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create meals"
  ON meals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meals"
  ON meals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals"
  ON meals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_meals_user_id ON meals(user_id);
CREATE INDEX idx_meals_date ON meals(date DESC);
CREATE INDEX idx_meals_user_date ON meals(user_id, date DESC);
CREATE INDEX idx_meals_user_meal_type ON meals(user_id, meal_type);

/*
  # Create Food Database Table

  1. New Tables
    - `food_database`
      - `id` (uuid, primary key) - unique food identifier
      - `food_name` (text, unique) - standardized food name
      - `calories` (integer) - calories per serving
      - `protein` (integer) - protein in grams per serving
      - `carbs` (integer) - carbs in grams per serving
      - `fat` (integer) - fat in grams per serving
      - `serving_size` (text) - e.g., "100g", "1 cup", "1 medium"
      - `created_at` (timestamp) - when added to database
      - `updated_at` (timestamp) - when last updated

  2. Purpose
    - Cache for common foods to enable fast AI analysis
    - Reduces API calls for frequently logged meals
    - Improves performance when users log similar meals

  3. Security
    - No RLS - this is a public food reference database
    - All authenticated users can read it
    - Only service role can write to it

  4. Indexes
    - Index on food_name for efficient searching
*/

CREATE TABLE IF NOT EXISTS food_database (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  food_name text UNIQUE NOT NULL,
  calories integer NOT NULL CHECK (calories >= 0),
  protein integer NOT NULL CHECK (protein >= 0),
  carbs integer NOT NULL CHECK (carbs >= 0),
  fat integer NOT NULL CHECK (fat >= 0),
  serving_size text NOT NULL DEFAULT '100g',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE food_database ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read food database"
  ON food_database FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX idx_food_database_name ON food_database(food_name);

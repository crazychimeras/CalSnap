/*
  # Create Daily Summary Table

  1. New Tables
    - `daily_summaries`
      - `id` (uuid, primary key) - unique identifier
      - `user_id` (uuid, foreign key) - references auth.users.id
      - `date` (date) - the date for this summary
      - `total_calories` (integer) - sum of all meals that day
      - `total_protein` (integer) - sum of all protein that day
      - `total_carbs` (integer) - sum of all carbs that day
      - `total_fat` (integer) - sum of all fat that day
      - `meals_logged` (integer) - count of meals logged
      - `calories_remaining` (integer) - daily goal minus total
      - `created_at` (timestamp) - when summary was created
      - `updated_at` (timestamp) - when summary was last updated

  2. Purpose
    - Pre-calculated daily aggregates for fast dashboard queries
    - Reduces need to sum all meals on every page load
    - Enables efficient analytics and historical tracking
    - Populated/updated by database triggers

  3. Security
    - Enable RLS on table
    - Users can only read their own daily summaries
    - Auto-generated, so no insert/update/delete policies needed

  4. Indexes
    - Composite index on user_id + date for optimal daily lookups
*/

CREATE TABLE IF NOT EXISTS daily_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  total_calories integer NOT NULL DEFAULT 0 CHECK (total_calories >= 0),
  total_protein integer NOT NULL DEFAULT 0 CHECK (total_protein >= 0),
  total_carbs integer NOT NULL DEFAULT 0 CHECK (total_carbs >= 0),
  total_fat integer NOT NULL DEFAULT 0 CHECK (total_fat >= 0),
  meals_logged integer NOT NULL DEFAULT 0 CHECK (meals_logged >= 0),
  calories_remaining integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own daily summaries"
  ON daily_summaries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_daily_summaries_user_date ON daily_summaries(user_id, date DESC);

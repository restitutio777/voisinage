/*
  # Exchange Wishes Table for Barter System

  1. New Tables
    - `exchange_wishes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `offer_category_id` (uuid, references categories) - what user offers
      - `offer_description` (text) - description of what they offer
      - `seek_category_id` (uuid, references categories) - what user seeks
      - `seek_description` (text) - description of what they seek
      - `postal_code` (text) - location
      - `city` (text) - city name
      - `radius_km` (integer) - search radius
      - `is_active` (boolean) - whether wish is active
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `exchange_wishes` table
    - Active wishes are publicly readable
    - Users can only modify their own wishes

  3. Indexes
    - Index on postal_code for location-based matching
    - Index on offer_category_id and seek_category_id for matching algorithm
*/

CREATE TABLE IF NOT EXISTS exchange_wishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  offer_category_id uuid NOT NULL REFERENCES categories(id),
  offer_description text NOT NULL,
  seek_category_id uuid NOT NULL REFERENCES categories(id),
  seek_description text NOT NULL,
  postal_code text NOT NULL,
  city text,
  radius_km integer NOT NULL DEFAULT 10 CHECK (radius_km > 0 AND radius_km <= 100),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE exchange_wishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active exchange wishes are publicly readable"
  ON exchange_wishes
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Users can view own exchange wishes regardless of status"
  ON exchange_wishes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create exchange wishes"
  ON exchange_wishes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exchange wishes"
  ON exchange_wishes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own exchange wishes"
  ON exchange_wishes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_exchange_wishes_user ON exchange_wishes(user_id);
CREATE INDEX IF NOT EXISTS idx_exchange_wishes_postal_code ON exchange_wishes(postal_code);
CREATE INDEX IF NOT EXISTS idx_exchange_wishes_offer_category ON exchange_wishes(offer_category_id);
CREATE INDEX IF NOT EXISTS idx_exchange_wishes_seek_category ON exchange_wishes(seek_category_id);
CREATE INDEX IF NOT EXISTS idx_exchange_wishes_active ON exchange_wishes(is_active);
CREATE INDEX IF NOT EXISTS idx_exchange_wishes_created ON exchange_wishes(created_at DESC);

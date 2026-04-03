/*
  # Exchange Matches Table for Barter System (Fixed)

  1. New Tables
    - `exchange_matches`
      - `id` (uuid, primary key)
      - `wish_a_id` (uuid, references exchange_wishes) - first wish
      - `wish_b_id` (uuid, references exchange_wishes) - matching wish
      - `status` (text) - pending, contacted, completed, declined
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `exchange_matches` table
    - Users can only see matches involving their own wishes

  3. Uniqueness
    - Unique index on ordered wish pair to prevent duplicates
*/

CREATE TABLE IF NOT EXISTS exchange_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wish_a_id uuid NOT NULL REFERENCES exchange_wishes(id) ON DELETE CASCADE,
  wish_b_id uuid NOT NULL REFERENCES exchange_wishes(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'declined')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT exchange_matches_different_wishes CHECK (wish_a_id != wish_b_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_exchange_matches_unique_pair 
  ON exchange_matches (LEAST(wish_a_id, wish_b_id), GREATEST(wish_a_id, wish_b_id));

ALTER TABLE exchange_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view matches involving their wishes"
  ON exchange_matches
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM exchange_wishes
      WHERE (exchange_wishes.id = exchange_matches.wish_a_id OR exchange_wishes.id = exchange_matches.wish_b_id)
      AND exchange_wishes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update matches involving their wishes"
  ON exchange_matches
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM exchange_wishes
      WHERE (exchange_wishes.id = exchange_matches.wish_a_id OR exchange_wishes.id = exchange_matches.wish_b_id)
      AND exchange_wishes.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM exchange_wishes
      WHERE (exchange_wishes.id = exchange_matches.wish_a_id OR exchange_wishes.id = exchange_matches.wish_b_id)
      AND exchange_wishes.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_exchange_matches_wish_a ON exchange_matches(wish_a_id);
CREATE INDEX IF NOT EXISTS idx_exchange_matches_wish_b ON exchange_matches(wish_b_id);
CREATE INDEX IF NOT EXISTS idx_exchange_matches_status ON exchange_matches(status);
CREATE INDEX IF NOT EXISTS idx_exchange_matches_created ON exchange_matches(created_at DESC);

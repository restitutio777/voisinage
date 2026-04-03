/*
  # Listings Table for Garden Produce Offers

  1. New Tables
    - `listings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `category_id` (uuid, references categories)
      - `title` (text) - Product title/description
      - `description` (text) - Additional details
      - `quantity` (text) - Amount available (e.g., "2 kg", "une douzaine")
      - `listing_type` (text) - 'donner' (give), 'echanger' (trade), 'vendre' (sell)
      - `price` (numeric) - Price in euros (only for 'vendre' type)
      - `image_url` (text) - Main photo URL
      - `postal_code` (text) - Location postal code
      - `city` (text) - City name
      - `status` (text) - 'active', 'reserved', 'completed', 'expired'
      - `expires_at` (timestamp) - When the listing expires
      - `is_private_garden_confirmed` (boolean) - Legal confirmation
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `listings` table
    - Public can read active listings
    - Only authenticated users can create listings
    - Users can only update/delete their own listings

  3. Indexes
    - Index on postal_code for location-based searches
    - Index on category_id for filtering
    - Index on listing_type for filtering
    - Index on status for active listings
*/

CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id),
  title text NOT NULL,
  description text,
  quantity text,
  listing_type text NOT NULL CHECK (listing_type IN ('donner', 'echanger', 'vendre')),
  price numeric(10, 2),
  image_url text,
  postal_code text NOT NULL,
  city text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'reserved', 'completed', 'expired')),
  expires_at timestamptz,
  is_private_garden_confirmed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active listings are publicly readable"
  ON listings
  FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "Users can view own listings regardless of status"
  ON listings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create listings"
  ON listings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own listings"
  ON listings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own listings"
  ON listings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_listings_postal_code ON listings(postal_code);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(listing_type);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_user ON listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_created ON listings(created_at DESC);

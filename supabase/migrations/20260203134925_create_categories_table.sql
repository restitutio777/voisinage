/*
  # Categories Table for Product Types

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Category name in French
      - `icon` (text) - Icon identifier for the UI
      - `sort_order` (integer) - Display order
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `categories` table
    - Add policy for public read access (categories are public)

  3. Initial Data
    - Pre-populate with main categories: Fruits, Legumes, Oeufs, Herbes, Autre
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  icon text NOT NULL DEFAULT 'leaf',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are publicly readable"
  ON categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

INSERT INTO categories (name, icon, sort_order) VALUES
  ('Fruits', 'apple', 1),
  ('Legumes', 'carrot', 2),
  ('Oeufs', 'egg', 3),
  ('Herbes', 'leaf', 4),
  ('Autre', 'package', 5)
ON CONFLICT (name) DO NOTHING;

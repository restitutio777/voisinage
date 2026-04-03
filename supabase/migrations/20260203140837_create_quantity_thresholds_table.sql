/*
  # Quantity Thresholds for French Legal Compliance

  1. New Tables
    - `quantity_thresholds`
      - `id` (uuid, primary key)
      - `category_id` (uuid, references categories)
      - `unit` (text) - kg, pieces, bunch, dozen
      - `warning_threshold` (numeric) - Yellow warning threshold
      - `max_threshold` (numeric) - Red warning threshold
      - `warning_message_fr` (text) - French warning message
      - `legal_info_fr` (text) - Legal information in French
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `quantity_thresholds` table
    - Add policy for public read access

  3. Initial Data
    - Pre-populate with French legal thresholds based on:
      - Max 500m2 garden = 750-1000 kg/year total
      - Eggs: max 250 laying hens, declaration required
      - Typical yields per m2 for common vegetables

  Legal Sources:
    - agriculture.gouv.fr - Circuits courts regulations
    - French tax code for hobby gardening exemptions
*/

CREATE TABLE IF NOT EXISTS quantity_thresholds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  unit text NOT NULL DEFAULT 'kg',
  warning_threshold numeric NOT NULL DEFAULT 20,
  max_threshold numeric NOT NULL DEFAULT 50,
  warning_message_fr text NOT NULL DEFAULT 'Attention: cette quantite est inhabituelle pour un particulier',
  legal_info_fr text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quantity_thresholds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quantity thresholds are publicly readable"
  ON quantity_thresholds
  FOR SELECT
  TO anon, authenticated
  USING (true);

INSERT INTO quantity_thresholds (category_id, unit, warning_threshold, max_threshold, warning_message_fr, legal_info_fr)
SELECT 
  c.id,
  CASE c.name
    WHEN 'Oeufs' THEN 'pieces'
    WHEN 'Herbes' THEN 'botte'
    ELSE 'kg'
  END,
  CASE c.name
    WHEN 'Fruits' THEN 30
    WHEN 'Legumes' THEN 20
    WHEN 'Oeufs' THEN 30
    WHEN 'Herbes' THEN 15
    ELSE 20
  END,
  CASE c.name
    WHEN 'Fruits' THEN 100
    WHEN 'Legumes' THEN 50
    WHEN 'Oeufs' THEN 90
    WHEN 'Herbes' THEN 40
    ELSE 50
  END,
  CASE c.name
    WHEN 'Oeufs' THEN 'Attention: la vente d''oeufs est strictement reglementee. Une declaration a la DDCSPP est obligatoire.'
    ELSE 'Attention: cette quantite est inhabituelle pour un particulier'
  END,
  CASE c.name
    WHEN 'Oeufs' THEN 'Reglementation francaise: Max 250 pondeuses, vente directe uniquement dans un rayon de 80km, declaration DDCSPP obligatoire.'
    WHEN 'Fruits' THEN 'Production domestique: potager max 500m2 attenant a l''habitation. Rendement typique: 750-1000kg/an total.'
    WHEN 'Legumes' THEN 'Production domestique: potager max 500m2 attenant a l''habitation. Rendement typique: 750-1000kg/an total.'
    WHEN 'Herbes' THEN 'Production domestique: culture personnelle sans caractere commercial.'
    ELSE 'Production domestique: potager max 500m2 attenant a l''habitation.'
  END
FROM categories c
ON CONFLICT DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_quantity_thresholds_category ON quantity_thresholds(category_id);

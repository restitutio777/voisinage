/*
  # Reports Table for Listing Reports

  1. New Tables
    - `reports`
      - `id` (uuid, primary key)
      - `listing_id` (uuid, references listings)
      - `reporter_id` (uuid, references profiles)
      - `reason` (text) - predefined reasons
      - `details` (text) - optional additional details
      - `status` (text) - pending, reviewed, dismissed, action_taken
      - `created_at` (timestamp)
      - `reviewed_at` (timestamp)

  2. Security
    - Enable RLS on `reports` table
    - Authenticated users can create reports
    - Users can only view their own reports
    - Admins would need separate access (not implemented here)

  3. Report Reasons
    - professional: Suspected commercial seller
    - quantity_suspicious: Unusual quantity for private garden
    - inappropriate: Inappropriate content
    - fake: Fraudulent listing
    - spam: Spam or advertisement
    - other: Other reason
*/

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  reporter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason text NOT NULL CHECK (reason IN ('professional', 'quantity_suspicious', 'inappropriate', 'fake', 'spam', 'other')),
  details text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed', 'action_taken')),
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  UNIQUE(listing_id, reporter_id)
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can create reports"
  ON reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view own reports"
  ON reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id);

CREATE INDEX IF NOT EXISTS idx_reports_listing ON reports(listing_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created ON reports(created_at DESC);

/*
  # Analytics Events Table for Anonymous Statistics

  1. New Tables
    - `analytics_events`
      - `id` (uuid, primary key)
      - `event_type` (text) - Type of event
      - `event_data` (jsonb) - Event payload
      - `postal_code_prefix` (text) - Only first 2 digits for privacy
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `analytics_events` table
    - Anyone can insert events (anonymous tracking)
    - No read access for regular users (admin only via service role)

  3. Event Types
    - listing_created: category, type, has_image
    - listing_viewed: category
    - exchange_wish_created: offer_category, seek_category
    - exchange_match_found: categories
    - message_sent: (no content)
    - filter_used: filters
*/

CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  postal_code_prefix text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics events"
  ON analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_postal ON analytics_events(postal_code_prefix);

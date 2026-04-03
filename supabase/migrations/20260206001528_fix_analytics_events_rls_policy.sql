/*
  # Fix overly permissive analytics_events INSERT policy

  1. Changes
    - Drop the old "Anyone can insert analytics events" policy that used WITH CHECK (true)
    - Replace with a policy restricted to authenticated users only
    - Add a check that event_type is one of the known event types

  2. Security
    - Prevents anonymous users from inserting arbitrary analytics data
    - Validates event_type against allowed values
    - Reduces spam and abuse surface
*/

DROP POLICY IF EXISTS "Anyone can insert analytics events" ON analytics_events;

CREATE POLICY "Authenticated users can insert analytics events"
  ON analytics_events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    event_type IN (
      'listing_created',
      'listing_viewed',
      'exchange_wish_created',
      'exchange_match_found',
      'message_sent',
      'filter_used'
    )
  );

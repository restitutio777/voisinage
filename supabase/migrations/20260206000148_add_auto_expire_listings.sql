/*
  # Auto-expire old listings

  1. Changes
    - Create a PostgreSQL function `expire_old_listings` that marks listings 
      as 'expired' when their `expires_at` date has passed
    - Create a cron-like trigger using pg_cron extension (if available) or 
      a simple function that can be called periodically
    - Add index on expires_at for efficient expiry queries

  2. Notes
    - The function updates status from 'active' to 'expired' for past-due listings
    - This is safe to run repeatedly (idempotent)
    - Also filters expired listings from the main feed at the query level
*/

CREATE INDEX IF NOT EXISTS idx_listings_expires_at
  ON listings (expires_at)
  WHERE status = 'active';

CREATE OR REPLACE FUNCTION expire_old_listings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE listings
  SET status = 'expired'
  WHERE status = 'active'
    AND expires_at IS NOT NULL
    AND expires_at < now();
END;
$$;

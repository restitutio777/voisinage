-- Refresh sample listing expiry dates so they show up in the feed
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/iukghzywsxkabyikmtby/sql

UPDATE listings
SET expires_at = now() + interval '90 days',
    updated_at = now()
WHERE status = 'active'
  AND expires_at < now();

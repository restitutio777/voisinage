/*
  # Fix missing foreign key indexes and drop duplicate indexes

  1. New Indexes
    - `idx_messages_sender_id` on `messages(sender_id)` - Missing FK index
    - `idx_reports_reporter_id` on `reports(reporter_id)` - Missing FK index

  2. Dropped Indexes
    - `idx_listings_category_id` - Duplicate of `idx_listings_category`
    - `idx_listings_user_id` - Duplicate of `idx_listings_user`

  3. Notes
    - Foreign keys without indexes cause slow cascading deletes and joins
    - Duplicate indexes waste storage and slow down writes
*/

CREATE INDEX IF NOT EXISTS idx_messages_sender_id
  ON messages (sender_id);

CREATE INDEX IF NOT EXISTS idx_reports_reporter_id
  ON reports (reporter_id);

DROP INDEX IF EXISTS idx_listings_category_id;
DROP INDEX IF EXISTS idx_listings_user_id;

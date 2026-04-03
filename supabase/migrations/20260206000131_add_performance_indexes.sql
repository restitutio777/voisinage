/*
  # Add performance indexes

  1. Changes
    - Add index on `listings` for status + created_at (main listing feed query)
    - Add index on `listings` for postal_code prefix search
    - Add index on `listings` for category_id filtering
    - Add index on `listings` for user_id (profile page queries)
    - Add index on `messages` for conversation_id + created_at (conversation view)
    - Add index on `messages` for unread message counts
    - Add index on `conversations` for buyer/seller lookups
    - Add index on `exchange_wishes` for active wishes discovery
    - Add index on `analytics_events` for event_type queries

  2. Notes
    - All indexes use IF NOT EXISTS to be safely re-runnable
    - These target the most frequent query patterns in the application
*/

CREATE INDEX IF NOT EXISTS idx_listings_status_created
  ON listings (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_listings_postal_code
  ON listings (postal_code);

CREATE INDEX IF NOT EXISTS idx_listings_category_id
  ON listings (category_id);

CREATE INDEX IF NOT EXISTS idx_listings_user_id
  ON listings (user_id);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_created
  ON messages (conversation_id, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_messages_unread
  ON messages (conversation_id, is_read, sender_id);

CREATE INDEX IF NOT EXISTS idx_conversations_buyer
  ON conversations (buyer_id);

CREATE INDEX IF NOT EXISTS idx_conversations_seller
  ON conversations (seller_id);

CREATE INDEX IF NOT EXISTS idx_exchange_wishes_active
  ON exchange_wishes (is_active, user_id);

CREATE INDEX IF NOT EXISTS idx_analytics_events_type
  ON analytics_events (event_type);

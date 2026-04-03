/*
  # Optimize RLS policies to use (select auth.uid())

  All RLS policies that call auth.uid() are updated to use (select auth.uid())
  to prevent re-evaluation per row, which improves query performance at scale.

  1. Tables affected
    - profiles (2 policies: insert, update)
    - listings (4 policies: select own, insert, update, delete)
    - conversations (3 policies: select, insert, update)
    - messages (3 policies: select, insert, update)
    - reports (2 policies: insert, select)
    - exchange_wishes (4 policies: select own, insert, update, delete)
    - exchange_matches (2 policies: select, update)
    - push_subscriptions (3 policies: select, insert, delete)
    - notification_preferences (3 policies: select, insert, update)

  2. Security
    - No logic changes, only optimization of auth.uid() calls
    - All policies retain the same access patterns
*/

-- =====================
-- PROFILES
-- =====================

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- =====================
-- LISTINGS
-- =====================

DROP POLICY IF EXISTS "Users can view own listings regardless of status" ON listings;
CREATE POLICY "Users can view own listings regardless of status"
  ON listings
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Authenticated users can create listings" ON listings;
CREATE POLICY "Authenticated users can create listings"
  ON listings
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own listings" ON listings;
CREATE POLICY "Users can update own listings"
  ON listings
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own listings" ON listings;
CREATE POLICY "Users can delete own listings"
  ON listings
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- =====================
-- CONVERSATIONS
-- =====================

DROP POLICY IF EXISTS "Users can view own conversations" ON conversations;
CREATE POLICY "Users can view own conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = buyer_id OR (select auth.uid()) = seller_id);

DROP POLICY IF EXISTS "Authenticated users can create conversations" ON conversations;
CREATE POLICY "Authenticated users can create conversations"
  ON conversations
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = buyer_id);

DROP POLICY IF EXISTS "Participants can update conversation" ON conversations;
CREATE POLICY "Participants can update conversation"
  ON conversations
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = buyer_id OR (select auth.uid()) = seller_id)
  WITH CHECK ((select auth.uid()) = buyer_id OR (select auth.uid()) = seller_id);

-- =====================
-- MESSAGES
-- =====================

DROP POLICY IF EXISTS "Conversation participants can view messages" ON messages;
CREATE POLICY "Conversation participants can view messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.buyer_id = (select auth.uid()) OR conversations.seller_id = (select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Conversation participants can send messages" ON messages;
CREATE POLICY "Conversation participants can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.uid()) = sender_id
    AND EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_id
      AND (conversations.buyer_id = (select auth.uid()) OR conversations.seller_id = (select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Users can mark own received messages as read" ON messages;
CREATE POLICY "Users can mark own received messages as read"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.buyer_id = (select auth.uid()) OR conversations.seller_id = (select auth.uid()))
    )
    AND sender_id != (select auth.uid())
  )
  WITH CHECK (is_read = true);

-- =====================
-- REPORTS
-- =====================

DROP POLICY IF EXISTS "Authenticated users can create reports" ON reports;
CREATE POLICY "Authenticated users can create reports"
  ON reports
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = reporter_id);

DROP POLICY IF EXISTS "Users can view own reports" ON reports;
CREATE POLICY "Users can view own reports"
  ON reports
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = reporter_id);

-- =====================
-- EXCHANGE WISHES
-- =====================

DROP POLICY IF EXISTS "Users can view own exchange wishes regardless of status" ON exchange_wishes;
CREATE POLICY "Users can view own exchange wishes regardless of status"
  ON exchange_wishes
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Authenticated users can create exchange wishes" ON exchange_wishes;
CREATE POLICY "Authenticated users can create exchange wishes"
  ON exchange_wishes
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own exchange wishes" ON exchange_wishes;
CREATE POLICY "Users can update own exchange wishes"
  ON exchange_wishes
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own exchange wishes" ON exchange_wishes;
CREATE POLICY "Users can delete own exchange wishes"
  ON exchange_wishes
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- =====================
-- EXCHANGE MATCHES
-- =====================

DROP POLICY IF EXISTS "Users can view matches involving their wishes" ON exchange_matches;
CREATE POLICY "Users can view matches involving their wishes"
  ON exchange_matches
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM exchange_wishes
      WHERE (exchange_wishes.id = exchange_matches.wish_a_id OR exchange_wishes.id = exchange_matches.wish_b_id)
      AND exchange_wishes.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update matches involving their wishes" ON exchange_matches;
CREATE POLICY "Users can update matches involving their wishes"
  ON exchange_matches
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM exchange_wishes
      WHERE (exchange_wishes.id = exchange_matches.wish_a_id OR exchange_wishes.id = exchange_matches.wish_b_id)
      AND exchange_wishes.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM exchange_wishes
      WHERE (exchange_wishes.id = exchange_matches.wish_a_id OR exchange_wishes.id = exchange_matches.wish_b_id)
      AND exchange_wishes.user_id = (select auth.uid())
    )
  );

-- =====================
-- PUSH SUBSCRIPTIONS
-- =====================

DROP POLICY IF EXISTS "Users can view own push subscriptions" ON push_subscriptions;
CREATE POLICY "Users can view own push subscriptions"
  ON push_subscriptions
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create own push subscriptions" ON push_subscriptions;
CREATE POLICY "Users can create own push subscriptions"
  ON push_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own push subscriptions" ON push_subscriptions;
CREATE POLICY "Users can delete own push subscriptions"
  ON push_subscriptions
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- =====================
-- NOTIFICATION PREFERENCES
-- =====================

DROP POLICY IF EXISTS "Users can view own notification preferences" ON notification_preferences;
CREATE POLICY "Users can view own notification preferences"
  ON notification_preferences
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create own notification preferences" ON notification_preferences;
CREATE POLICY "Users can create own notification preferences"
  ON notification_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own notification preferences" ON notification_preferences;
CREATE POLICY "Users can update own notification preferences"
  ON notification_preferences
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

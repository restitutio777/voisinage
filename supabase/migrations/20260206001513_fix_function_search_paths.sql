/*
  # Fix mutable search_path on security definer functions

  1. Functions affected
    - `handle_new_user` - Triggered on new auth user creation
    - `update_conversation_last_message` - Triggered on new message
    - `expire_old_listings` - Called to expire stale listings

  2. Changes
    - Recreate each function with fully qualified table references (public.*)
    - Set search_path to empty string for security

  3. Security
    - Prevents search_path manipulation attacks on SECURITY DEFINER functions
    - All table references now use explicit public schema
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS trigger AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.expire_old_listings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.listings
  SET status = 'expired'
  WHERE status = 'active'
    AND expires_at IS NOT NULL
    AND expires_at < now();
END;
$$;

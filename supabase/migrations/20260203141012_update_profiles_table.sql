/*
  # Update Profiles Table with Community Features

  1. New Columns
    - `is_verified` (boolean) - Whether the user is verified
    - `verified_at` (timestamp) - When the user was verified
    - `bio` (text) - User biography (max 200 chars)
    - `garden_photo_url` (text) - Photo of user's garden
    - `pickup_info` (text) - Pickup instructions
    - `preferred_pickup_times` (text[]) - Array of preferred pickup times

  2. Verification Logic
    - Users are auto-verified when they have:
      - Email confirmed
      - Postal code set
      - At least 1 listing or 1 active exchange wish
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_verified'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_verified boolean NOT NULL DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'verified_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN verified_at timestamptz;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'bio'
  ) THEN
    ALTER TABLE profiles ADD COLUMN bio text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'garden_photo_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN garden_photo_url text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'pickup_info'
  ) THEN
    ALTER TABLE profiles ADD COLUMN pickup_info text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'preferred_pickup_times'
  ) THEN
    ALTER TABLE profiles ADD COLUMN preferred_pickup_times text[];
  END IF;
END $$;

/*
  # Enable PostGIS and Add Geographic Coordinates

  1. Extensions
    - Enable PostGIS extension for accurate geographic distance calculations

  2. Schema Changes
    - Add `latitude` and `longitude` columns to `listings` table
    - Add `latitude` and `longitude` columns to `profiles` table
    - Create spatial indexes for efficient distance queries

  3. Notes
    - Coordinates will be populated via French government geocoding API
    - Default search radius will be 25km
    - PostGIS ST_DWithin function will be used for distance queries
*/

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis SCHEMA extensions;

-- Add coordinate columns to listings table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE listings ADD COLUMN latitude double precision;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE listings ADD COLUMN longitude double precision;
  END IF;
END $$;

-- Add coordinate columns to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE profiles ADD COLUMN latitude double precision;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE profiles ADD COLUMN longitude double precision;
  END IF;
END $$;

-- Create indexes for coordinate-based queries
CREATE INDEX IF NOT EXISTS idx_listings_coordinates 
  ON listings (latitude, longitude) 
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_coordinates 
  ON profiles (latitude, longitude) 
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Create a function to calculate distance between two points in kilometers
CREATE OR REPLACE FUNCTION calculate_distance_km(
  lat1 double precision,
  lon1 double precision,
  lat2 double precision,
  lon2 double precision
)
RETURNS double precision
LANGUAGE sql
IMMUTABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT 
    CASE 
      WHEN lat1 IS NULL OR lon1 IS NULL OR lat2 IS NULL OR lon2 IS NULL THEN NULL
      ELSE (
        extensions.ST_Distance(
          extensions.ST_SetSRID(extensions.ST_MakePoint(lon1, lat1), 4326)::extensions.geography,
          extensions.ST_SetSRID(extensions.ST_MakePoint(lon2, lat2), 4326)::extensions.geography
        ) / 1000.0
      )
    END
$$;

-- Create a function to find listings within a radius
CREATE OR REPLACE FUNCTION find_listings_within_radius(
  user_lat double precision,
  user_lon double precision,
  radius_km double precision DEFAULT 25.0
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  category_id uuid,
  listing_type text,
  quantity text,
  price numeric,
  image_url text,
  postal_code text,
  city text,
  user_id uuid,
  status text,
  created_at timestamptz,
  updated_at timestamptz,
  expires_at timestamptz,
  latitude double precision,
  longitude double precision,
  distance_km double precision
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT 
    l.id,
    l.title,
    l.description,
    l.category_id,
    l.listing_type,
    l.quantity,
    l.price,
    l.image_url,
    l.postal_code,
    l.city,
    l.user_id,
    l.status,
    l.created_at,
    l.updated_at,
    l.expires_at,
    l.latitude,
    l.longitude,
    calculate_distance_km(user_lat, user_lon, l.latitude, l.longitude) as distance_km
  FROM listings l
  WHERE 
    l.status = 'active'
    AND l.latitude IS NOT NULL 
    AND l.longitude IS NOT NULL
    AND extensions.ST_DWithin(
      extensions.ST_SetSRID(extensions.ST_MakePoint(l.longitude, l.latitude), 4326)::extensions.geography,
      extensions.ST_SetSRID(extensions.ST_MakePoint(user_lon, user_lat), 4326)::extensions.geography,
      radius_km * 1000
    )
  ORDER BY distance_km ASC;
$$;
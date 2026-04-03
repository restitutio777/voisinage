/*
  # Add Sample Exchange Wishes

  Adds 3 exchange wishes demonstrating the matching system:
  - User 1 (Paris): Offers fruits, seeks legumes
  - User 2 (Lyon): Offers legumes, seeks fruits
  - User 5 (Nantes): Offers oeufs, seeks herbes

  Note: Users 1 and 2 are potential matches (complementary wishes)
*/

DO $$
DECLARE
  fruits_id uuid;
  legumes_id uuid;
  oeufs_id uuid;
  herbes_id uuid;
BEGIN
  SELECT id INTO fruits_id FROM categories WHERE name = 'Fruits';
  SELECT id INTO legumes_id FROM categories WHERE name = 'Legumes';
  SELECT id INTO oeufs_id FROM categories WHERE name = 'Oeufs';
  SELECT id INTO herbes_id FROM categories WHERE name = 'Herbes';

  INSERT INTO exchange_wishes (user_id, offer_category_id, offer_description, seek_category_id, seek_description, postal_code, city, radius_km, is_active)
  VALUES
    ('11111111-1111-1111-1111-111111111111', fruits_id, 'Pommes Golden et poires de mon jardin', legumes_id, 'Tomates anciennes ou courgettes', '75011', 'Paris', 20, true),
    ('22222222-2222-2222-2222-222222222222', legumes_id, 'Haricots verts et tomates du potager', fruits_id, 'Pommes ou poires pour compotes', '69003', 'Lyon', 15, true),
    ('55555555-5555-5555-5555-555555555555', oeufs_id, 'Oeufs frais de mes poules (6 ou 12)', herbes_id, 'Ciboulette, estragon ou autres herbes', '44000', 'Nantes', 25, true);
END $$;

/*
  # Add Sample Listings

  Adds sample listings for all 5 categories:
  - Fruits: 4 listings
  - Legumes: 5 listings
  - Oeufs: 3 listings
  - Herbes: 4 listings
  - Autre: 2 listings

  Total: 18 listings with varied types (donner, echanger, vendre)
*/

DO $$
DECLARE
  fruits_id uuid;
  legumes_id uuid;
  oeufs_id uuid;
  herbes_id uuid;
  autre_id uuid;
BEGIN
  SELECT id INTO fruits_id FROM categories WHERE name = 'Fruits';
  SELECT id INTO legumes_id FROM categories WHERE name = 'Legumes';
  SELECT id INTO oeufs_id FROM categories WHERE name = 'Oeufs';
  SELECT id INTO herbes_id FROM categories WHERE name = 'Herbes';
  SELECT id INTO autre_id FROM categories WHERE name = 'Autre';

  -- FRUITS LISTINGS
  INSERT INTO listings (user_id, category_id, title, description, quantity, listing_type, price, image_url, postal_code, city, status, is_private_garden_confirmed, expires_at)
  VALUES
    ('11111111-1111-1111-1111-111111111111', fruits_id, 'Pommes Golden du jardin', 'Pommes Golden cultivees sans pesticides dans mon jardin. Tres sucrees et croquantes, parfaites pour les tartes ou a croquer.', '3 kg', 'donner', NULL, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800', '75011', 'Paris', 'active', true, now() + interval '14 days'),
    ('22222222-2222-2222-2222-222222222222', fruits_id, 'Poires Williams', 'Poires Williams bien mures de mon verger. Ideales pour les confitures ou a deguster fraiches.', '2 kg', 'echanger', NULL, 'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=800', '69003', 'Lyon', 'active', true, now() + interval '10 days'),
    ('33333333-3333-3333-3333-333333333333', fruits_id, 'Figues fraiches', 'Figues violettes de mon figuier, tres sucrees. Recolte de cette semaine.', '1 kg', 'vendre', 4.50, 'https://images.unsplash.com/photo-1601379760883-1bb497c558e0?w=800', '13008', 'Marseille', 'active', true, now() + interval '7 days'),
    ('44444444-4444-4444-4444-444444444444', fruits_id, 'Raisin de table muscat', 'Raisin muscat blanc, grains bien sucres. Parfait pour les desserts ou en apero.', '1.5 kg', 'donner', NULL, 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800', '33000', 'Bordeaux', 'active', true, now() + interval '5 days');

  -- LEGUMES LISTINGS
  INSERT INTO listings (user_id, category_id, title, description, quantity, listing_type, price, image_url, postal_code, city, status, is_private_garden_confirmed, expires_at)
  VALUES
    ('55555555-5555-5555-5555-555555555555', legumes_id, 'Tomates cerises bio', 'Tomates cerises rouges et jaunes, cultivees en permaculture. Tres parfumees!', '500 g', 'donner', NULL, 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800', '44000', 'Nantes', 'active', true, now() + interval '7 days'),
    ('11111111-1111-1111-1111-111111111111', legumes_id, 'Courgettes du potager', 'Courgettes vertes de taille moyenne, fraiches du jour. Bio et sans traitement.', '2 kg', 'echanger', NULL, 'https://images.unsplash.com/photo-1563252722-6434563a985d?w=800', '75011', 'Paris', 'active', true, now() + interval '10 days'),
    ('22222222-2222-2222-2222-222222222222', legumes_id, 'Haricots verts extra-fins', 'Haricots verts cueillis ce matin, tres tendres. Parfaits pour une salade ou en accompagnement.', '800 g', 'vendre', 3.00, 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=800', '69003', 'Lyon', 'active', true, now() + interval '5 days'),
    ('33333333-3333-3333-3333-333333333333', legumes_id, 'Pommes de terre nouvelles', 'Pommes de terre Charlotte nouvelles, chair ferme. Ideales pour les salades ou rissolees.', '3 kg', 'donner', NULL, 'https://images.unsplash.com/photo-1518977676601-b53f82ber649?w=800', '13008', 'Marseille', 'active', true, now() + interval '14 days'),
    ('44444444-4444-4444-4444-444444444444', legumes_id, 'Carottes multicolores', 'Carottes orange, jaunes et violettes du jardin. Croquantes et sucrees, parfaites crues ou cuites.', '1.5 kg', 'echanger', NULL, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800', '33000', 'Bordeaux', 'active', true, now() + interval '12 days');

  -- OEUFS LISTINGS
  INSERT INTO listings (user_id, category_id, title, description, quantity, listing_type, price, image_url, postal_code, city, status, is_private_garden_confirmed, expires_at)
  VALUES
    ('55555555-5555-5555-5555-555555555555', oeufs_id, 'Oeufs frais de poules', 'Oeufs de mes poules elevees en plein air dans mon jardin. Nourriture bio, jaunes bien colores.', '12 oeufs', 'vendre', 4.00, 'https://images.unsplash.com/photo-1569288052389-dac9b0ac9eac?w=800', '44000', 'Nantes', 'active', true, now() + interval '7 days'),
    ('11111111-1111-1111-1111-111111111111', oeufs_id, 'Oeufs bio plein air', 'Oeufs frais de la semaine, poules nourries aux grains bio. Disponibles chaque semaine.', '6 oeufs', 'donner', NULL, 'https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?w=800', '75011', 'Paris', 'active', true, now() + interval '5 days'),
    ('22222222-2222-2222-2222-222222222222', oeufs_id, 'Oeufs de canes', 'Oeufs de canes coureurs indiens, plus gros que les oeufs de poule. Excellents en patisserie.', '6 oeufs', 'echanger', NULL, 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=800', '69003', 'Lyon', 'active', true, now() + interval '10 days');

  -- HERBES LISTINGS
  INSERT INTO listings (user_id, category_id, title, description, quantity, listing_type, price, image_url, postal_code, city, status, is_private_garden_confirmed, expires_at)
  VALUES
    ('33333333-3333-3333-3333-333333333333', herbes_id, 'Basilic grand vert', 'Bouquet de basilic frais, parfume et genereux. Ideal pour vos pestos et salades.', '1 bouquet', 'donner', NULL, 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=800', '13008', 'Marseille', 'active', true, now() + interval '5 days'),
    ('44444444-4444-4444-4444-444444444444', herbes_id, 'Menthe fraiche du jardin', 'Menthe verte tres parfumee, parfaite pour le the, les cocktails ou les salades de fruits.', '1 bouquet', 'donner', NULL, 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=800', '33000', 'Bordeaux', 'active', true, now() + interval '7 days'),
    ('55555555-5555-5555-5555-555555555555', herbes_id, 'Thym et romarin', 'Branches de thym et romarin sechees ou fraiches selon preference. Aromatiques du jardin.', '2 bouquets', 'echanger', NULL, 'https://images.unsplash.com/photo-1515586838455-8f8f940d6853?w=800', '44000', 'Nantes', 'active', true, now() + interval '14 days'),
    ('11111111-1111-1111-1111-111111111111', herbes_id, 'Persil plat italien', 'Persil plat frais, cultive sans pesticides. Gout intense pour vos plats.', '1 bouquet', 'vendre', 1.50, 'https://images.unsplash.com/photo-1536483636842-01d7b16f2f93?w=800', '75011', 'Paris', 'active', true, now() + interval '5 days');

  -- AUTRE LISTINGS
  INSERT INTO listings (user_id, category_id, title, description, quantity, listing_type, price, image_url, postal_code, city, status, is_private_garden_confirmed, expires_at)
  VALUES
    ('22222222-2222-2222-2222-222222222222', autre_id, 'Compost maison mature', 'Compost bien decompose, ideal pour enrichir vos plantations. Pret a utiliser.', '20 litres', 'donner', NULL, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800', '69003', 'Lyon', 'active', true, now() + interval '30 days'),
    ('33333333-3333-3333-3333-333333333333', autre_id, 'Plants de tomates cerises', 'Jeunes plants de tomates cerises prets a repiquer. Variete productive et resistante.', '6 plants', 'vendre', 6.00, 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800', '13008', 'Marseille', 'active', true, now() + interval '14 days');
END $$;

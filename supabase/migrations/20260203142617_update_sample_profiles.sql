/*
  # Update Sample User Profiles

  Updates profiles with usernames, cities and postal codes for the 5 test users.
*/

UPDATE profiles SET
  username = 'Marie D.',
  postal_code = '75011',
  city = 'Paris',
  is_private_garden = true
WHERE id = '11111111-1111-1111-1111-111111111111';

UPDATE profiles SET
  username = 'Jean M.',
  postal_code = '69003',
  city = 'Lyon',
  is_private_garden = true
WHERE id = '22222222-2222-2222-2222-222222222222';

UPDATE profiles SET
  username = 'Sophie B.',
  postal_code = '13008',
  city = 'Marseille',
  is_private_garden = true
WHERE id = '33333333-3333-3333-3333-333333333333';

UPDATE profiles SET
  username = 'Pierre L.',
  postal_code = '33000',
  city = 'Bordeaux',
  is_private_garden = true
WHERE id = '44444444-4444-4444-4444-444444444444';

UPDATE profiles SET
  username = 'Claire M.',
  postal_code = '44000',
  city = 'Nantes',
  is_private_garden = true
WHERE id = '55555555-5555-5555-5555-555555555555';

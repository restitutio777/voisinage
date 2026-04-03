/*
  # Add Sample Test Users

  Creates 5 test users in auth.users table and updates their profiles.
*/

INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'marie.dupont@demo.fr', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
  ('22222222-2222-2222-2222-222222222222', 'jean.martin@demo.fr', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
  ('33333333-3333-3333-3333-333333333333', 'sophie.bernard@demo.fr', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
  ('44444444-4444-4444-4444-444444444444', 'pierre.leroy@demo.fr', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
  ('55555555-5555-5555-5555-555555555555', 'claire.moreau@demo.fr', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

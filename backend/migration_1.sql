-- Production migration: profile headline and portfolio category
ALTER TABLE IF EXISTS public.users
  ADD COLUMN IF NOT EXISTS headline TEXT;

ALTER TABLE IF EXISTS public.portfolios
  ADD COLUMN IF NOT EXISTS category TEXT;

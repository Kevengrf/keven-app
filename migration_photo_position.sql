-- Add photo_position column to profile table for the default Maker persona
-- This allows adjusting the object-position CSS property (e.g. 'center', 'top', 'bottom')

alter table public.profile
add column if not exists photo_position text default 'center';

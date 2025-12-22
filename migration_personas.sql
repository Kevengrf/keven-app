-- 1. Update 'profile' table to store persona-specific data
-- We will store specific overrides in a JSONB column.
-- Key = persona name ('hacker', 'hipster', 'hustler', 'maker')
-- Value = { hero_title, hero_subtitle, hero_description, about_text, skills, photo_url }
alter table public.profile
add column if not exists personas jsonb default '{}'::jsonb;

-- 2. Update 'projects' table to tag projects with personas
-- A project can belong to multiple personas.
-- If null or empty, it might be visible to all (or we handle logic in frontend).
alter table public.projects
add column if not exists personas text[] default '{maker,hacker,hipster,hustler}';

-- 3. Update 'gallery_posts' table (optional, but good for consistency)
alter table public.gallery_posts
add column if not exists personas text[] default '{maker,hacker,hipster,hustler}';

-- 4. Create an index for faster filtering by persona on projects
create index if not exists projects_personas_idx on public.projects using gin (personas);

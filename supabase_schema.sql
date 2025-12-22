-- Enable Storage Extension (if not already enabled)
-- CREATE EXTENSION IF NOT EXISTS "storage";

-- 1. Create the Storage Bucket 'portfolio-assets'
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

-- 2. Storage Policies for 'portfolio-assets'

-- Allow public access to view files
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'portfolio-assets' );

-- Allow authenticated users to upload files
create policy "Authenticated Upload"
  on storage.objects for insert
  with check ( bucket_id = 'portfolio-assets' and auth.role() = 'authenticated' );

-- Allow authenticated users to update files
create policy "Authenticated Update"
  on storage.objects for update
  using ( bucket_id = 'portfolio-assets' and auth.role() = 'authenticated' );

-- Allow authenticated users to delete files
create policy "Authenticated Delete"
  on storage.objects for delete
  using ( bucket_id = 'portfolio-assets' and auth.role() = 'authenticated' );

-- 3. Create 'gallery_posts' table
create table if not exists public.gallery_posts (
  id uuid not null default gen_random_uuid(),
  title text,
  description text not null, -- "descricao visivel" requested by user
  image_url text not null,
  created_at timestamptz default now(),
  constraint gallery_posts_pkey primary key (id)
);

-- 4. Enable RLS on 'gallery_posts'
alter table public.gallery_posts enable row level security;

-- 5. RLS Policies for 'gallery_posts'

-- Allow public read access
create policy "Enable read access for all users"
  on public.gallery_posts for select
  using ( true );

-- Allow authenticated insert
create policy "Enable insert for authenticated users only"
  on public.gallery_posts for insert
  with check ( auth.role() = 'authenticated' );

-- Allow authenticated update
create policy "Enable update for authenticated users only"
  on public.gallery_posts for update
  using ( auth.role() = 'authenticated' );

-- Allow authenticated delete
create policy "Enable delete for authenticated users only"
  on public.gallery_posts for delete
  using ( auth.role() = 'authenticated' );

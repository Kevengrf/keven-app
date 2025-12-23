-- Create Sponsors Table
create table if not exists public.sponsors (
    id uuid default gen_random_uuid() primary key,
    name text,
    logo_url text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.sponsors enable row level security;

-- Policies
create policy "Public can view sponsors"
on public.sponsors for select
to public
using (true);

create policy "Authenticated users can insert sponsors"
on public.sponsors for insert
to authenticated
with check (true);

create policy "Authenticated users can update sponsors"
on public.sponsors for update
to authenticated
using (true);

create policy "Authenticated users can delete sponsors"
on public.sponsors for delete
to authenticated
using (true);

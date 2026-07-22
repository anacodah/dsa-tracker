create table public.roadmap_phases (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  week_number   integer not null,
  title         text not null,
  topics        text[] not null,
  target        integer not null,
  created_at    timestamptz default now()
);

alter table public.roadmap_phases enable row level security;
create policy "Users access own roadmap" on public.roadmap_phases for all using (auth.uid() = user_id);

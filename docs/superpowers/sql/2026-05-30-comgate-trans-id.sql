-- Manual migration — run in the Supabase SQL editor for the shared project.
-- The registrations table is owned/managed by weeks-hub; this only adds a column.
alter table public.registrations
  add column if not exists comgate_trans_id text;

create index if not exists registrations_comgate_trans_id_idx
  on public.registrations (comgate_trans_id);

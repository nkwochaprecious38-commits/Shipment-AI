-- RESET AND INSTALL. Drops everything in the public schema (old tables, functions, triggers), then installs the Shipment AI schema.
-- Auth users are kept, except QA test accounts (qa.*@example.com) which are removed.
drop policy if exists docs_read on storage.objects;
drop policy if exists docs_write on storage.objects;
drop policy if exists docs_delete on storage.objects;
delete from auth.users where email like 'qa.%@example.com';
drop schema public cascade;
create schema public;
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on schema public to postgres, service_role;
alter default privileges in schema public grant all on tables to postgres, service_role;
alter default privileges in schema public grant all on functions to postgres, service_role;

-- Shipment AI database schema. Run in the Supabase SQL editor (once).
create extension if not exists pgcrypto;

create table organizations (id uuid primary key default gen_random_uuid(), name text not null, created_at timestamptz default now());
create table profiles (id uuid primary key references auth.users on delete cascade, email text, full_name text, prefs jsonb default '{}', created_at timestamptz default now());
create table memberships (id uuid primary key default gen_random_uuid(), org_id uuid not null references organizations on delete cascade, user_id uuid not null references profiles on delete cascade,
  role text not null default 'member' check (role in ('admin','member','viewer')), created_at timestamptz default now(), unique (org_id, user_id));

-- Helper functions (security definer so policies never recurse)
create function is_member(o uuid) returns boolean language sql security definer stable set search_path = public as
$$ select exists (select 1 from memberships where org_id = o and user_id = auth.uid()) $$;
create function is_admin(o uuid) returns boolean language sql security definer stable set search_path = public as
$$ select exists (select 1 from memberships where org_id = o and user_id = auth.uid() and role = 'admin') $$;
create function can_write(o uuid) returns boolean language sql security definer stable set search_path = public as
$$ select exists (select 1 from memberships where org_id = o and user_id = auth.uid() and role in ('admin','member')) $$;

-- Organization scoped tables
create table customers (id uuid primary key default gen_random_uuid(), org_id uuid not null references organizations on delete cascade, created_at timestamptz default now(), is_demo boolean default false,
  name text not null, contact text, email text, portal_enabled boolean default true);
create table carriers (id uuid primary key default gen_random_uuid(), org_id uuid not null references organizations on delete cascade, created_at timestamptz default now(), is_demo boolean default false,
  name text not null, mode text, contact text, tracking_status text default 'Not connected');
create table shipments (id uuid primary key default gen_random_uuid(), org_id uuid not null references organizations on delete cascade, created_at timestamptz default now(), is_demo boolean default false,
  reference text not null, order_number text, customer text, carrier text, mode text default 'Road', origin text not null, destination text not null,
  origin_lat double precision, origin_lng double precision, dest_lat double precision, dest_lng double precision, current_lat double precision, current_lng double precision,
  status text default 'Pending pickup', priority text default 'Medium', eta timestamptz, original_eta timestamptz, last_update timestamptz default now(),
  tracking_token text not null unique default encode(gen_random_bytes(12), 'hex'));
create table shipment_stops (id uuid primary key default gen_random_uuid(), org_id uuid not null references organizations on delete cascade, created_at timestamptz default now(), is_demo boolean default false,
  shipment_id uuid references shipments on delete cascade, seq int, name text, kind text, planned_at timestamptz);
create table shipment_events (id uuid primary key default gen_random_uuid(), org_id uuid not null references organizations on delete cascade, created_at timestamptz default now(), is_demo boolean default false,
  shipment_id uuid references shipments on delete cascade, description text, event_time timestamptz default now());
create table shipment_milestones (id uuid primary key default gen_random_uuid(), org_id uuid not null references organizations on delete cascade, created_at timestamptz default now(), is_demo boolean default false,
  shipment_id uuid references shipments on delete cascade, name text, completed_at timestamptz);
create table tracking_updates (id uuid primary key default gen_random_uuid(), org_id uuid not null references organizations on delete cascade, created_at timestamptz default now(), is_demo boolean default false,
  shipment_id uuid references shipments on delete cascade, lat double precision, lng double precision, source text, recorded_at timestamptz default now());
create table orders (id uuid primary key default gen_random_uuid(), org_id uuid not null references organizations on delete cascade, created_at timestamptz default now(), is_demo boolean default false,
  order_number text not null, customer text, shipment_reference text, value numeric, status text default 'Processing');
create table appointments (id uuid primary key default gen_random_uuid(), org_id uuid not null references organizations on delete cascade, created_at timestamptz default now(), is_demo boolean default false,
  facility text not null, shipment_reference text, carrier text, starts_at timestamptz, "window" text default '2 hours', status text default 'Scheduled', arrival_time timestamptz);
create table documents (id uuid primary key default gen_random_uuid(), org_id uuid not null references organizations on delete cascade, created_at timestamptz default now(), is_demo boolean default false,
  name text, doc_type text, shipment_reference text, access text default 'Team', file_path text);
create table exceptions (id uuid primary key default gen_random_uuid(), org_id uuid not null references organizations on delete cascade, created_at timestamptz default now(), is_demo boolean default false,
  shipment_reference text, type text, severity text default 'Medium', status text default 'Open', assignee text, recommended_action text, detected_at timestamptz default now());
create table notifications (id uuid primary key default gen_random_uuid(), org_id uuid not null references organizations on delete cascade, created_at timestamptz default now(), is_demo boolean default false,
  user_id uuid, title text, body text, read boolean default false);
create table integrations (id uuid primary key default gen_random_uuid(), org_id uuid not null references organizations on delete cascade, created_at timestamptz default now(), is_demo boolean default false,
  name text, kind text, status text, config jsonb default '{}');
create table reports (id uuid primary key default gen_random_uuid(), org_id uuid not null references organizations on delete cascade, created_at timestamptz default now(), is_demo boolean default false,
  name text, config jsonb default '{}');
create table audit_logs (id uuid primary key default gen_random_uuid(), org_id uuid not null references organizations on delete cascade, created_at timestamptz default now(),
  user_id uuid, action text, detail text);
create table invites (id uuid primary key default gen_random_uuid(), org_id uuid not null references organizations on delete cascade, created_at timestamptz default now(),
  email text not null, role text default 'member');

-- Row level security: every row is isolated by organization
alter table organizations enable row level security;
alter table profiles enable row level security;
alter table memberships enable row level security;
create policy org_read on organizations for select using (is_member(id));
create policy org_update on organizations for update using (is_admin(id));
create policy prof_read on profiles for select using (id = auth.uid() or exists (select 1 from memberships a join memberships b on a.org_id = b.org_id where a.user_id = auth.uid() and b.user_id = profiles.id));
create policy prof_update on profiles for update using (id = auth.uid());
create policy mem_read on memberships for select using (is_member(org_id));
create policy mem_update on memberships for update using (is_admin(org_id));

do $$ declare t text; begin
  foreach t in array array['customers','carriers','shipments','shipment_stops','shipment_events','shipment_milestones','tracking_updates','orders','appointments','documents','exceptions','notifications','integrations','reports','audit_logs','invites']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy %I on %I for select using (is_member(org_id))', t || '_sel', t);
    execute format('create policy %I on %I for insert with check (can_write(org_id))', t || '_ins', t);
    if t <> 'audit_logs' then
      execute format('create policy %I on %I for update using (can_write(org_id)) with check (can_write(org_id))', t || '_upd', t);
      execute format('create policy %I on %I for delete using (can_write(org_id))', t || '_del', t);
    end if;
  end loop;
end $$;

-- New user: create profile, then join an invited organization or create a new one
create function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
declare inv invites; new_org uuid;
begin
  insert into profiles (id, email, full_name) values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  select * into inv from invites where lower(email) = lower(new.email) order by created_at limit 1;
  if found then
    insert into memberships (org_id, user_id, role) values (inv.org_id, new.id, inv.role);
    delete from invites where id = inv.id;
  else
    insert into organizations (name) values (coalesce(nullif(new.raw_user_meta_data->>'company', ''), 'My Organization')) returning id into new_org;
    insert into memberships (org_id, user_id, role) values (new_org, new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

-- Log shipment status changes as tracking events
create function log_shipment_event() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    insert into shipment_events (org_id, shipment_id, description) values (new.org_id, new.id, 'Status: ' || new.status);
  end if;
  return new;
end $$;
create trigger shipment_event_log after insert or update on shipments for each row execute function log_shipment_event();

-- Public customer tracking page: returns only non sensitive fields for one token
create function get_tracking(p_token text) returns json language sql security definer stable set search_path = public as $$
  select json_build_object('reference', s.reference, 'status', s.status, 'origin', s.origin, 'destination', s.destination, 'eta', s.eta, 'original_eta', s.original_eta,
    'carrier', s.carrier, 'mode', s.mode, 'last_update', s.last_update, 'org_name', o.name,
    'events', coalesce((select json_agg(json_build_object('description', e.description, 'event_time', e.event_time) order by e.event_time desc) from shipment_events e where e.shipment_id = s.id), '[]'::json))
  from shipments s join organizations o on o.id = s.org_id where s.tracking_token = p_token
$$;
grant execute on function get_tracking(text) to anon, authenticated;

-- Private document storage, folder per organization
insert into storage.buckets (id, name, public) values ('documents', 'documents', false) on conflict do nothing;
create policy docs_read on storage.objects for select using (bucket_id = 'documents' and is_member(((storage.foldername(name))[1])::uuid));
create policy docs_write on storage.objects for insert with check (bucket_id = 'documents' and can_write(((storage.foldername(name))[1])::uuid));
create policy docs_delete on storage.objects for delete using (bucket_id = 'documents' and can_write(((storage.foldername(name))[1])::uuid));

-- Table privileges (newer Supabase projects do not grant these automatically). RLS still restricts every row.
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant execute on all functions in schema public to authenticated;
revoke all on all tables in schema public from anon;
grant execute on function get_tracking(text) to anon;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;

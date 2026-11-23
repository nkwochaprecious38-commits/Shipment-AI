-- Table privileges (newer Supabase projects do not grant these automatically). RLS still restricts every row.
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant execute on all functions in schema public to authenticated;
revoke all on all tables in schema public from anon;
grant execute on function get_tracking(text) to anon;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;

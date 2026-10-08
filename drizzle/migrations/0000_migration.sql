create type public.app_role as enum ('admin', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

-- First account ever created becomes the admin
create or replace function public.assign_first_admin()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_admin after insert on auth.users
for each row execute function public.assign_first_admin();

create table public.ads (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null check (char_length(title) between 3 and 120),
  category text not null check (category in ('Rentals','Jobs','Car Hire')),
  price text not null check (char_length(price) <= 60),
  location text not null check (char_length(location) <= 100),
  phone text not null check (char_length(phone) between 9 and 20),
  description text not null check (char_length(description) <= 2000),
  plan text not null default 'free' check (plan in ('free','extended','featured')),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  payment_status text not null default 'none' check (payment_status in ('none','pending','paid')),
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  approved_at timestamptz
);
grant insert on public.ads to anon, authenticated;
grant select on public.ads to anon;
grant select, update, delete on public.ads to authenticated;
grant all on public.ads to service_role;
alter table public.ads enable row level security;

create policy "Anyone can submit a pending ad" on public.ads for insert to anon, authenticated
with check (status = 'pending' and verified = false and approved_at is null
  and payment_status = case when plan = 'free' then 'none' else 'pending' end);
create policy "Public sees approved ads" on public.ads for select to anon, authenticated
using (status = 'approved');
create policy "Admins see all ads" on public.ads for select to authenticated
using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update ads" on public.ads for update to authenticated
using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete ads" on public.ads for delete to authenticated
using (public.has_role(auth.uid(), 'admin'));
-- Create enum for user roles
create type public.app_role as enum ('student', 'staff', 'admin');

-- Create enum for complaint status
create type public.complaint_status as enum ('new', 'in_progress', 'resolved');

-- Create enum for complaint category
create type public.complaint_category as enum (
  'Mentor Unresponsive',
  'Doubt Not Cleared',
  'Project Feedback Delay',
  'Platform Bug',
  'Other'
);

-- Create profiles table for basic user information
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Create user_roles table (separate for security)
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamp with time zone default now() not null,
  unique (user_id, role)
);

-- Create complaints table
create table public.complaints (
  id uuid primary key default gen_random_uuid(),
  ticket_id text unique not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  student_name text,
  title text not null,
  category complaint_category not null,
  description text not null,
  status complaint_status default 'new' not null,
  screenshot_url text,
  is_anonymous boolean default false not null,
  expected_resolution_time timestamp with time zone,
  resolution_note text,
  internal_notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.complaints enable row level security;

-- Create security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- RLS Policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- RLS Policies for user_roles
create policy "Users can view their own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

create policy "Admins can view all roles"
  on public.user_roles for select
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can insert roles"
  on public.user_roles for insert
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update roles"
  on public.user_roles for update
  using (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for complaints
create policy "Students can view their own complaints"
  on public.complaints for select
  using (
    auth.uid() = user_id
    or public.has_role(auth.uid(), 'staff')
    or public.has_role(auth.uid(), 'admin')
  );

create policy "Students can insert their own complaints"
  on public.complaints for insert
  with check (
    auth.uid() = user_id
    and public.has_role(auth.uid(), 'student')
  );

create policy "Staff and admins can update complaints"
  on public.complaints for update
  using (
    public.has_role(auth.uid(), 'staff')
    or public.has_role(auth.uid(), 'admin')
  );

-- Create function to generate unique ticket ID
create or replace function public.generate_ticket_id()
returns text
language plpgsql
as $$
declare
  new_ticket_id text;
begin
  new_ticket_id := 'BRO-' || upper(substring(md5(random()::text) from 1 for 4));
  return new_ticket_id;
end;
$$;

-- Create trigger to auto-generate ticket ID
create or replace function public.set_ticket_id()
returns trigger
language plpgsql
as $$
begin
  if new.ticket_id is null then
    new.ticket_id := public.generate_ticket_id();
  end if;
  return new;
end;
$$;

create trigger complaints_ticket_id_trigger
  before insert on public.complaints
  for each row
  execute function public.set_ticket_id();

-- Create trigger for updated_at on profiles
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at_trigger
  before update on public.profiles
  for each row
  execute function public.update_updated_at();

create trigger complaints_updated_at_trigger
  before update on public.complaints
  for each row
  execute function public.update_updated_at();

-- Create indexes for better performance
create index idx_user_roles_user_id on public.user_roles(user_id);
create index idx_complaints_user_id on public.complaints(user_id);
create index idx_complaints_status on public.complaints(status);
create index idx_complaints_created_at on public.complaints(created_at desc);
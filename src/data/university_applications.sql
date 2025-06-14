-- University Application Tracker Table
create table if not exists university_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  university_name text not null,
  study_level text not null,
  status text not null,
  application_deadline date,
  submission_date date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_university_applications_user_id on university_applications(user_id);

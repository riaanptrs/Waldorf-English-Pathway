-- Grade 7 Unit 6: activity catalogue and learner-owned objective responses.
-- Canonical correct answers remain in original lesson content; this table records
-- a learner's checked response and result for progress/review purposes.

alter table public.course_activities
  drop constraint if exists course_activities_unit_number_check;

alter table public.course_activities
  add constraint course_activities_unit_number_check
  check (unit_number >= 1 and unit_number <= 6);

insert into public.course_activities (activity_key, unit_number, unit_position, title, path, is_portfolio, is_active)
values
  ('g7-u6-l01', 6, 1, 'Seeing Carefully', 'lesson-evidence-discovery.html#seeing-carefully', false, true),
  ('g7-u6-l02', 6, 2, 'Fact, Interpretation, or Exaggeration?', 'lesson-evidence-discovery.html#fact-claim', false, true),
  ('g7-u6-l03', 6, 3, 'From Notes to a Clear Summary', 'lesson-evidence-discovery.html#summary', true, true),
  ('g7-u6-l04', 6, 4, 'How a Discovery Changed Ideas', 'lesson-evidence-discovery.html#discovery', true, true),
  ('g7-u6-l05', 6, 5, 'Experiment in Words', 'lesson-evidence-discovery.html#experiment', true, true),
  ('g7-u6-l06', 6, 6, 'A Person in Their Time', 'lesson-evidence-discovery.html#person-time', true, true),
  ('g7-u6-l07', 6, 7, 'Wish, Wonder, Surprise: Facts and Voice', 'lesson-evidence-discovery.html#wish-wonder-surprise', true, true),
  ('g7-u6-l08', 6, 8, 'Mini Research Project', 'lesson-evidence-discovery.html#research', true, true)
on conflict (activity_key) do update
set unit_number = excluded.unit_number,
    unit_position = excluded.unit_position,
    title = excluded.title,
    path = excluded.path,
    is_portfolio = excluded.is_portfolio,
    is_active = excluded.is_active;

create table if not exists public.objective_responses (
  learner_id uuid not null references public.learners(id) on delete cascade,
  activity_key text not null references public.course_activities(activity_key) on delete cascade,
  question_key text not null check (char_length(trim(question_key)) between 1 and 120),
  selected_answer text not null check (char_length(selected_answer) <= 2000),
  is_correct boolean not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (learner_id, activity_key, question_key)
);

create index if not exists objective_responses_learner_activity_idx
  on public.objective_responses (learner_id, activity_key);

alter table public.objective_responses enable row level security;

-- This is a learner-facing table. Grant only the operations the browser uses;
-- the owner checks in the policies below decide which rows are accessible.
grant select, insert, update on table public.objective_responses to authenticated;

drop policy if exists "guardians read own objective responses" on public.objective_responses;
create policy "guardians read own objective responses"
  on public.objective_responses for select to authenticated
  using (exists (
    select 1 from public.learners l
    where l.id = objective_responses.learner_id
      and l.guardian_user_id = (select auth.uid())
  ));

drop policy if exists "guardians insert own objective responses" on public.objective_responses;
create policy "guardians insert own objective responses"
  on public.objective_responses for insert to authenticated
  with check (exists (
    select 1 from public.learners l
    where l.id = objective_responses.learner_id
      and l.guardian_user_id = (select auth.uid())
  ));

drop policy if exists "guardians update own objective responses" on public.objective_responses;
create policy "guardians update own objective responses"
  on public.objective_responses for update to authenticated
  using (exists (
    select 1 from public.learners l
    where l.id = objective_responses.learner_id
      and l.guardian_user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.learners l
    where l.id = objective_responses.learner_id
      and l.guardian_user_id = (select auth.uid())
  ));

-- The portfolio schema already has the unique key used by the draft upsert.
-- Keep that canonical index and remove redundant indexes from the first Unit 6 pass.
drop index if exists public.portfolio_entries_one_current_entry_per_type;
drop index if exists public.objective_responses_activity_key_idx;

-- Sted conversational funnel (/start and the landing modal): append-only events table.
-- For the backend owner to review and apply. NOT applied by the web repo.
-- Once applied, set VITE_FUNNEL_EVENTS_TABLE=funnel_events for the site build to start sending.
--
-- Security model (same as public.waitlist): the browser uses the publishable key, so the anon
-- role may INSERT only. There are no SELECT/UPDATE/DELETE policies, so nothing can be read back
-- or changed from the web. Rows hold no personal data: a random per-tab session id, quiz answers
-- and UTM tags. Column checks cap sizes and allowed values to limit junk inserts.

create table if not exists public.funnel_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  session_id uuid not null,
  event text not null check (event in (
    'funnel_started', 'step_viewed', 'persona_selected', 'sources_selected', 'storage_selected', 'purpose_selected',
    'need_selected', 'example_selected', 'result_viewed', 'plan_clicked', 'funnel_closed'
  )),
  step smallint not null check (step between 0 and 20),
  persona text check (persona in ('developer', 'creator', 'founder', 'student', 'designer', 'other')),
  sources text[] not null default '{}' check (
    cardinality(sources) <= 10
    and sources <@ array['instagram', 'tiktok', 'youtube', 'x', 'linkedin', 'reddit', 'pinterest', 'spotify', 'websites', 'everywhere']::text[]
  ),
  storage text[] not null default '{}' check (
    cardinality(storage) <= 8
    and storage <@ array['notes', 'messages', 'bookmarks', 'tabs', 'screenshots', 'in_app', 'docs', 'nowhere']::text[]
  ),
  purposes text[] not null default '{}' check (
    cardinality(purposes) <= 5
    and purposes <@ array['work', 'learning', 'content', 'personal', 'everything']::text[]
  ),
  need text check (need in ('find', 'remember', 'keypoints')),
  example text check (char_length(example) <= 64),
  utm_source text check (char_length(utm_source) <= 120),
  utm_medium text check (char_length(utm_medium) <= 120),
  utm_campaign text check (char_length(utm_campaign) <= 120),
  utm_content text check (char_length(utm_content) <= 120),
  utm_term text check (char_length(utm_term) <= 120),
  path text not null check (char_length(path) <= 200)
);

create index if not exists funnel_events_created_at_idx on public.funnel_events (created_at);
create index if not exists funnel_events_session_idx on public.funnel_events (session_id);

alter table public.funnel_events enable row level security;

revoke all on public.funnel_events from anon, authenticated;
grant insert on public.funnel_events to anon, authenticated;

drop policy if exists "web can append funnel events" on public.funnel_events;
create policy "web can append funnel events"
  on public.funnel_events
  for insert
  to anon, authenticated
  with check (true);

-- Example read for the team (service role / SQL editor only): drop-off by step.
-- select step, event, count(distinct session_id)
-- from public.funnel_events
-- where created_at > now() - interval '7 days'
-- group by 1, 2 order by 1, 2;

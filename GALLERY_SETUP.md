# Photo gallery – upload, remove, update (no code after deploy)

The gallery can be managed from the app once Supabase is set up: **upload**, **remove**, and **update** photos and sections without touching code.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free account / project.
2. In the dashboard: **Project Settings** → **API** → copy:
   - **Project URL** → use as `VITE_SUPABASE_URL`
   - **anon public** key → use as `VITE_SUPABASE_ANON_KEY`

## 2. Environment variables

Copy `.env.example` to `.env` and set:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

For production (e.g. Vercel/Netlify), add the same variables in the host’s environment settings.

## 3. Database table

In Supabase: **SQL Editor** → run:

```sql
create table if not exists gallery_entries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  sort_order int not null default 0,
  photos jsonb not null default '[]'::jsonb
);

-- Allow read/write for anon (so the app can manage gallery without auth).
-- For production you may want to restrict this (e.g. add auth).
alter table gallery_entries enable row level security;

create policy "Allow all for gallery_entries"
  on gallery_entries for all
  using (true)
  with check (true);
```

## 4. Storage bucket

1. In Supabase: **Storage** → **New bucket**.
2. Name: `gallery`.
3. Make it **Public** (so photo URLs work).
4. Create the bucket, then go to **Policies** for `gallery` and add:
   - **Policy name:** Allow public read and upload  
   - **Allowed operations:** SELECT (read), INSERT (upload), DELETE  
   - **Target roles:** All  
   - **Policy definition:** `true` for USING and WITH CHECK (or define stricter rules if you add auth later).

## 5. Use the app

1. Run the app (`npm run dev`).
2. Open **Gallery** → click **Manage gallery**.
3. You can:
   - **Add section** – new timeline section with a title.
   - **Edit title** – change a section title.
   - **Upload photo** – pick an image and optional caption.
   - **Update caption** – edit the caption (alt text) of a photo.
   - **Remove photo** – delete a photo from a section.
   - **Delete section** – remove a section and all its photos.

Without Supabase configured, the gallery still works using the default timeline in `Gallery.jsx`.

---

## Message board (permanent messages)

To save message board posts permanently (so they persist after refresh and on any device), create the `messages` table in Supabase.

In **SQL Editor**, run:

```sql
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  body text not null,
  created_at timestamptz not null default now()
);

alter table messages enable row level security;

create policy "Allow all for messages"
  on messages for all
  using (true)
  with check (true);
```

After this, messages posted on the Message Board are stored in Supabase and stay after refresh. Without this table (or without Supabase), the app falls back to saving messages in the browser (localStorage) only.

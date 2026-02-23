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

## 3. Database table and policies

**How to run this in Supabase**

1. Open your project at [supabase.com](https://supabase.com) → in the left sidebar click **SQL Editor**.
2. Click **New query** (or use the existing query box).
3. Copy the whole SQL block below, paste it into the editor, then click **Run** (or press Ctrl+Enter / Cmd+Enter).

This block **drops** the old “Allow all” policy (if you had one) and **creates** the table and the new read/write policies in one go:

```sql
-- Remove old policy that let everyone do everything (if it exists)
drop policy if exists "Allow all for gallery_entries" on gallery_entries;

-- Table (skip if you already created it)
create table if not exists gallery_entries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  sort_order int not null default 0,
  photos jsonb not null default '[]'::jsonb
);

alter table gallery_entries enable row level security;

-- Everyone can read the gallery
create policy "Allow public read gallery_entries"
  on gallery_entries for select
  using (true);

-- Only signed-in users can add/update/delete (only you can manage)
create policy "Allow authenticated write gallery_entries"
  on gallery_entries for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
```

If you see an error like *policy "Allow public read gallery_entries" already exists* (or the authenticated one), those policies are already there; you can ignore that error or drop them first in **Table Editor** → **gallery_entries** → **Policies** (delete the policy), then run the `create policy` lines again.

## 4. Storage bucket

1. In Supabase: **Storage** → **New bucket**.
2. Name: `gallery`.
3. Make it **Public** (so visitors can see photo URLs).
4. Create the bucket, then go to **Policies** for `gallery` and add **two** policies:

   **Policy 1 – everyone can read**
   - **Policy name:** Allow public read  
   - **Allowed operations:** SELECT only  
   - **Target roles:** All (public)  
   - **Policy definition:** `bucket_id = 'gallery'` (or `true`)

   **Policy 2 – only signed-in users can upload/delete**
   - **Policy name:** Allow authenticated upload and delete  
   - **Allowed operations:** INSERT, DELETE (and SELECT if required by the UI)  
   - **Target roles:** authenticated (or use policy definition below)  
   - **Policy definition:** `bucket_id = 'gallery'` and `auth.role() = 'authenticated'` (so only logged-in users can insert or delete).

   Alternatively, in **SQL Editor** you can create storage policies with:

   ```sql
   -- Public read for gallery bucket
   create policy "Public read gallery"
   on storage.objects for select
   using (bucket_id = 'gallery');

   -- Only authenticated users can upload/delete
   create policy "Authenticated write gallery"
   on storage.objects for all
   to authenticated
   using (bucket_id = 'gallery')
   with check (bucket_id = 'gallery');
   ```

## 5. Milestones table (optional – for managing milestones from the app)

If you want to add, edit, and delete milestones from the app (like the gallery), run this in **SQL Editor**:

```sql
create table if not exists milestones (
  id uuid primary key default gen_random_uuid(),
  date text not null default '—',
  title text not null,
  note text not null default '',
  sort_order int not null default 0,
  achieved boolean not null default false
);

alter table milestones enable row level security;

create policy "Allow public read milestones"
  on milestones for select
  using (true);

create policy "Allow authenticated write milestones"
  on milestones for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
```

**If you see “Could not add milestone. Check that the milestones table exists and RLS allows insert”:**

1. Open [supabase.com](https://supabase.com) → your project → **SQL Editor**.
2. Click **New query**, then copy the **entire** SQL block above (from `create table if not exists milestones` through the last `;`).
3. Paste into the editor and click **Run** (or Ctrl+Enter / Cmd+Enter).
4. Try adding a milestone again in the app. You must be **signed in via Admin** for inserts to work.

## 6. Create your manager account (one-time)

Only signed-in users can manage the gallery and milestones. Create a single account for yourself:

1. In Supabase: **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter your **email** and a **password** (or use **Invite user** and set the password when you first sign in).
3. Use this email and password on the **Admin** page to sign in and manage the site.

## 7. Use the app

1. Run the app (`npm run dev`).
2. **Visitors** see Gallery, Milestones, About, Messages. They do not see any “Manage” buttons.
3. **You (admin):** click **Admin** in the nav → sign in with your email and password. Then you can:
   - Go to **Gallery** and click **Manage gallery** to add sections, upload photos, edit captions, delete.
   - Go to **Milestones** and click **Manage milestones** to add, edit, mark achieved, or delete milestones.
   - Return to **Admin** anytime to sign out.
4. When managing **Gallery** you can:
   - **Add section** – new timeline section with a title.
   - **Edit title** – change a section title.
   - **Upload photo** – pick an image and optional caption.
   - **Update caption** – edit the caption (alt text) of a photo.
   - **Remove photo** – delete a photo from a section.
   - **Delete section** – remove a section and all its photos.

5. When finished, click **Done editing** on Gallery or Milestones, or **Sign out** on the Admin page. Visitors cannot add, edit, or delete anything.

Without Supabase configured, the gallery still works using the default timeline in `Gallery.jsx`.

---

## Troubleshooting: “I can’t upload images”

If uploads fail, the app will show the exact error from Supabase. Use this checklist:

1. **Environment variables**  
   Ensure `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (and restart `npm run dev` after changing them). For production, set the same variables in your host (e.g. Vercel/Netlify).

2. **Bucket exists**  
   In Supabase: **Storage** → you must see a bucket named **`gallery`** (lowercase). If not, create it: **New bucket** → name: `gallery` → set to **Public** → Create.

3. **Storage policies (most common cause)**  
   The bucket must allow **INSERT** for uploads.  
   - Go to **Storage** → click the **`gallery`** bucket → open **Policies**.  
   - Add a policy that allows **INSERT** (and **SELECT** for reading, **DELETE** for removing).  
   - Example: **Policy name** e.g. “Allow public read and upload”, **Allowed operations** include **SELECT**, **INSERT**, **DELETE**, **Target roles** “All” (or “anon”), **USING expression** `true`, **WITH CHECK expression** `true`.  
   - Save. If you only had a “read” policy, uploads will fail until an INSERT policy exists.

4. **File size and type**  
   Use common image formats (e.g. JPG, PNG). Very large files may hit Supabase limits; try a smaller image first.

5. **Browser console**  
   Open DevTools (F12) → **Console**. Failed uploads are logged there with the full Supabase error for more detail.

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

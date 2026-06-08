# Diary App Requirements

## Overview

This document summarizes the planned diary application based on the initial product interview.

The app will be built with Next.js and React, using Supabase for authentication, database storage, and image storage. It will support multiple users, private diary ownership, photo attachments, shareable read-only links, and guided writing templates.

## Confirmed Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- Supabase Database
- Supabase Storage
- React Hook Form
- Zod

## Product Direction

The diary should feel calm, personal, and easy to use every day. The recommended design direction is minimal and mobile-friendly, with a soft paper-like feeling rather than a heavy dashboard style.

The writing experience should avoid unnecessary distractions. Lists, calendar views, and shared diary views should be clean and easy to scan.

## Users And Ownership

- Multiple users can sign up and log in.
- Each user owns their own diary entries.
- Users can create, read, update, and delete only their own diary entries.
- A diary can be shared through a read-only public link.
- People with a share link can view the shared diary without logging in.
- Shared users cannot edit or delete the diary.

## MVP Features

- Sign up
- Log in
- Log out
- Create diary entries
- View diary list
- View diary detail
- Edit diary entries
- Delete diary entries
- Attach photos from the first version
- Store mood, weather, tags, and entry date
- Use writing templates
- View diary entries by date
- Create read-only share links
- Disable share links

## Recommended Pages

```txt
/
- Before login: sign in / sign up
- After login: today's diary or diary list

/diaries
- My diary list

/diaries/new
- Create a new diary

/diaries/[id]
- Diary detail
- Photo gallery
- Share link controls

/diaries/[id]/edit
- Edit diary

/calendar
- Date-based diary view

/share/[token]
- Public read-only shared diary page

/settings
- Profile and account settings
```

## Diary Fields

Each diary entry should support:

- Title
- Content
- Entry date
- Mood
- Weather
- Tags
- Template type
- Template data
- Favorite status
- Created time
- Updated time

## Writing Templates

### Free Diary

- Title
- Body

### Daily Review

- What happened today?
- What was good?
- What could have been better?
- What do I want to do tomorrow?

### Emotion Log

- Today's emotion
- Why did I feel this way?
- What helped me today?
- What do I need right now?

### Gratitude Diary

- Gratitude item 1
- Gratitude item 2
- Gratitude item 3
- One sentence for today

## Database Design

### profiles

Stores public profile information for authenticated users.

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);
```

### diaries

Stores diary entry content and metadata.

```sql
create table diaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text,
  entry_date date not null,
  mood text,
  weather text,
  tags text[] not null default '{}',
  template_type text not null default 'free',
  template_data jsonb not null default '{}'::jsonb,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### diary_images

Stores image records linked to diary entries. The actual image files are stored in Supabase Storage.

```sql
create table diary_images (
  id uuid primary key default gen_random_uuid(),
  diary_id uuid not null references diaries(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  public_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
```

### diary_share_links

Stores public read-only share links for diary entries.

```sql
create table diary_share_links (
  id uuid primary key default gen_random_uuid(),
  diary_id uuid not null references diaries(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  token text not null unique,
  is_active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
```

## Supabase Storage

Recommended bucket:

```txt
diary-images
```

Recommended storage path format:

```txt
{user_id}/{diary_id}/{image_id}.{extension}
```

This keeps images grouped by owner and diary entry.

## Security And RLS

Supabase Row Level Security should be enabled from the first version.

Recommended access rules:

- Users can read only their own profile.
- Users can update only their own profile.
- Users can create diary entries where `user_id = auth.uid()`.
- Users can read only their own diary entries.
- Users can update only their own diary entries.
- Users can delete only their own diary entries.
- Users can manage images only for their own diary entries.
- Users can create and disable share links only for their own diary entries.
- Public share pages can read active share links and the linked diary entry through a controlled query or server route.

## Share Link Behavior

- A user can create a share link from a diary detail page.
- The generated link should look like:

```txt
/share/{token}
```

- Anyone with the link can view the diary.
- Public viewers cannot edit, delete, or see private owner controls.
- The owner can disable the share link.
- Expiration can be added later. A practical default is no expiration, with optional presets such as 7 days or 30 days.

## Suggested Implementation Order

1. Create the Next.js project and install UI dependencies.
2. Configure Supabase client helpers and environment variables.
3. Create Supabase tables, storage bucket, and RLS policies.
4. Build authentication pages and session handling.
5. Build diary create/list/detail/edit/delete flows.
6. Add image upload and diary image display.
7. Add template-based diary forms.
8. Add calendar or date-filtered view.
9. Add share link creation and public share page.
10. Polish responsive UI and empty/loading/error states.

## Open Decisions

- Whether shared links should expire by default.
- Whether public share pages should show all attached images or only selected images.
- Whether calendar view should be a full monthly calendar or a simpler date-filtered list in the MVP.
- Whether AI features such as reflection prompts or weekly summaries should be added later.


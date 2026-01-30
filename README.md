# 🍽️ HeyNom — Simple Food Diary

A clean, minimal food diary app. Log what you eat, see your timeline, track your streak.

## Tech Stack
- **Frontend**: React + Vite + TypeScript (Bun)
- **Backend**: FastAPI on AWS Lambda
- **Database**: Supabase PostgreSQL (schema: `heynom`) + Auth + RLS
- **Infra**: Terraform (CloudFront + S3 + API Gateway + Lambda)
- **CI/CD**: GitHub Actions (Bun for frontend, Python for backend)

## Quick Start

```bash
cd frontend
bun install
bun dev
```

Open http://localhost:5173 — app runs in dev mode.

## Database Schema

Run this in Supabase SQL Editor:

```sql
create schema if not exists heynom;

create table heynom.food_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  food_text text not null,
  meal_type text check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')) default 'snack',
  logged_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table heynom.food_entries enable row level security;

create policy "Users can CRUD own entries" on heynom.food_entries
  for all using (auth.uid() = user_id);

create index idx_food_entries_user_id on heynom.food_entries(user_id);
create index idx_food_entries_logged_at on heynom.food_entries(logged_at);
```

## Environment Variables

### Frontend
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon key
- `VITE_API_URL` — Backend API URL

### Backend
- `DATABASE_URL` — PostgreSQL connection string
- `SUPABASE_JWT_SECRET` — JWT secret for auth verification
- `CORS_ORIGINS` — Allowed origins (comma-separated)

## Deploy

Pushes to `staging` deploy to staging. Pushes to `main` deploy to production. CI runs tests and Terraform automatically.

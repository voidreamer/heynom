# 🍽️ HeyNom — Simple Food Diary

A clean, minimal food diary app. Log what you eat, see your timeline, track your streak.

## Tech Stack
- **Frontend**: React + Vite + TypeScript
- **Backend**: FastAPI on AWS Lambda
- **Database**: Supabase PostgreSQL + Auth + RLS
- **Infra**: Terraform (CloudFront + S3 + API Gateway + Lambda)
- **CI/CD**: GitHub Actions

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 — app runs in dev mode with local storage (no Supabase needed).

## Database Schema

```sql
create table food_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  food_text text not null,
  meal_type text check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')) default 'snack',
  logged_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table food_entries enable row level security;
create policy "Users can CRUD own entries" on food_entries
  for all using (auth.uid() = user_id);
```

## Environment Variables

### Frontend
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon key
- `VITE_API_URL` — Backend API URL

### Backend
- `DATABASE_URL` — PostgreSQL connection string
- `SUPABASE_JWT_SECRET` — JWT secret for auth verification
- `CORS_ORIGINS` — Allowed origins

## Deploy
Push to `staging` or `main` branch — CI/CD handles the rest.

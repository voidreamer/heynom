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


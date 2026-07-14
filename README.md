# DSA Tracker 🚀

A comprehensive, professional-grade web application to track your Data Structures and Algorithms (DSA) preparation. Built with React, Vite, and Supabase, this tracker helps you organize, review, and master coding problems efficiently.

## Features ✨

- **📊 Comprehensive Dashboard:** Visualize your progress with a GitHub-style contribution heatmap, dynamic statistics, and cumulative progress charts.
- **🧠 Spaced Repetition (Review Queue):** Automatically schedules problems for review based on difficulty (Easy, Good, Hard, Forgot) to ensure long-term retention.
- **📋 All Problems Database:** A fully sortable and filterable table to view all logged problems.
- **🗺️ Roadmap Tracking:** Track your progress across 22 weeks of topics with specific goals for each phase.
- **🛡️ Weekly Audits:** Form a habit of self-reflection by logging weekly check-ins to track your hits, misses, and patterns.
- **🔐 Authentication & Cloud Sync:** Powered by Supabase. Log in via Magic Link or GitHub. Your data is isolated, secure, and synced across all your devices.
- **🎨 Premium UI/UX:** A beautifully designed "matte-dark" aesthetic with vibrant accents, micro-animations, and complete Light/Dark mode support.
- **⌨️ Keyboard Shortcuts:** Quick actions like `Cmd+K` / `Ctrl+K` to instantly log a new problem from anywhere in the app.

## Tech Stack 🛠️

- **Frontend:** React, Vite, React Router
- **Styling:** Vanilla CSS with a custom design system & CSS variables
- **Charts & Icons:** Recharts, Lucide React
- **Backend & Auth:** Supabase (PostgreSQL, Row Level Security)
- **Deployment:** Vercel

## Local Setup 💻

### 1. Clone the repository
```bash
git clone https://github.com/anacodah/dsa-tracker.git
cd dsa-tracker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Supabase
Create a project on [Supabase](https://supabase.com). 

Run the following SQL in your Supabase SQL Editor to create the necessary tables and Row Level Security (RLS) policies:
```sql
create extension if not exists "uuid-ossp";

create table public.problems (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  name          text not null,
  url           text,
  date_solved   date not null,
  topic         text not null,
  difficulty    text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  time_taken    integer,
  solved_independently boolean default true,
  note          text,
  review_bucket text default 'A' check (review_bucket in ('A', 'B', 'C')),
  next_review_date timestamptz,
  mastered      boolean default false,
  created_at    timestamptz default now()
);

create table public.audits (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  date_created  timestamptz default now(),
  data          jsonb 
);

alter table public.problems enable row level security;
alter table public.audits   enable row level security;

create policy "Users access own problems" on public.problems for all using (auth.uid() = user_id);
create policy "Users access own audits" on public.audits for all using (auth.uid() = user_id);
```

### 4. Environment Variables
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 5. Start the development server
```bash
npm run dev
```

## Contributing 🤝

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/anacodah/dsa-tracker/issues).

## License 📝

This project is open-source and available under the [MIT License](LICENSE).

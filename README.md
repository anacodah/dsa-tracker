# 🚀 DSA Tracker

A comprehensive, professional-grade web application tailored for tracking, managing, and mastering your Data Structures and Algorithms (DSA) preparation. 

Built with a focus on spaced repetition, data visualization, and habit tracking, this tool ensures that you not only solve problems but retain the knowledge long-term.

## ✨ Key Features

- **📊 Comprehensive Dashboard:** Visualize your daily progress using a GitHub-style contribution heatmap. Track your total problems solved, weekly progress, and view cumulative progress charts over time.
- **🧠 Spaced Repetition (Review Queue):** Forget forgetting. The app uses an intelligent Spaced Repetition System (SRS). Problems are placed into review buckets (A, B, C) and rescheduled based on how well you remember them:
  - **Easy:** Mastered instantly.
  - **Good:** Promoted to the next bucket (10 days, 30 days) and eventually mastered.
  - **Hard:** Rescheduled for review in 3 days.
  - **Forgot:** Sent back to bucket A, scheduled for tomorrow.
- **📋 All Problems Database:** A fully searchable, sortable, and filterable table to view all logged problems. Track completion time, difficulty, topics, and personalized notes.
- **🗺️ Roadmap Tracking:** Structured 22-week roadmap. Track your progress phase by phase with clear milestones ranging from basic arrays to advanced graphs and dynamic programming.
- **🛡️ Weekly Audits:** Enforce self-reflection. Log weekly check-ins to record your consistency, major blockers, and insights to constantly improve your problem-solving process.
- **🔐 Secure Authentication & Cloud Sync:** Powered by Supabase. Secure login via Magic Link or GitHub. Your data is isolated and safely stored in the cloud.
- **📦 Data Export/Import:** Easily backup your problem logs and audit history to a local JSON file or import them back when needed.
- **🎨 Premium UI/UX:** Features a beautiful "matte-dark" design aesthetic with vibrant accents, smooth micro-animations, keyboard shortcuts (e.g., `Cmd+K` / `Ctrl+K`), and a fully responsive layout.

## 🛠️ Tech Stack

This project is built using modern web development tools and best practices:

- **Frontend:** React (v19), Vite, React Router (v7)
- **Styling:** Custom CSS with a comprehensive design system utilizing CSS variables
- **Data Visualization & Icons:** Recharts, Lucide React
- **Backend & Database:** Supabase (PostgreSQL with Row Level Security)
- **Code Quality:** Oxlint

## 💻 Local Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/anacodah/dsa-tracker.git
cd dsa-tracker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Supabase Backend
Create a project on [Supabase](https://supabase.com). 

Navigate to the SQL Editor in your Supabase dashboard and run the following script to create the necessary tables and Row Level Security (RLS) policies:

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

-- Enable Row Level Security (RLS) to ensure users can only access their own data
alter table public.problems enable row level security;
alter table public.audits   enable row level security;

create policy "Users access own problems" on public.problems for all using (auth.uid() = user_id);
create policy "Users access own audits" on public.audits for all using (auth.uid() = user_id);
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory of the project and add your Supabase connection details:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 5. Start the Application
Run the Vite development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 🤝 Contributing

Contributions, issues, and feature requests are highly welcome! 
Feel free to check the [issues page](https://github.com/anacodah/dsa-tracker/issues).

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

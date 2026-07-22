# 🚀 DSA Tracker - Latest Updates

This document summarizes the major new features and enhancements added to the DSA Tracker. 

## 🗺️ 1. Customizable Roadmap
The 22-week roadmap is now fully user-defined and backed by the database instead of being hardcoded.
- **Database Integration:** Created a new `roadmap_phases` table in Supabase to store each user's unique roadmap.
- **Auto-Seeding:** If a new user logs in and has no roadmap phases, the app automatically generates the default 22-week plan for them.
- **Interactive Edit Mode:** You can now click "Edit Roadmap" to:
  - Rename phases (e.g., change "Week 1" to "Month 1").
  - Add or remove topics for a specific phase.
  - Adjust the target number of problems for that phase.
  - Reorder phases by dragging them up or down.
  - Add entirely new phases or delete existing ones.

## 🤖 2. AI-Powered Progress Analysis
We integrated Google's Gemini AI to act as your personal DSA coach.
- **Dashboard Widget:** A new "AI Progress Analysis" card has been added to the bottom of the Dashboard.
- **Smart Insights:** By clicking "Analyze Progress", the app sends your 30 most recently solved problems to the Gemini `3.5-flash` model.
- **Personalized Feedback:** The AI analyzes your recent topics, difficulty distribution, and time taken to provide a 3-paragraph summary. It highlights your strengths, points out any imbalances (like avoiding Hard problems), and gives actionable advice on what to focus on next.

## ⚡ 3. Chrome Extension Quick Logger
Logging problems manually can be tedious, so we built a Chrome Extension to automate it.
- **LeetCode Integration:** The extension injects a vibrant, floating **"Log to DSA Tracker"** button onto every LeetCode problem page.
- **Web Scraping:** When clicked, it automatically scrapes the problem's title, difficulty (Easy/Medium/Hard), and URL.
- **One-Click Logging:** It opens your DSA Tracker's `/log` page in a new tab, passing the scraped data securely via URL query parameters so the form is instantly pre-filled and ready to submit.

---
*Note: To fully enable these features, ensure your Supabase database contains the `roadmap_phases` table and your environment variables include `VITE_GEMINI_API_KEY`.*

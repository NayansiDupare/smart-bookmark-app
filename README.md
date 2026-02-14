# Smart Bookmark App

A modern bookmark manager built with Next.js (App Router) and Supabase.

## 🚀 Live Demo

Live URL: https://your-vercel-url.vercel.app  
GitHub Repo: https://github.com/your-username/google-bookmark-app

---

## 📌 Features

- 🔐 Google OAuth Login (No email/password)
- ➕ Add bookmarks (Title + URL)
- 🗑 Delete your own bookmarks
- ✏️ Edit bookmarks
- 📁 Folder management
- 📌 Pin bookmark (moves to top automatically)
- 🔄 Real-time updates (multi-tab sync)
- 🎨 Responsive UI with Tailwind CSS
- ☁️ Deployed on Vercel

---

## 🛠 Tech Stack

- **Next.js (App Router)**
- **Supabase**
  - Authentication (Google OAuth)
  - PostgreSQL Database
  - Realtime
  - Row Level Security (RLS)
- **Tailwind CSS**
- **Vercel** (Deployment)

---

## 🔐 Authentication

- Google OAuth only
- No email/password login
- Session managed using Supabase Auth

---

## 🧱 Database Design

### bookmarks table

| Column      | Type      |
|------------|----------|
| id         | uuid     |
| title      | text     |
| url        | text     |
| user_id    | uuid     |
| folder_id  | uuid     |
| pinned     | boolean  |
| position   | integer  |
| created_at | timestamp|

### folders table

| Column      | Type      |
|------------|----------|
| id         | uuid     |
| name       | text     |
| user_id    | uuid     |
| pinned     | boolean  |
| position   | integer  |
| created_at | timestamp|

---

## 🔒 Row Level Security (RLS)

Policies ensure users can only access their own data:

auth.uid() = user_id


Applied for:
- SELECT
- INSERT
- UPDATE
- DELETE

---

## 🔄 Real-Time Functionality

Supabase Realtime is enabled using:

---js
supabase.channel("realtime-bookmarks")
  .on("postgres_changes", ...)

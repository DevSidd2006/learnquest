# LearnQuest - AI-Powered Learning Platform

An interactive, gamified learning platform that leverages Google's Gemini AI to create personalized educational experiences with custom learning paths, quizzes, and flashcards.

## 🚀 Quick Start

```bash
npm install
cp .env.example .env
# Add your GEMINI_API_KEY
npm run dev
```

Visit `http://localhost:5000` to start learning!

## 📚 Documentation

- **[Complete Setup Guide](./docs/README.md)** - Detailed installation and configuration
- **[Setup Instructions](./docs/SETUP.md)** - Step-by-step setup process
- **[Storage Options](./docs/STORAGE.md)** - In-memory vs Supabase storage
- **[Project Overview](./docs/replit.md)** - Architecture and technical details

## 🏗️ Project Structure

```
├── client/                 # React frontend application
├── server/                 # Express backend API
│   ├── api/               # API routes and endpoints
│   ├── services/          # Business logic and external services
│   └── config/            # Configuration files
├── database/              # Database schema and migrations
├── tools/                 # Development scripts and utilities
└── docs/                  # Documentation files
```

## 🎯 Features

- 🧠 **AI-Generated Learning Paths** - Personalized topic outlines
- 💡 **Concept Explanations** - Detailed explanations with analogies
- 🎯 **Interactive Quizzes** - Multiple choice and true/false questions
- 📚 **Smart Flashcards** - Spaced repetition learning
- 🏆 **Gamification** - XP points, streaks, and progress tracking

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, TypeScript, Zod validation
- **AI**: Google Gemini API for content generation
- **Storage**: In-memory (default) or Supabase PostgreSQL
- **Build**: Vite, esbuild

## 📄 License

MIT License - see LICENSE file for details
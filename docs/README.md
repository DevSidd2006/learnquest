# LearnQuest - AI-Powered Learning Platform

An interactive, gamified learning platform that leverages Google's Gemini AI to create personalized educational experiences with custom learning paths, quizzes, and flashcards.

## Features

- 🧠 **AI-Generated Learning Paths** - Personalized topic outlines based on difficulty and learning style
- 💡 **Concept Explanations** - Detailed explanations with analogies, examples, and key takeaways
- 🎯 **Interactive Quizzes** - Multiple choice and true/false questions
- 📚 **Smart Flashcards** - Spaced repetition with hints and examples
- 🏆 **Gamification** - XP points, streaks, levels, and progress tracking
- 🎨 **Modern UI** - Responsive design with light/dark theme support
- ⚡ **Real-time Learning** - Instant AI-generated explanations and examples

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Wouter for routing
- TanStack Query for state management
- shadcn/ui + Radix UI components
- Tailwind CSS for styling

### Backend
- Express.js with TypeScript
- Google Gemini AI integration
- Zod for validation
- In-memory storage (with optional Supabase PostgreSQL integration)

## Getting Started

📋 **For detailed setup instructions, see [SETUP.md](./SETUP.md)**

### Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Add your GEMINI_API_KEY (required)
# Optionally add SUPABASE_URL and SUPABASE_ANON_KEY for persistent storage
```

3. **Setup database (Optional):**
- For persistent storage: Create a Supabase project and run the migration
- For development: Leave Supabase variables empty to use in-memory storage

4. **Start development server:**
```bash
npm run dev
```

Visit `http://localhost:5000` to use the application.

### Test Your Setup

```bash
npm run test:supabase  # Test database connection
```

### Production

Build and start the production server:
```bash
npm run build
npm start
```

## Learning Flow

LearnQuest follows a structured learning approach:

1. **Create Topic** - Choose what you want to learn, difficulty level, and learning style
2. **AI-Generated Outline** - Get a personalized learning path with subtopics
3. **Learn Concept** - Start with detailed explanations, analogies, and real-world examples
4. **Take Quiz** - Test your understanding with multiple choice and true/false questions
5. **Study Flashcards** - Reinforce learning with spaced repetition
6. **Track Progress** - Earn XP, maintain streaks, and level up

Each subtopic follows this flow to ensure comprehensive understanding before moving to the next topic.

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
├── server/                # Express backend
│   ├── api/              # API routes and endpoints
│   ├── services/         # Business logic and external services
│   ├── config/           # Configuration files
│   └── index.ts          # Server entry point
├── database/             # Database schema and migrations
│   ├── migrations/       # SQL migration files
│   └── schema.ts         # TypeScript schema definitions
├── tools/                # Development scripts and utilities
└── docs/                 # Documentation files
```

## API Endpoints

- `POST /api/sessions` - Create learning session
- `GET /api/sessions/:id` - Get session details
- `POST /api/explanation` - Get AI concept explanation
- `GET /api/quiz/:sessionId/:subtopicId` - Get quiz questions
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/flashcards/:sessionId/:subtopicId` - Get flashcards
- `POST /api/flashcards/complete` - Complete flashcard review
- `GET /api/progress` - Get user progress

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `SUPABASE_URL` | Supabase project URL | No (for persistence) |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | No (for persistence) |
| `PORT` | Server port (default: 5000) | No |
| `NODE_ENV` | Environment (development/production) | No |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
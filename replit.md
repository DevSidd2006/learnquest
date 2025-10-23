# LearnQuest - AI-Powered Learning Platform

## Overview

LearnQuest is an interactive, gamified learning platform that leverages Google's Gemini AI to create personalized educational experiences. The application generates custom learning paths, quizzes, and flashcards based on user-selected topics, difficulty levels, and learning styles. Drawing inspiration from Duolingo's engagement mechanics and Khan Academy's educational clarity, the platform emphasizes playful learning with XP points, streaks, and progress tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching

**UI Framework:**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui component system with "new-york" style variant
- Tailwind CSS for utility-first styling with custom design tokens
- Custom color system supporting light/dark themes with HSL values

**Design System:**
- Gamified interface with Duolingo-inspired aesthetics
- Primary font: Nunito (friendly, rounded)
- Monospace font: JetBrains Mono for code snippets
- Color palette optimized for learning: Brand Green (primary), Energetic Blue (secondary), Success Green, Error Red, XP Gold
- Responsive spacing using Tailwind units (2, 4, 8, 12, 16, 20)

**State Management Pattern:**
- Server state via React Query with aggressive caching (staleTime: Infinity)
- Local UI state with React hooks
- No global state management library required due to server-driven architecture

### Backend Architecture

**Technology Stack:**
- Express.js server with TypeScript
- ESM module system throughout
- Session-based architecture without traditional authentication

**Storage Strategy:**
- In-memory storage (MemStorage class) implementing IStorage interface
- Designed to be swappable with database-backed implementations
- No database currently configured, but Drizzle ORM schema defined for future PostgreSQL integration

**API Design:**
- RESTful endpoints under `/api` prefix
- Request validation using Zod schemas
- Structured error handling with appropriate HTTP status codes

**Key Endpoints:**
- `POST /api/sessions` - Create new learning session with AI-generated outline
- `GET /api/sessions/:id` - Retrieve session details
- `POST /api/quiz/submit` - Submit quiz answers and update progress
- `POST /api/flashcards/complete` - Mark flashcard set as reviewed
- `GET /api/progress` - Retrieve user progress metrics

### Data Models

**Learning Session:**
- Topic, difficulty level (beginner/intermediate/advanced), learning style (visual/practical/conceptual)
- AI-generated outline with subtopics stored as JSON
- Progress tracking via currentStep and completed flags

**Quiz System:**
- Multiple-choice questions generated per subtopic
- Score tracking and completion status
- Questions stored as JSON array

**Flashcard System:**
- Front/back card pairs with optional examples
- Review count tracking
- Cards stored as JSON array

**User Progress:**
- XP points, level, and streak tracking
- Session completion statistics
- Gamification metrics for engagement

### External Dependencies

**Google Gemini AI Integration:**
- Primary AI service: Google GenAI SDK (@google/genai)
- Model: gemini-2.5-flash (latest recommended)
- API key via environment variable: GEMINI_API_KEY
- Structured JSON outputs using responseSchema for type-safe AI responses

**AI-Generated Content:**
- Topic outlines with subtopics, descriptions, and time estimates
- Quiz questions with multiple-choice answers and explanations
- Flashcards with concept/definition pairs and real-world examples
- On-demand explanations for difficult concepts

**Database (Configured but Not Active):**
- Drizzle ORM configured for PostgreSQL via @neondatabase/serverless
- Schema defined in shared/schema.ts with tables: learning_sessions, quizzes, flashcard_sets, user_progress
- Connection via DATABASE_URL environment variable
- Migration output directory: ./migrations

**UI Component Libraries:**
- Radix UI primitives for 20+ accessible components
- class-variance-authority for variant-based styling
- cmdk for command palette functionality
- date-fns for date manipulation
- lucide-react for icon system

**Development Tools:**
- Replit-specific plugins for development environment
- TypeScript strict mode enabled
- Path aliases: @ for client/src, @shared for shared directory
- Hot module replacement via Vite

**Build Process:**
- Client: Vite builds React app to dist/public
- Server: esbuild bundles Express server to dist/index.js
- ESM format throughout with node platform targeting
- External packages not bundled in server build

### Session Management

**Approach:**
- Stateless HTTP requests with potential for session cookies
- connect-pg-simple configured for PostgreSQL session storage (not currently active)
- Raw body parsing available for webhook verification

**Development vs Production:**
- Development: NODE_ENV=development with tsx for hot reloading
- Production: NODE_ENV=production with compiled JavaScript
- Conditional middleware loading based on environment
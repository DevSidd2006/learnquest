# Design Guidelines: AI-Powered Learning Platform

## Design Approach
**Reference-Based Approach** - Drawing primary inspiration from Duolingo's gamified learning experience, with elements from Khan Academy's clarity and Quizlet's content presentation.

**Core Design Principles:**
- Playful engagement over corporate formality
- Progressive disclosure of complexity
- Immediate positive reinforcement
- Clear learning hierarchy

## Color Palette

### Primary Colors (Light Mode)
- **Brand Green**: 140 65% 45% - Primary actions, progress indicators
- **Energetic Blue**: 210 85% 55% - Secondary actions, quiz elements
- **Success Green**: 145 70% 50% - Correct answers, achievements
- **Error Red**: 5 75% 60% - Incorrect answers, warnings
- **Warning Orange**: 35 85% 60% - Hints, neutral feedback

### Background & Surfaces (Light Mode)
- **Page Background**: 0 0% 98%
- **Card Background**: 0 0% 100%
- **Hover Surface**: 140 20% 96%

### Dark Mode
- **Page Background**: 220 15% 12%
- **Card Background**: 220 15% 16%
- **Brand Green**: 140 60% 55% (adjusted for dark)
- **Energetic Blue**: 210 75% 65%

### Accent Colors
- **XP Gold**: 45 95% 55% - Points, streaks, special achievements
- **Purple Bonus**: 270 70% 60% - Premium features, bonus content

## Typography

**Font Families:**
- Primary: 'Nunito' (Google Fonts) - Friendly, rounded, highly readable
- Monospace: 'JetBrains Mono' - Code snippets, technical content

**Type Scale:**
- Headings: font-bold text-3xl to text-5xl
- Body: font-normal text-base to text-lg
- UI Elements: font-semibold text-sm to text-base
- Micro-copy: font-medium text-xs

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 8, 12, 16, 20
- Micro spacing: p-2, gap-2 (component internals)
- Standard spacing: p-4, gap-4, m-4 (cards, buttons)
- Section spacing: p-8, py-12, gap-8 (major sections)
- Large spacing: p-16, py-20 (hero, major dividers)

**Container Strategy:**
- Max-width: max-w-7xl for dashboard views
- Content cards: max-w-2xl for reading/quiz content
- Two-column layouts for desktop (quiz + explanation)

## Component Library

### Navigation
- **Top Bar**: Sticky header with logo, XP counter (animated), streak flame icon, profile avatar
- **Side Navigation** (Desktop): Collapsible sidebar with icon + label format
- **Bottom Navigation** (Mobile): Fixed bottom bar with 4-5 primary actions

### Learning Cards
- **Topic Cards**: Rounded-2xl borders, subtle shadows (shadow-md), hover lift effect (hover:-translate-y-1)
- **Progress Ring**: Circular progress indicator showing completion percentage
- **Lock States**: Greyscale with lock icon for unavailable content

### Quiz Components
- **Question Card**: Large, centered with generous padding (p-8), clear question text (text-2xl)
- **Answer Options**: Full-width buttons with icons, clear hover states, disabled state post-selection
- **Feedback Panel**: Slide-in from bottom with color-coded background (green/red), explanation text, continue button

### Flashcard System
- **Card Container**: 3D flip animation on click/tap
- **Front/Back**: High contrast text, centered content, subtle texture background
- **Navigation**: Swipe gestures (mobile), arrow keys (desktop), progress dots

### Progress Dashboard
- **Streak Calendar**: Grid layout showing daily activity, highlighted current streak
- **XP Graph**: Line chart showing weekly/monthly progress
- **Achievement Badges**: Grid of earned badges with unlock animations
- **Level Indicator**: Progress bar with current level, points to next level

### Modal Overlays
- **Explanation Modal**: Backdrop blur, centered card (max-w-3xl), tabbed content (concept/examples/tips)
- **Success Celebration**: Full-screen confetti animation, large checkmark, points earned counter
- **Outline Generator**: Step-by-step wizard with progress indicator, topic input, difficulty selection

## Animations

**Use Strategically:**
- **Page Transitions**: Subtle fade + slide (duration-200)
- **Card Interactions**: Scale on hover (hover:scale-105), lift on click
- **Success States**: Confetti burst, checkmark draw animation, XP counter increment
- **Progress Updates**: Smooth bar fills, number count-ups
- **Flashcard Flip**: 3D rotate transform (transition-all duration-500)

**Avoid:**
- Continuous background animations
- Auto-playing carousels
- Excessive bounce effects

## Images

### Hero Section (Dashboard/Home)
- **Large Illustration**: Cheerful learning scene with diverse characters studying (top of dashboard)
- **Placement**: Full-width banner, height 300-400px, gradient overlay for text readability

### Content Images
- **Topic Icons**: Colorful, minimalist illustrations for each subject category
- **Explanation Visuals**: Diagrams, infographics for complex concepts
- **Achievement Badges**: Custom illustrated badges for milestones

### Empty States
- **No Progress Yet**: Friendly illustration encouraging users to start learning
- **Completed Topic**: Celebration illustration with trophy/star

## Responsive Behavior

**Mobile (< 768px):**
- Single column layouts
- Bottom navigation bar
- Full-width cards with reduced padding (p-4)
- Larger touch targets (min h-12)

**Tablet (768px - 1024px):**
- Two-column where appropriate (quiz + sidebar)
- Sidebar remains visible but narrower

**Desktop (> 1024px):**
- Three-column dashboard layouts
- Persistent side navigation
- Hover states fully active

## Accessibility Notes

- Maintain 4.5:1 contrast ratios for text
- Keyboard navigation for all interactive elements
- Focus indicators (ring-2 ring-offset-2)
- Screen reader labels for icon-only buttons
- Color not sole indicator of state (use icons + text)
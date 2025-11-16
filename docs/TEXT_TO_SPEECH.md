# Text-to-Speech Feature

## Overview
LearnQuest now includes built-in text-to-speech (TTS) functionality to enhance accessibility and support audio learners.

## Features

### 🎯 Smart Audio Controls
- **Play/Pause**: Click once to start, click again to pause/resume
- **Stop Button**: Appears when audio is playing for quick cancellation
- **Visual Feedback**: Loading spinner and speaking indicators
- **Smooth Transitions**: Animated buttons with gradient styling

### 📍 Where to Find TTS

#### 1. Concept Explanation Page
- **Full Page Audio**: Large "Listen" button at the top reads the entire explanation
- **Section Audio**: Individual play buttons for each section:
  - Understanding the Concept
  - Think of it Like This (Analogy)
  - Real-World Examples
  - Key Takeaways

#### 2. Session/Learning Path Page
- **Subtopic Audio**: Play button next to each subtopic title and description
- Helps preview content before diving in

### 🎨 Design
- Gradient-styled buttons matching the app theme
- Compact ghost buttons for individual sections
- Prominent gradient button for full-page audio
- Smooth hover effects and animations

### 🔧 Technical Details

#### Browser Support
Uses the Web Speech API (SpeechSynthesis), supported in:
- ✅ Chrome/Edge (Excellent)
- ✅ Safari (Good)
- ✅ Firefox (Good)
- ❌ Older browsers (gracefully hidden)

#### Voice Selection
- Automatically selects high-quality voices (Google/Microsoft)
- Falls back to default system voice
- Optimized speech rate (0.9x) for better comprehension

#### Performance
- Lightweight (no external dependencies)
- Uses browser's native TTS engine
- No API calls or data usage
- Works offline

## Usage Examples

### For Students
1. **Audio Learning**: Listen to explanations while taking notes
2. **Multitasking**: Learn while doing other activities
3. **Accessibility**: Support for visual impairments
4. **Language Learning**: Hear proper pronunciation and pacing

### For Educators
- Provides multiple learning modalities
- Supports diverse learning styles
- Enhances accessibility compliance
- No additional setup required

## Keyboard Shortcuts
- Click button: Play/Pause
- Stop button: Cancel audio immediately
- Browser controls: Use system audio controls

## Future Enhancements
- [ ] Speed control (0.5x - 2x)
- [ ] Voice selection dropdown
- [ ] Download audio option
- [ ] Highlight text as it's spoken
- [ ] Auto-play next section
- [ ] Remember user preferences

## Accessibility
- ARIA labels for screen readers
- Keyboard accessible
- Visual state indicators
- Graceful degradation for unsupported browsers

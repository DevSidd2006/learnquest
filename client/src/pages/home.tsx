import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Brain, 
  BookOpen, 
  Zap, 
  Trophy, 
  Flame, 
  Star,
  Sparkles,
  Target,
  GraduationCap,
  TrendingUp
} from "lucide-react";

export default function Home() {
  const [xp] = useState(1250);
  const [streak] = useState(7);
  const [level] = useState(5);
  const nextLevelXp = 1500;
  const progressPercent = (xp / nextLevelXp) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">LearnQuest</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* XP Display */}
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-accent px-4 py-2">
              <Star className="h-4 w-4 text-chart-4" fill="currentColor" />
              <span className="font-semibold text-sm">{xp} XP</span>
            </div>
            
            {/* Streak Display */}
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-accent px-4 py-2">
              <Flame className="h-4 w-4 text-chart-5" fill="currentColor" />
              <span className="font-semibold text-sm">{streak} day streak</span>
            </div>
            
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 pt-12 pb-8">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">AI-Powered Learning</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Master Anything with
            <span className="text-primary"> Interactive AI</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Personalized quizzes, interactive flashcards, and real-world examples. 
            Learn at your own pace with gamified experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/create">
              <Button size="lg" className="gap-2 min-h-12 px-8 text-base" data-testid="button-start-learning">
                <GraduationCap className="h-5 w-5" />
                Start Learning
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="gap-2 min-h-12 px-8 text-base" data-testid="button-view-progress">
                <TrendingUp className="h-5 w-5" />
                View Progress
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container px-4 py-8">
        <Card className="mx-auto max-w-4xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Level {level}</CardTitle>
                <CardDescription>Keep learning to reach Level {level + 1}</CardDescription>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                <Trophy className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{xp} / {nextLevelXp} XP</span>
                <span className="text-muted-foreground">{Math.round(progressPercent)}%</span>
              </div>
              <Progress value={progressPercent} className="h-3" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-1">{streak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-2">12</div>
                <div className="text-xs text-muted-foreground">Topics Done</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-3">48</div>
                <div className="text-xs text-muted-foreground">Quizzes Passed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover-elevate transition-all duration-200">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-1/10 mb-2">
                  <Brain className="h-6 w-6 text-chart-1" />
                </div>
                <CardTitle className="text-xl">AI-Generated Outlines</CardTitle>
                <CardDescription>
                  Choose any topic and get a personalized learning path tailored to your level
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate transition-all duration-200">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-2/10 mb-2">
                  <Target className="h-6 w-6 text-chart-2" />
                </div>
                <CardTitle className="text-xl">Interactive Quizzes</CardTitle>
                <CardDescription>
                  Test your knowledge with multiple choice, true/false, and fill-in-the-blank questions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate transition-all duration-200">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-3/10 mb-2">
                  <BookOpen className="h-6 w-6 text-chart-3" />
                </div>
                <CardTitle className="text-xl">Smart Flashcards</CardTitle>
                <CardDescription>
                  Review key concepts with interactive flashcards and spaced repetition
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate transition-all duration-200">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-4/10 mb-2">
                  <Sparkles className="h-6 w-6 text-chart-4" />
                </div>
                <CardTitle className="text-xl">Real-Life Examples</CardTitle>
                <CardDescription>
                  Understand concepts better with practical examples and analogies
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate transition-all duration-200">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-5/10 mb-2">
                  <Zap className="h-6 w-6 text-chart-5" />
                </div>
                <CardTitle className="text-xl">Track Progress</CardTitle>
                <CardDescription>
                  Earn XP, maintain streaks, and watch your knowledge grow daily
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate transition-all duration-200">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-2">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Earn Achievements</CardTitle>
                <CardDescription>
                  Unlock badges and celebrate milestones as you master new skills
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-16">
        <Card className="mx-auto max-w-4xl bg-gradient-to-br from-primary/10 via-chart-2/5 to-chart-3/10 border-2">
          <CardContent className="flex flex-col items-center gap-6 p-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Ready to Start Learning?</h2>
              <p className="text-muted-foreground text-lg">
                Pick a topic, choose your difficulty, and let AI create your personalized learning journey
              </p>
            </div>
            <Link href="/create">
              <Button size="lg" className="gap-2 min-h-12 px-8 text-base" data-testid="button-create-topic">
                <Sparkles className="h-5 w-5" />
                Create Your First Topic
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

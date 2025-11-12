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
  TrendingUp,
  ArrowRight,
  Rocket
} from "lucide-react";

export default function Home() {
  const [xp] = useState(1250);
  const [streak] = useState(7);
  const [level] = useState(5);
  const nextLevelXp = 1500;
  const progressPercent = (xp / nextLevelXp) * 100;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="gradient-bg-animation absolute inset-0 opacity-30 dark:opacity-20" />
        <div className="gradient-orb gradient-orb-1" />
        <div className="gradient-orb gradient-orb-2" />
        <div className="gradient-orb gradient-orb-3" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-chart-2 to-chart-3 shadow-lg animate-gradient">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
              LearnQuest
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* XP Display */}
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-gradient-to-r from-chart-4/20 to-chart-4/10 border border-chart-4/30 px-4 py-2 backdrop-blur-sm">
              <Star className="h-4 w-4 text-chart-4" fill="currentColor" />
              <span className="font-semibold text-sm">{xp} XP</span>
            </div>
            
            {/* Streak Display */}
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-gradient-to-r from-chart-5/20 to-chart-5/10 border border-chart-5/30 px-4 py-2 backdrop-blur-sm">
              <Flame className="h-4 w-4 text-chart-5" fill="currentColor" />
              <span className="font-semibold text-sm">{streak} day streak</span>
            </div>
            
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 pt-20 pb-12 relative">
        <div className="mx-auto max-w-5xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 via-chart-2/10 to-chart-3/10 border border-primary/20 px-5 py-2.5 mb-4 backdrop-blur-sm animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
              AI-Powered Learning Platform
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight animate-fade-in-up">
            Master Anything with
            <span className="block mt-2 bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent animate-gradient">
              Interactive AI
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Personalized quizzes, interactive flashcards, and real-world examples. 
            Learn at your own pace with gamified experiences that make education exciting.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-fade-in-up animation-delay-400">
            <Link href="/create">
              <Button size="lg" className="gap-2 min-h-14 px-10 text-lg font-semibold bg-gradient-to-r from-primary via-chart-2 to-chart-3 hover:shadow-2xl hover:scale-105 transition-all duration-300 group animate-gradient" data-testid="button-start-learning">
                <Rocket className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                Start Learning Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="gap-2 min-h-14 px-10 text-lg font-semibold border-2 hover:bg-gradient-to-r hover:from-primary/10 hover:to-chart-2/10 hover:scale-105 transition-all duration-300 group" data-testid="button-login">
                <TrendingUp className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Sign In / Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container px-4 py-12">
        <Card className="mx-auto max-w-4xl bg-gradient-to-br from-card via-card to-accent/20 border-2 shadow-2xl hover:shadow-3xl transition-all duration-500 animate-fade-in-up animation-delay-600">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                  Level {level}
                </CardTitle>
                <CardDescription className="text-base mt-1">Keep learning to reach Level {level + 1}</CardDescription>
              </div>
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-chart-4 via-chart-5 to-primary shadow-lg animate-float">
                <Trophy className="h-10 w-10 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-base">{xp} / {nextLevelXp} XP</span>
                <span className="text-muted-foreground font-medium">{Math.round(progressPercent)}%</span>
              </div>
              <div className="relative">
                <Progress value={progressPercent} className="h-4 bg-gradient-to-r from-muted to-accent" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-chart-2 to-chart-3 rounded-full opacity-20 blur-sm" />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-chart-1/10 to-chart-1/5 border border-chart-1/20 hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold bg-gradient-to-br from-chart-1 to-chart-2 bg-clip-text text-transparent">{streak}</div>
                <div className="text-sm text-muted-foreground mt-1 font-medium">Day Streak</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-chart-2/10 to-chart-2/5 border border-chart-2/20 hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold bg-gradient-to-br from-chart-2 to-chart-3 bg-clip-text text-transparent">12</div>
                <div className="text-sm text-muted-foreground mt-1 font-medium">Topics Done</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-chart-3/10 to-chart-3/5 border border-chart-3/20 hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold bg-gradient-to-br from-chart-3 to-primary bg-clip-text text-transparent">48</div>
                <div className="text-sm text-muted-foreground mt-1 font-medium">Quizzes Passed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of learning with our AI-powered platform
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group hover:scale-105 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-card to-chart-1/5 border-2 hover:border-chart-1/50 animate-fade-in-up animation-delay-100">
              <CardHeader className="space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-chart-1 to-chart-2 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">AI-Generated Outlines</CardTitle>
                <CardDescription className="text-base">
                  Choose any topic and get a personalized learning path tailored to your level
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:scale-105 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-card to-chart-2/5 border-2 hover:border-chart-2/50 animate-fade-in-up animation-delay-200">
              <CardHeader className="space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-chart-2 to-chart-3 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Interactive Quizzes</CardTitle>
                <CardDescription className="text-base">
                  Test your knowledge with multiple choice and true/false questions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:scale-105 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-card to-chart-3/5 border-2 hover:border-chart-3/50 animate-fade-in-up animation-delay-300">
              <CardHeader className="space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-chart-3 to-primary shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Smart Flashcards</CardTitle>
                <CardDescription className="text-base">
                  Review key concepts with interactive flashcards and spaced repetition
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:scale-105 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-card to-chart-4/5 border-2 hover:border-chart-4/50 animate-fade-in-up animation-delay-400">
              <CardHeader className="space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-chart-4 to-chart-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Real-Life Examples</CardTitle>
                <CardDescription className="text-base">
                  Understand concepts better with practical examples and analogies
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:scale-105 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-card to-chart-5/5 border-2 hover:border-chart-5/50 animate-fade-in-up animation-delay-500">
              <CardHeader className="space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-chart-5 to-primary shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Track Progress</CardTitle>
                <CardDescription className="text-base">
                  Earn XP, maintain streaks, and watch your knowledge grow daily
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:scale-105 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-card to-primary/5 border-2 hover:border-primary/50 animate-fade-in-up animation-delay-600">
              <CardHeader className="space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-chart-1 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Earn Achievements</CardTitle>
                <CardDescription className="text-base">
                  Unlock badges and celebrate milestones as you master new skills
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-20">
        <Card className="mx-auto max-w-5xl bg-gradient-to-br from-primary/20 via-chart-2/15 to-chart-3/20 border-2 border-primary/30 shadow-3xl hover:shadow-4xl transition-all duration-500 overflow-hidden relative animate-fade-in-up animation-delay-700">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-chart-2/5 to-chart-3/5 animate-gradient" />
          <CardContent className="relative flex flex-col items-center gap-8 p-16 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary via-chart-2 to-chart-3 shadow-2xl animate-float">
              <GraduationCap className="h-12 w-12 text-white" />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                Ready to Start Learning?
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Pick a topic, choose your difficulty, and let AI create your personalized learning journey. 
                Join thousands of learners mastering new skills every day.
              </p>
            </div>
            <Link href="/create">
              <Button size="lg" className="gap-3 min-h-16 px-12 text-lg font-bold bg-gradient-to-r from-primary via-chart-2 to-chart-3 hover:shadow-2xl hover:scale-110 transition-all duration-300 group animate-gradient" data-testid="button-create-topic">
                <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                Create Your First Topic
                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container px-4 py-8 border-t">
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2024 LearnQuest. Empowering learners with AI.</p>
        </div>
      </footer>
    </div>
  );
}

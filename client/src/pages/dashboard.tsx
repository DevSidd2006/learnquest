import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserProgress, LearningSession } from "@shared/schema";
import { 
  Brain, 
  ArrowLeft, 
  Trophy,
  Flame,
  Star,
  Target,
  BookOpen,
  Zap,
  TrendingUp,
  Calendar,
  Award
} from "lucide-react";

export default function Dashboard() {
  const [, navigate] = useLocation();

  const { data: progress, isLoading: progressLoading } = useQuery<UserProgress>({
    queryKey: ["/api/progress"],
  });

  const { data: sessions, isLoading: sessionsLoading } = useQuery<LearningSession[]>({
    queryKey: ["/api/sessions"],
  });

  const isLoading = progressLoading || sessionsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between px-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-10" />
          </div>
        </header>
        <div className="container px-4 py-12">
          <div className="mx-auto max-w-6xl space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const currentLevel = Math.floor((progress?.totalXp || 0) / 300) + 1;
  const nextLevelXp = currentLevel * 300;
  const currentLevelProgress = ((progress?.totalXp || 0) % 300 / 300) * 100;

  const activeSessions = sessions?.filter(s => !s.completed) || [];
  const completedSessions = sessions?.filter(s => s.completed) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Progress Dashboard</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="container px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total XP</CardTitle>
                <Star className="h-4 w-4 text-chart-4 fill-current" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progress?.totalXp || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Level {currentLevel}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                <Flame className="h-4 w-4 text-chart-5 fill-current" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progress?.currentStreak || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Longest: {progress?.longestStreak || 0} days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Topics Completed</CardTitle>
                <Target className="h-4 w-4 text-chart-1" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progress?.completedTopics || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Keep learning!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quizzes Passed</CardTitle>
                <Zap className="h-4 w-4 text-chart-2" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progress?.quizzesCompleted || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {progress?.flashcardsReviewed || 0} flashcards reviewed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Level Progress */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Level {currentLevel}</CardTitle>
                  <CardDescription>
                    {nextLevelXp - (progress?.totalXp || 0)} XP to Level {currentLevel + 1}
                  </CardDescription>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                  <Trophy className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={currentLevelProgress} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                {progress?.totalXp || 0} / {nextLevelXp} XP
              </p>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          {activeSessions.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                Continue Learning
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {activeSessions.map((session) => {
                  const outline = JSON.parse(session.outline);
                  const progress = (session.currentStep / outline.subtopics.length) * 100;
                  
                  return (
                    <Card key={session.id} className="hover-elevate cursor-pointer transition-all" onClick={() => navigate(`/session/${session.id}`)}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1 flex-1">
                            <CardTitle className="text-xl">{outline.topic}</CardTitle>
                            <CardDescription>
                              {session.currentStep} of {outline.subtopics.length} completed
                            </CardDescription>
                          </div>
                          <Badge variant="outline">{session.difficulty}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Progress value={progress} className="h-2" />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed Sessions */}
          {completedSessions.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Award className="h-6 w-6 text-chart-1" />
                Completed Topics
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completedSessions.map((session) => {
                  const outline = JSON.parse(session.outline);
                  
                  return (
                    <Card key={session.id} className="border-chart-1/50">
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-chart-1">
                            <Trophy className="h-5 w-5 text-white" />
                          </div>
                          <div className="space-y-1">
                            <CardTitle className="text-lg">{outline.topic}</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-chart-1">
                              <Badge variant="outline" className="border-chart-1 text-chart-1">
                                Completed
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {sessions?.length === 0 && (
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">No Learning Sessions Yet</h3>
                  <p className="text-muted-foreground">
                    Start your learning journey by creating your first topic
                  </p>
                </div>
                <Button onClick={() => navigate("/create")} className="gap-2" data-testid="button-start-learning">
                  <Target className="h-4 w-4" />
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

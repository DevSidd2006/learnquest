import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import type { LearningSession, TopicOutline } from "@shared/schema";
import { 
  Brain, 
  ArrowLeft, 
  Clock,
  CheckCircle2,
  Circle,
  BookOpen,
  Zap,
  Target
} from "lucide-react";

export default function Session() {
  const [, params] = useRoute("/session/:id");
  const [, navigate] = useLocation();
  const sessionId = params?.id;

  const { data: session, isLoading } = useQuery<LearningSession>({
    queryKey: ["/api/sessions", sessionId],
    enabled: !!sessionId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background">
          <div className="container flex h-16 items-center justify-between px-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </header>
        <div className="container px-4 py-12">
          <div className="mx-auto max-w-4xl space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Session Not Found</CardTitle>
            <CardDescription>The learning session you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} data-testid="button-go-home">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const outline: TopicOutline = JSON.parse(session.outline);
  const progress = (session.currentStep / outline.subtopics.length) * 100;

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
              <span className="text-xl font-bold">LearnQuest</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="container px-4 py-8">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Topic Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="gap-1">
                <Target className="h-3 w-3" />
                {session.difficulty}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <BookOpen className="h-3 w-3" />
                {session.learningStyle}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {outline.estimatedTime}
              </Badge>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight">{outline.topic}</h1>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {session.currentStep} of {outline.subtopics.length} completed
                </span>
                <span className="text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          </div>

          {/* Subtopics List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Learning Path</h2>
            <div className="space-y-3">
              {outline.subtopics.map((subtopic, index) => {
                const isCompleted = index < session.currentStep;
                const isCurrent = index === session.currentStep;
                const isLocked = index > session.currentStep;

                return (
                  <Card 
                    key={subtopic.id}
                    className={`transition-all ${
                      isCurrent 
                        ? 'border-primary ring-2 ring-primary shadow-lg' 
                        : isCompleted 
                        ? 'border-chart-1' 
                        : 'opacity-60'
                    } ${isCurrent || isCompleted ? 'hover-elevate' : ''}`}
                  >
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                          isCompleted 
                            ? 'bg-chart-1 text-white' 
                            : isCurrent 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <span className="font-bold">{index + 1}</span>
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <CardTitle className="text-xl">{subtopic.title}</CardTitle>
                              <CardDescription>{subtopic.description}</CardDescription>
                            </div>
                            <Badge variant="outline" className="shrink-0">
                              <Clock className="h-3 w-3 mr-1" />
                              {subtopic.duration}
                            </Badge>
                          </div>
                          
                          {isCurrent && (
                            <div className="flex flex-wrap gap-2 pt-2">
                              <Button
                                onClick={() => navigate(`/concept/${sessionId}/${subtopic.id}`)}
                                className="gap-2"
                                data-testid={`button-learn-concept-${subtopic.id}`}
                              >
                                <BookOpen className="h-4 w-4" />
                                Learn Concept
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => navigate(`/quiz/${sessionId}/${subtopic.id}`)}
                                className="gap-2"
                                data-testid={`button-start-quiz-${subtopic.id}`}
                              >
                                <Zap className="h-4 w-4" />
                                Take Quiz
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => navigate(`/flashcards/${sessionId}/${subtopic.id}`)}
                                className="gap-2"
                                data-testid={`button-start-flashcards-${subtopic.id}`}
                              >
                                <Target className="h-4 w-4" />
                                Flashcards
                              </Button>
                            </div>
                          )}
                          
                          {isCompleted && (
                            <div className="flex items-center gap-2 text-sm text-chart-1">
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="font-medium">Completed</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

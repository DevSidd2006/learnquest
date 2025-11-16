import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import { TextToSpeech } from "@/components/text-to-speech";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { LearningSession, TopicOutline, Explanation } from "@shared/schema";
import { 
  Brain, 
  ArrowLeft, 
  BookOpen,
  Zap,
  Target,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Sparkles
} from "lucide-react";

export default function Concept() {
  const [, params] = useRoute("/concept/:sessionId/:subtopicId");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const sessionId = params?.sessionId;
  const subtopicId = params?.subtopicId;

  const { data: session, isLoading: sessionLoading } = useQuery<LearningSession>({
    queryKey: ["/api/sessions", sessionId],
    enabled: !!sessionId,
  });

  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [isExplanationLoading, setIsExplanationLoading] = useState(false);

  // Get current subtopic info
  const outline: TopicOutline | null = session ? JSON.parse(session.outline) : null;
  const currentSubtopic = outline?.subtopics.find(s => s.id === subtopicId);

  // Generate explanation when component loads
  const generateExplanation = async () => {
    if (!currentSubtopic || !session) return;
    
    setIsExplanationLoading(true);
    try {
      const response = await apiRequest("POST", "/api/explanation", {
        concept: currentSubtopic.title,
        context: `${outline?.topic} - ${currentSubtopic.description}`,
        difficulty: session.difficulty
      });
      const explanationData = await response.json() as Explanation;
      setExplanation(explanationData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate explanation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExplanationLoading(false);
    }
  };

  // Load explanation on mount
  useEffect(() => {
    if (currentSubtopic && session && !explanation && !isExplanationLoading) {
      generateExplanation();
    }
  }, [currentSubtopic, session, explanation, isExplanationLoading]);

  if (sessionLoading) {
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

  if (!session || !currentSubtopic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Content Not Found</CardTitle>
            <CardDescription>The learning content you're looking for doesn't exist.</CardDescription>
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/session/${sessionId}`)}
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
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Topic Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="gap-1">
                <Target className="h-3 w-3" />
                {session.difficulty}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Lightbulb className="h-3 w-3" />
                Concept Explanation
              </Badge>
            </div>
            
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold tracking-tight">{currentSubtopic.title}</h1>
                <p className="text-lg text-muted-foreground mt-2">{currentSubtopic.description}</p>
              </div>
              {explanation && (
                <TextToSpeech 
                  text={`${currentSubtopic.title}. ${currentSubtopic.description}. ${explanation.simpleExplanation}. ${explanation.analogy}. Real-world examples: ${explanation.realLifeExamples.join('. ')}. Key takeaways: ${explanation.keyTakeaways.join('. ')}`}
                  variant="default"
                  size="default"
                  showLabel={true}
                  className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 hover:shadow-lg animate-gradient shrink-0"
                />
              )}
            </div>
          </div>

          {/* Explanation Content */}
          {isExplanationLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ) : explanation ? (
            <div className="space-y-6">
              {/* Simple Explanation */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-chart-4" />
                      Understanding the Concept
                    </CardTitle>
                    <TextToSpeech 
                      text={explanation.simpleExplanation}
                      variant="ghost"
                      size="sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-relaxed">{explanation.simpleExplanation}</p>
                </CardContent>
              </Card>

              {/* Analogy */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-chart-2" />
                      Think of it Like This
                    </CardTitle>
                    <TextToSpeech 
                      text={explanation.analogy}
                      variant="ghost"
                      size="sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-relaxed italic">{explanation.analogy}</p>
                </CardContent>
              </Card>

              {/* Real-Life Examples */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-chart-1" />
                      Real-World Examples
                    </CardTitle>
                    <TextToSpeech 
                      text={`Real-world examples: ${explanation.realLifeExamples.join('. ')}`}
                      variant="ghost"
                      size="sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {explanation.realLifeExamples.map((example, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-chart-1 mt-0.5 shrink-0" />
                        <span className="text-base">{example}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Key Takeaways */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-chart-3" />
                      Key Takeaways
                    </CardTitle>
                    <TextToSpeech 
                      text={`Key takeaways: ${explanation.keyTakeaways.join('. ')}`}
                      variant="ghost"
                      size="sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {explanation.keyTakeaways.map((takeaway, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-chart-3/10 text-chart-3 text-sm font-bold mt-0.5 shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-base">{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Common Mistakes */}
              {explanation.commonMistakes && explanation.commonMistakes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-chart-5" />
                      Common Mistakes to Avoid
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {explanation.commonMistakes.map((mistake, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-chart-5 mt-0.5 shrink-0" />
                          <span className="text-base">{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Failed to Load Explanation</h3>
                  <p className="text-muted-foreground">
                    We couldn't generate the concept explanation. Please try again.
                  </p>
                </div>
                <Button onClick={generateExplanation}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          {explanation && (
            <Card className="bg-gradient-to-br from-primary/5 to-chart-1/5">
              <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Ready to Test Your Knowledge?</h3>
                  <p className="text-muted-foreground">
                    Now that you understand the concept, let's see how well you've learned it!
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button
                    onClick={() => navigate(`/quiz/${sessionId}/${subtopicId}`)}
                    className="gap-2"
                    data-testid="button-start-quiz"
                  >
                    <Zap className="h-4 w-4" />
                    Take Quiz
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/flashcards/${sessionId}/${subtopicId}`)}
                    className="gap-2"
                    data-testid="button-study-flashcards"
                  >
                    <BookOpen className="h-4 w-4" />
                    Study Flashcards
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
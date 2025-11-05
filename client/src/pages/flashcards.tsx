import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Flashcard } from "@shared/schema";
import { 
  Brain, 
  ArrowLeft, 
  ChevronLeft,
  ChevronRight,
  RotateCw,
  CheckCircle2,
  Lightbulb
} from "lucide-react";

export default function Flashcards() {
  const [, params] = useRoute("/flashcards/:sessionId/:subtopicId");
  const [, navigate] = useLocation();
  const sessionId = params?.sessionId;
  const subtopicId = params?.subtopicId;

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCards, setReviewedCards] = useState<Set<number>>(new Set());

  const { data: flashcards, isLoading } = useQuery<Flashcard[]>({
    queryKey: ["/api/flashcards", sessionId, subtopicId],
    enabled: !!sessionId && !!subtopicId,
  });

  const completeFlashcardsMutation = useMutation({
    mutationFn: async (data: { sessionId: string; subtopicId: string }) => {
      const response = await apiRequest("POST", "/api/flashcards/complete", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions", sessionId] });
      navigate(`/session/${sessionId}`);
    },
  });

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
          <div className="mx-auto max-w-3xl">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-lg font-medium mb-4">No flashcards available</p>
            <Button onClick={() => navigate(`/session/${sessionId}`)} data-testid="button-back-to-session">
              Back to Session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentCard = flashcards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / flashcards.length) * 100;
  const reviewedProgress = (reviewedCards.size / flashcards.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setReviewedCards(new Set(reviewedCards).add(currentCardIndex));
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleNext = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handleComplete = () => {
    completeFlashcardsMutation.mutate({
      sessionId: sessionId!,
      subtopicId: subtopicId!,
    });
  };

  const allReviewed = reviewedCards.size === flashcards.length;

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
              <span className="text-xl font-bold">Flashcards</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Flashcard Content */}
      <div className="container px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Progress */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                Card {currentCardIndex + 1} of {flashcards.length}
              </span>
              <Badge variant="outline" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {reviewedCards.size} reviewed
              </Badge>
            </div>
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <Progress value={reviewedProgress} className="h-2 bg-chart-1/20" />
            </div>
          </div>

          {/* Flashcard */}
          <div 
            className="relative min-h-[400px] md:min-h-[500px] cursor-pointer perspective-1000"
            onClick={handleFlip}
            data-testid="flashcard-container"
          >
            <Card 
              className={`absolute inset-0 transition-all duration-500 preserve-3d ${
                isFlipped ? '[transform:rotateY(180deg)]' : ''
              } hover:shadow-xl`}
              style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
              }}
            >
              <CardContent className="flex flex-col items-center justify-center h-full p-12 text-center min-h-[400px] md:min-h-[500px]">
                <div className="space-y-6 w-full">
                  <Badge variant="outline" className="mb-4">
                    {isFlipped ? 'Answer' : 'Question'}
                  </Badge>
                  
                  <p className="text-2xl md:text-3xl font-semibold leading-relaxed">
                    {isFlipped ? currentCard.back : currentCard.front}
                  </p>

                  {!isFlipped && currentCard.hint && (
                    <div className="pt-8">
                      <div className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2">
                        <Lightbulb className="h-4 w-4 text-chart-4" />
                        <span className="text-sm text-muted-foreground">{currentCard.hint}</span>
                      </div>
                    </div>
                  )}

                  {isFlipped && currentCard.example && (
                    <div className="pt-8">
                      <div className="rounded-lg bg-accent p-4 text-left">
                        <p className="text-sm font-semibold mb-2">Example:</p>
                        <p className="text-sm text-muted-foreground">{currentCard.example}</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFlip();
                      }}
                      data-testid="button-flip"
                    >
                      <RotateCw className="h-4 w-4" />
                      {isFlipped ? 'Show Question' : 'Show Answer'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Back side (hidden by default, shown when flipped) */}
            <Card 
              className={`absolute inset-0 transition-all duration-500 preserve-3d ${
                !isFlipped ? '[transform:rotateY(-180deg)]' : ''
              }`}
              style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
              }}
            >
              <CardContent className="flex flex-col items-center justify-center h-full p-12 text-center min-h-[400px] md:min-h-[500px]">
                <div className="space-y-6 w-full">
                  <Badge variant="outline" className="mb-4">Answer</Badge>
                  
                  <p className="text-2xl md:text-3xl font-semibold leading-relaxed">
                    {currentCard.back}
                  </p>

                  {currentCard.example && (
                    <div className="pt-8">
                      <div className="rounded-lg bg-accent p-4 text-left">
                        <p className="text-sm font-semibold mb-2">Example:</p>
                        <p className="text-sm text-muted-foreground">{currentCard.example}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentCardIndex === 0}
              className="gap-2"
              data-testid="button-previous"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {flashcards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentCardIndex(index);
                    setIsFlipped(false);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentCardIndex 
                      ? 'w-8 bg-primary' 
                      : reviewedCards.has(index)
                      ? 'w-2 bg-chart-1'
                      : 'w-2 bg-muted'
                  }`}
                  data-testid={`indicator-${index}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentCardIndex === flashcards.length - 1}
              className="gap-2"
              data-testid="button-next"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Complete Button */}
          {allReviewed && (
            <div className="pt-4 animate-slide-up">
              <Card className="border-2 border-chart-1 bg-chart-1/5">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-6 w-6 text-chart-1" />
                    <p className="text-lg font-semibold text-chart-1">
                      You've reviewed all flashcards!
                    </p>
                  </div>
                  <Button
                    onClick={handleComplete}
                    className="gap-2 min-h-12"
                    disabled={completeFlashcardsMutation.isPending}
                    data-testid="button-complete"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    Complete & Continue
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { QuizQuestion } from "@shared/schema";
import { 
  Brain, 
  ArrowLeft, 
  CheckCircle2,
  XCircle,
  Sparkles,
  Trophy,
  Flame
} from "lucide-react";

export default function Quiz() {
  const [, params] = useRoute("/quiz/:sessionId/:subtopicId");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const sessionId = params?.sessionId;
  const subtopicId = params?.subtopicId;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const { data: questions, isLoading } = useQuery<QuizQuestion[]>({
    queryKey: ["/api/quiz", sessionId, subtopicId],
    enabled: !!sessionId && !!subtopicId,
  });

  const submitQuizMutation = useMutation({
    mutationFn: async (data: { sessionId: string; subtopicId: string; score: number }) => {
      const response = await apiRequest("POST", "/api/quiz/submit", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions", sessionId] });
      setShowCelebration(true);
      setTimeout(() => {
        navigate(`/session/${sessionId}`);
      }, 3000);
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
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Questions Found</CardTitle>
            <CardDescription>Unable to load quiz questions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate(`/session/${sessionId}`)} data-testid="button-back-to-session">
              Back to Session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    
    setIsAnswered(true);
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      submitQuizMutation.mutate({
        sessionId: sessionId!,
        subtopicId: subtopicId!,
        score,
      });
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const isCorrect = isAnswered && selectedAnswer === currentQuestion.correctAnswer;
  const isIncorrect = isAnswered && selectedAnswer !== currentQuestion.correctAnswer;

  if (showCelebration) {
    const percentage = Math.round((score / questions.length) * 100);
    const xpEarned = score * 10;
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-lg w-full animate-bounce-in">
          <CardContent className="flex flex-col items-center gap-6 p-12 text-center">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary animate-pulse-success">
                <Trophy className="h-12 w-12 text-primary-foreground" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-8 w-8 text-chart-4 fill-current" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Quiz Complete!</h2>
              <p className="text-lg text-muted-foreground">
                You scored {score} out of {questions.length} ({percentage}%)
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-chart-4/10 px-6 py-3">
              <Flame className="h-5 w-5 text-chart-4 fill-current" />
              <span className="text-xl font-bold text-chart-4">+{xpEarned} XP</span>
            </div>

            <p className="text-sm text-muted-foreground">
              Redirecting to learning path...
            </p>
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
              <span className="text-xl font-bold">Quiz</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Quiz Content */}
      <div className="container px-4 py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <Badge variant="outline">
                Score: {score}/{questions.length}
              </Badge>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Question Card */}
          <Card className="border-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl leading-relaxed">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrectOption = option === currentQuestion.correctAnswer;
                    const showCorrect = isAnswered && isCorrectOption;
                    const showIncorrect = isAnswered && isSelected && !isCorrectOption;

                    return (
                      <Button
                        key={index}
                        variant={isSelected && !isAnswered ? 'default' : 'outline'}
                        className={`w-full min-h-14 justify-start text-left text-base px-4 transition-all ${
                          showCorrect ? 'border-chart-1 bg-chart-1/10 ring-2 ring-chart-1' :
                          showIncorrect ? 'border-destructive bg-destructive/10 ring-2 ring-destructive' :
                          isSelected && !isAnswered ? '' :
                          'hover-elevate'
                        }`}
                        onClick={() => handleAnswerSelect(option)}
                        disabled={isAnswered}
                        data-testid={`button-option-${index}`}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                            showCorrect ? 'border-chart-1 bg-chart-1' :
                            showIncorrect ? 'border-destructive bg-destructive' :
                            isSelected ? 'border-primary bg-primary' :
                            'border-muted-foreground'
                          }`}>
                            {showCorrect && <CheckCircle2 className="h-4 w-4 text-white" />}
                            {showIncorrect && <XCircle className="h-4 w-4 text-white" />}
                          </div>
                          <span className="flex-1">{option}</span>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'true-false' && (
                <div className="space-y-3">
                  {['True', 'False'].map((option) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrectOption = option === currentQuestion.correctAnswer;
                    const showCorrect = isAnswered && isCorrectOption;
                    const showIncorrect = isAnswered && isSelected && !isCorrectOption;

                    return (
                      <Button
                        key={option}
                        variant={isSelected && !isAnswered ? 'default' : 'outline'}
                        className={`w-full min-h-14 text-base ${
                          showCorrect ? 'border-chart-1 bg-chart-1/10 ring-2 ring-chart-1' :
                          showIncorrect ? 'border-destructive bg-destructive/10 ring-2 ring-destructive' :
                          'hover-elevate'
                        }`}
                        onClick={() => handleAnswerSelect(option)}
                        disabled={isAnswered}
                        data-testid={`button-${option.toLowerCase()}`}
                      >
                        {option}
                      </Button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feedback */}
          {isAnswered && (
            <Card className={`animate-slide-up border-2 ${
              isCorrect ? 'border-chart-1 bg-chart-1/5' : 'border-destructive bg-destructive/5'
            }`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="h-6 w-6 text-chart-1" />
                      <CardTitle className="text-chart-1">Correct!</CardTitle>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-6 w-6 text-destructive" />
                      <CardTitle className="text-destructive">Incorrect</CardTitle>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Explanation:</h4>
                  <p className="text-muted-foreground">{currentQuestion.explanation}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Real-Life Example:</h4>
                  <p className="text-muted-foreground">{currentQuestion.realLifeExample}</p>
                </div>

                <Button
                  onClick={handleNext}
                  className="w-full gap-2 min-h-12"
                  data-testid="button-next"
                >
                  {isLastQuestion ? (
                    <>
                      <Trophy className="h-5 w-5" />
                      Finish Quiz
                    </>
                  ) : (
                    <>
                      Continue
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Submit Answer Button */}
          {!isAnswered && (
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className="w-full gap-2 min-h-12"
              data-testid="button-submit-answer"
            >
              <CheckCircle2 className="h-5 w-5" />
              Submit Answer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

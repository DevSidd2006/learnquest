import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ThemeToggle } from "@/components/theme-toggle";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  ArrowLeft, 
  Sparkles,
  TrendingUp,
  Zap,
  Target,
  Loader2
} from "lucide-react";

export default function CreateTopic() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [learningStyle, setLearningStyle] = useState("visual");

  const createSessionMutation = useMutation({
    mutationFn: async (data: { topic: string; difficulty: string; learningStyle: string }) => {
      const response = await apiRequest("POST", "/api/sessions", data);
      return await response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Learning path created!",
        description: "Your personalized outline is ready.",
      });
      navigate(`/session/${data.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create learning session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter what you'd like to learn.",
        variant: "destructive",
      });
      return;
    }
    createSessionMutation.mutate({ topic, difficulty, learningStyle });
  };

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
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              data-testid="button-back"
              className="hover:scale-110 transition-transform"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-chart-2 to-chart-3 shadow-lg animate-gradient">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                LearnQuest
              </span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="container px-4 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Page Header */}
          <div className="text-center space-y-4 mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 via-chart-2/10 to-chart-3/10 border border-primary/20 px-5 py-2.5 mb-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                AI-Powered Learning
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
              What Would You Like to Learn?
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tell us your topic and preferences, and we'll create a personalized learning path just for you
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Card className="shadow-2xl border-2 bg-card/95 backdrop-blur-xl animate-fade-in-up animation-delay-200">
              <CardHeader>
                <CardTitle className="text-2xl">Create Your Learning Path</CardTitle>
                <CardDescription className="text-base">
                  Customize your learning experience based on your goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Topic Input */}
                <div className="space-y-2">
                  <Label htmlFor="topic" className="text-base font-semibold">
                    Topic
                  </Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Machine Learning, Spanish Grammar, Quantum Physics..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="text-base min-h-12"
                    data-testid="input-topic"
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter any subject you want to master
                  </p>
                </div>

                {/* Difficulty Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Difficulty Level</Label>
                  <RadioGroup value={difficulty} onValueChange={setDifficulty}>
                    <Card className={`cursor-pointer transition-all hover:scale-[1.02] ${difficulty === 'beginner' ? 'border-2 border-chart-1 bg-gradient-to-br from-chart-1/10 to-chart-1/5 shadow-lg' : 'hover:shadow-md'}`}>
                      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                        <RadioGroupItem value="beginner" id="beginner" data-testid="radio-beginner" />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-chart-1 to-chart-2 shadow-md">
                            <Target className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <Label htmlFor="beginner" className="text-base font-semibold cursor-pointer">
                              Beginner
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Start from the basics with simple explanations
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>

                    <Card className={`cursor-pointer transition-all hover:scale-[1.02] ${difficulty === 'intermediate' ? 'border-2 border-chart-2 bg-gradient-to-br from-chart-2/10 to-chart-2/5 shadow-lg' : 'hover:shadow-md'}`}>
                      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                        <RadioGroupItem value="intermediate" id="intermediate" data-testid="radio-intermediate" />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-chart-2 to-chart-3 shadow-md">
                            <TrendingUp className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <Label htmlFor="intermediate" className="text-base font-semibold cursor-pointer">
                              Intermediate
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Build on existing knowledge with deeper insights
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>

                    <Card className={`cursor-pointer transition-all hover:scale-[1.02] ${difficulty === 'advanced' ? 'border-2 border-chart-3 bg-gradient-to-br from-chart-3/10 to-chart-3/5 shadow-lg' : 'hover:shadow-md'}`}>
                      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                        <RadioGroupItem value="advanced" id="advanced" data-testid="radio-advanced" />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-chart-3 to-primary shadow-md">
                            <Zap className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <Label htmlFor="advanced" className="text-base font-semibold cursor-pointer">
                              Advanced
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Dive into complex concepts and expert-level content
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </RadioGroup>
                </div>

                {/* Learning Style */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Learning Style</Label>
                  <RadioGroup value={learningStyle} onValueChange={setLearningStyle}>
                    <Card className={`cursor-pointer transition-all ${learningStyle === 'visual' ? 'border-primary ring-2 ring-primary' : 'hover-elevate'}`}>
                      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                        <RadioGroupItem value="visual" id="visual" data-testid="radio-visual" />
                        <Label htmlFor="visual" className="text-base font-semibold cursor-pointer flex-1">
                          Visual - Diagrams, charts, and visual representations
                        </Label>
                      </CardHeader>
                    </Card>

                    <Card className={`cursor-pointer transition-all ${learningStyle === 'practical' ? 'border-primary ring-2 ring-primary' : 'hover-elevate'}`}>
                      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                        <RadioGroupItem value="practical" id="practical" data-testid="radio-practical" />
                        <Label htmlFor="practical" className="text-base font-semibold cursor-pointer flex-1">
                          Practical - Hands-on examples and real-world applications
                        </Label>
                      </CardHeader>
                    </Card>

                    <Card className={`cursor-pointer transition-all ${learningStyle === 'conceptual' ? 'border-primary ring-2 ring-primary' : 'hover-elevate'}`}>
                      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                        <RadioGroupItem value="conceptual" id="conceptual" data-testid="radio-conceptual" />
                        <Label htmlFor="conceptual" className="text-base font-semibold cursor-pointer flex-1">
                          Conceptual - Theory-focused with detailed explanations
                        </Label>
                      </CardHeader>
                    </Card>
                  </RadioGroup>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2 min-h-14 text-lg font-semibold bg-gradient-to-r from-primary via-chart-2 to-chart-3 hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-gradient"
                  disabled={createSessionMutation.isPending}
                  data-testid="button-generate-outline"
                >
                  {createSessionMutation.isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Generating Your Learning Path...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate Learning Path
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}

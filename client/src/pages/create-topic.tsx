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
      <div className="container px-4 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Page Header */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              What Would You Like to Learn?
            </h1>
            <p className="text-lg text-muted-foreground">
              Tell us your topic and preferences, and we'll create a personalized learning path just for you
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Create Your Learning Path</CardTitle>
                <CardDescription>
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
                    <Card className={`cursor-pointer transition-all ${difficulty === 'beginner' ? 'border-primary ring-2 ring-primary' : 'hover-elevate'}`}>
                      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                        <RadioGroupItem value="beginner" id="beginner" data-testid="radio-beginner" />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
                            <Target className="h-5 w-5 text-chart-1" />
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

                    <Card className={`cursor-pointer transition-all ${difficulty === 'intermediate' ? 'border-primary ring-2 ring-primary' : 'hover-elevate'}`}>
                      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                        <RadioGroupItem value="intermediate" id="intermediate" data-testid="radio-intermediate" />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
                            <TrendingUp className="h-5 w-5 text-chart-2" />
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

                    <Card className={`cursor-pointer transition-all ${difficulty === 'advanced' ? 'border-primary ring-2 ring-primary' : 'hover-elevate'}`}>
                      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                        <RadioGroupItem value="advanced" id="advanced" data-testid="radio-advanced" />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                            <Zap className="h-5 w-5 text-chart-3" />
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
                  className="w-full gap-2 min-h-12 text-base"
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

import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Loader2,
  Github,
  Chrome
} from "lucide-react";

export default function Login() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    username: "",
  });

  const authMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const response = await apiRequest("POST", endpoint, data);
      return await response.json();
    },
    onSuccess: (data: any) => {
      // Store session token
      localStorage.setItem("sessionToken", data.session.sessionToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      toast({
        title: isLogin ? "Welcome back!" : "Account created!",
        description: isLogin ? "You've been logged in successfully." : "Your account has been created and you're now logged in.",
      });
      
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Authentication Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      authMutation.mutate({
        email: formData.email,
        password: formData.password,
      });
    } else {
      authMutation.mutate({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      <header className="border-b bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-chart-2 to-chart-3 shadow-lg group-hover:scale-110 transition-transform animate-gradient">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                LearnQuest
              </span>
            </div>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="container px-4 py-12">
        <div className="mx-auto max-w-md">
          <Card className="shadow-2xl border-2 bg-card/95 backdrop-blur-xl animate-fade-in-up">
            <CardHeader className="text-center space-y-3">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                {isLogin ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <CardDescription className="text-base">
                {isLogin 
                  ? "Sign in to your LearnQuest account" 
                  : "Join LearnQuest and start your learning journey"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* OAuth Buttons */}
              <div className="space-y-3">
                <Button variant="outline" className="w-full gap-2 hover:bg-gradient-to-r hover:from-primary/10 hover:to-chart-2/10 transition-all duration-300" disabled>
                  <Chrome className="h-4 w-4" />
                  Continue with Google
                </Button>
                <Button variant="outline" className="w-full gap-2 hover:bg-gradient-to-r hover:from-chart-2/10 hover:to-chart-3/10 transition-all duration-300" disabled>
                  <Github className="h-4 w-4" />
                  Continue with GitHub
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required={!isLogin}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="username">Username (Optional)</Label>
                    <Input
                      id="username"
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2 bg-gradient-to-r from-primary via-chart-2 to-chart-3 hover:shadow-xl hover:scale-105 transition-all duration-300 animate-gradient"
                  disabled={authMutation.isPending}
                >
                  {authMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isLogin ? "Signing in..." : "Creating account..."}
                    </>
                  ) : (
                    <>
                      {isLogin ? "Sign In" : "Create Account"}
                    </>
                  )}
                </Button>
              </form>

              {/* Toggle Login/Register */}
              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </span>{" "}
                <button
                  type="button"
                  className="font-semibold bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent hover:underline"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </div>

              {/* Guest Access */}
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="w-full hover:bg-gradient-to-r hover:from-accent/50 hover:to-muted/50 transition-all duration-300"
                >
                  Continue as Guest
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
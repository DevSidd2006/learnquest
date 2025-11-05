import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/pages/home";
import Login from "@/pages/login";
import CreateTopic from "@/pages/create-topic";
import Session from "@/pages/session";
import Concept from "@/pages/concept";
import Quiz from "@/pages/quiz";
import Flashcards from "@/pages/flashcards";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/create" component={CreateTopic} />
      <Route path="/session/:id" component={Session} />
      <Route path="/concept/:sessionId/:subtopicId" component={Concept} />
      <Route path="/quiz/:sessionId/:subtopicId" component={Quiz} />
      <Route path="/flashcards/:sessionId/:subtopicId" component={Flashcards} />
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import YouTubePlayer from "@/components/YouTubePlayer";
import SpectatorPage from "./pages/spectator";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/spectator" component={SpectatorPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
      <YouTubePlayer />
    </QueryClientProvider>
  );
}

export default App;

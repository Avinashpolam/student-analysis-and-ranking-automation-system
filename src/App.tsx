import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import Dashboard from "@/pages/Dashboard";
import StudentsPage from "@/pages/StudentsPage";
import SubjectsPage from "@/pages/SubjectsPage";
import ScoresPage from "@/pages/ScoresPage";
import RankingsPage from "@/pages/RankingsPage";
import AuditPage from "@/pages/AuditPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppSidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/scores" element={<ScoresPage />} />
          <Route path="/rankings" element={<RankingsPage />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AiAssistant } from "@/components/ai-assistant";
import { AuthProvider } from "@/context/AuthContext";

import Home from "./pages/Home";
import Scholarships from "./pages/Scholarships";
import ScholarshipDetail from "./pages/ScholarshipDetail";
import Community from "./pages/Community";
import PostDetail from "./pages/PostDetail";
import Guides from "./pages/Guides";
import GuideDetail from "./pages/GuideDetail";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import StaticPage from "./pages/StaticPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/scholarships" element={<Scholarships />} />
                <Route path="/scholarships/:id" element={<ScholarshipDetail />} />
                <Route path="/community" element={<Community />} />
                <Route path="/community/:id" element={<PostDetail />} />
                <Route path="/guides" element={<Guides />} />
                <Route path="/guides/:id" element={<GuideDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/about" element={<StaticPage />} />
                <Route path="/faq" element={<StaticPage pageId="faq" />} />
                <Route path="/privacy" element={<StaticPage pageId="privacy" />} />
                <Route path="/terms" element={<StaticPage pageId="terms" />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <AiAssistant />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import PendingApproval from "./pages/PendingApproval";
import AdminApprovals from "./pages/AdminApprovals";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Admin from "./pages/Admin";
import UIShowcase from "./pages/UIShowcase";

// Product pages
import Features from "./pages/Features";
import UseCases from "./pages/UseCases";
import Pricing from "./pages/Pricing";
import Api from "./pages/Api";
import Integrations from "./pages/Integrations";

// Company pages
import About from "./pages/About";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";

// Support pages
import Contact from "./pages/Contact";

// Legal pages
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/pending-approval" element={<ProtectedRoute><PendingApproval /></ProtectedRoute>} />
            <Route path="/admin/approvals" element={<ProtectedRoute><AdminApprovals /></ProtectedRoute>} />
            <Route path="/app" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/ui-showcase" element={<UIShowcase />} />
            
            {/* Product pages */}
            <Route path="/features" element={<Features />} />
            <Route path="/use-cases" element={<UseCases />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/api" element={<Api />} />
            <Route path="/integrations" element={<Integrations />} />
            
            {/* Company pages */}
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/careers" element={<Careers />} />
            
            {/* Support pages */}
            <Route path="/contact" element={<Contact />} />
            
            {/* Legal pages */}
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

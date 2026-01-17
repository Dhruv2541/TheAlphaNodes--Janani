import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AudioPlayerProvider } from '@/contexts/AudioPlayerContext';
import AudioPlayer from '@/components/AudioPlayer';
import Index from "./pages/Index";
import Signup from "./pages/Signup";
import PersonalDetails from "./pages/PersonalDetails";
import Dashboard from "./pages/Dashboard";
import AgenticAction from "./pages/AgenticAction";
import AIChat from "./pages/AIChat";
import Calendar from "./pages/Calendar";
import Health from "./pages/Health";
import Profile from "./pages/Profile";
import EmergencyContacts from './pages/EmergencyContacts';
import SOSLog from './pages/SOSLog';
import PrenatalMusic from './pages/PrenatalMusic';
import PrenatalStories from './pages/PrenatalStories';
import NotFound from "./pages/NotFound";
import Debug from "./pages/Debug";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const DashboardRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, hasCompletedDetails } = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  if (!hasCompletedDetails) {
    return <Navigate to="/personal-details" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isLoggedIn, hasCompletedDetails } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          isLoggedIn 
            ? hasCompletedDetails 
              ? <Navigate to="/dashboard" replace /> 
              : <Navigate to="/personal-details" replace />
            : <Index />
        } 
      />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route 
        path="/personal-details" 
        element={
          <ProtectedRoute>
            <PersonalDetails />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <DashboardRoute>
            <Dashboard />
          </DashboardRoute>
        } 
      />
      <Route 
        path="/agentic-action" 
        element={
          <DashboardRoute>
            <AgenticAction />
          </DashboardRoute>
        } 
      />
      <Route 
        path="/ai-chat" 
        element={
          <DashboardRoute>
            <AIChat />
          </DashboardRoute>
        } 
      />
      <Route 
        path="/calendar" 
        element={
          <DashboardRoute>
            <Calendar />
          </DashboardRoute>
        } 
      />
      <Route 
        path="/health" 
        element={
          <DashboardRoute>
            <Health />
          </DashboardRoute>
        } 
      />
      <Route
        path="/prenatal-music"
        element={
          <DashboardRoute>
            <PrenatalMusic />
          </DashboardRoute>
        }
      />
      <Route
        path="/prenatal-stories"
        element={
          <DashboardRoute>
            <PrenatalStories />
          </DashboardRoute>
        }
      />
      <Route 
        path="/profile" 
        element={
          <DashboardRoute>
            <Profile />
          </DashboardRoute>
        } 
      />
      <Route
        path="/emergency-contacts"
        element={
          <DashboardRoute>
            <EmergencyContacts />
          </DashboardRoute>
        }
      />
      <Route
        path="/sos-log"
        element={
          <DashboardRoute>
            <SOSLog />
          </DashboardRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
      <Route path="/debug" element={<Debug />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <AudioPlayerProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
          <AudioPlayer />
        </AudioPlayerProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

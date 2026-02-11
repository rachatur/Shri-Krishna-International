import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Rooms from "./pages/Rooms";
import Bookings from "./pages/Bookings";
import SelfCheckin from "./pages/SelfCheckin";
import CounterCheckin from "./pages/CounterCheckin";
import CounterCheckout from "./pages/CounterCheckout";
import Billing from "./pages/Billing";
import Restaurant from "./pages/Restaurant";
import Inventory from "./pages/Inventory";
import Waste from "./pages/Waste";
import Laundry from "./pages/Laundry";
import TravelDesk from "./pages/TravelDesk";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
    <Route path="/rooms" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
    <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
    <Route path="/self-checkin" element={<ProtectedRoute><SelfCheckin /></ProtectedRoute>} />
    <Route path="/counter-checkin" element={<ProtectedRoute><CounterCheckin /></ProtectedRoute>} />
    <Route path="/counter-checkout" element={<ProtectedRoute><CounterCheckout /></ProtectedRoute>} />
    <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
    <Route path="/invoicing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
    <Route path="/bar" element={<ProtectedRoute><Restaurant /></ProtectedRoute>} />
    <Route path="/menu" element={<ProtectedRoute><Restaurant /></ProtectedRoute>} />
    <Route path="/room-service" element={<ProtectedRoute><Restaurant /></ProtectedRoute>} />
    <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
    <Route path="/waste" element={<ProtectedRoute><Waste /></ProtectedRoute>} />
    <Route path="/laundry" element={<ProtectedRoute><Laundry /></ProtectedRoute>} />
    <Route path="/travel-desk" element={<ProtectedRoute><TravelDesk /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

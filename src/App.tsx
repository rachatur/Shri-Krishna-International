import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/self-checkin" element={<SelfCheckin />} />
          <Route path="/counter-checkin" element={<CounterCheckin />} />
          <Route path="/counter-checkout" element={<CounterCheckout />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/invoicing" element={<Billing />} />
          <Route path="/bar" element={<Restaurant />} />
          <Route path="/menu" element={<Restaurant />} />
          <Route path="/room-service" element={<Restaurant />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/waste" element={<Waste />} />
          <Route path="/laundry" element={<Laundry />} />
          <Route path="/travel-desk" element={<TravelDesk />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

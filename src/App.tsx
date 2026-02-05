import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AppLayout } from "@/components/layout/AppLayout";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AIAssistant from "./pages/AIAssistant";
import Appointments from "./pages/Appointments";
import History from "./pages/History";
import AppointmentDetail from "./pages/AppointmentDetail";
import Profile from "./pages/Profile";
import SelectSpecialty from "./pages/booking/SelectSpecialty";
import SelectDoctor from "./pages/booking/SelectDoctor";
import SelectDateTime from "./pages/booking/SelectDateTime";
import Payment from "./pages/booking/Payment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* App Routes (Protected) */}
            <Route element={<AppLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/history" element={<History />} />
              <Route path="/appointment/:appointmentId" element={<AppointmentDetail />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Booking Flow */}
              <Route path="/book/specialty" element={<SelectSpecialty />} />
              <Route path="/book/doctor/:specialtyId" element={<SelectDoctor />} />
              <Route path="/book/datetime/:doctorId" element={<SelectDateTime />} />
              <Route path="/book/payment/:doctorId/:slotId" element={<Payment />} />
            </Route>
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

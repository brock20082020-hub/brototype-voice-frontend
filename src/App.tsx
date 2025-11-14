import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Auth from "./pages/Auth";
import Dashboard from "./pages/student/Dashboard";
import Submit from "./pages/student/Submit";
import StudentComplaints from "./pages/student/Complaints";
import StudentNotifications from "./pages/student/Notifications";
import ComplaintDetail from "./pages/student/ComplaintDetail";
import AdminDashboard from "./pages/admin/Dashboard";
import AssignedComplaints from "./pages/admin/AssignedComplaints";
import ResolvedComplaints from "./pages/admin/ResolvedComplaints";
import AdminNotifications from "./pages/admin/Notifications";
import AdminComplaintDetail from "./pages/admin/ComplaintDetail";
import StudentProfile from "./pages/student/Profile";
import StaffProfile from "./pages/admin/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/auth" replace />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/student/dashboard" element={<Dashboard />} />
              <Route path="/student/submit" element={<Submit />} />
              <Route path="/student/complaints" element={<StudentComplaints />} />
              <Route path="/student/notifications" element={<StudentNotifications />} />
              <Route path="/student/profile" element={<StudentProfile />} />
              <Route path="/student/:id" element={<ComplaintDetail />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/assigned" element={<AssignedComplaints />} />
              <Route path="/admin/resolved" element={<ResolvedComplaints />} />
              <Route path="/admin/notifications" element={<AdminNotifications />} />
              <Route path="/admin/profile" element={<StaffProfile />} />
              <Route path="/admin/:id" element={<AdminComplaintDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

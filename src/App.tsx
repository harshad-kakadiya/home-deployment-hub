import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import AppsListPage from "./pages/AppsListPage";
import AppDetailPage from "./pages/AppDetailPage";
import CreateAppPage from "./pages/CreateAppPage";
import DeploymentsPage from "./pages/DeploymentsPage";
import DomainsPage from "./pages/DomainsPage";
import MonitoringPage from "./pages/MonitoringPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/apps" element={<AppsListPage />} />
            <Route path="/apps/new" element={<CreateAppPage />} />
            <Route path="/apps/:id" element={<AppDetailPage />} />
            <Route path="/deployments" element={<DeploymentsPage />} />
            <Route path="/domains" element={<DomainsPage />} />
            <Route path="/monitoring" element={<MonitoringPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CompanyProvider } from "@/contexts/CompanyContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "@/pages/Index";
import "@/legacy.css";

const queryClient = new QueryClient();

const LegacyIndexRoute = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CompanyProvider>
        <Toaster />
        <Sonner />
        <Index />
      </CompanyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default LegacyIndexRoute;

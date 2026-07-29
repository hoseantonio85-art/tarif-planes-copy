import { lazy, Suspense } from "react";
import { Loader } from "@sber-orm/ui-kit";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TariffInfo from "@/pages/TariffInfo";

const LegacyIndexRoute = lazy(() => import("@/pages/LegacyIndexRoute"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// LOVABLE_KEEP_START
// Не изменять этот блок: специфическая настройка basename для GitHub Pages
const isGitHubPages = window.location.hostname.includes("github.io");
const basename = isGitHubPages ? "/tarif-planes-copy" : "";
// LOVABLE_KEEP_END
const App = () => (
  <Suspense fallback={<Loader />}>
    {/* LOVABLE_KEEP_START */}
    <BrowserRouter basename={basename}>
    {/* LOVABLE_KEEP_END */}
      <Routes>
        <Route path="/" element={<LegacyIndexRoute />} />
        <Route path="/tariff" element={<TariffInfo />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </Suspense>
);

export default App;

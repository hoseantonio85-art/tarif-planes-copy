import AppSidebar from "@/components/AppSidebar";
import AiInput from "@/components/AiInput";
import ActionButtons from "@/components/ActionButtons";
import NewsCarousel from "@/components/NewsCarousel";
import LimitUtilization from "@/components/LimitUtilization";
import EventsSection from "@/components/EventsSection";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[960px] mx-auto px-8 py-8 space-y-6">
          {/* Greeting */}
          <div className="mb-2">
            <h1 className="text-2xl font-semibold text-foreground leading-snug">
              — Привет, Кирилл! Меня зовут{" "}
              <span className="text-primary">Норм</span>.
              <br />
              Я твой{" "}
              <span className="text-primary">виртуальный помощник</span>.
            </h1>
          </div>

          {/* AI Input */}
          <AiInput />

          {/* Action buttons */}
          <ActionButtons />

          {/* News carousel */}
          <NewsCarousel />

          {/* Limit utilization */}
          <LimitUtilization />

          {/* Events */}
          <EventsSection />
        </div>
      </main>
    </div>
  );
};

export default Index;

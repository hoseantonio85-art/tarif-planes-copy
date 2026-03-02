import { ChevronRight } from "lucide-react";

interface EventCardProps {
  title: string;
  description: string;
  count: number;
  dotColor: string;
}

const EventCard = ({ title, description, count, dotColor }: EventCardProps) => (
  <div className="bg-card rounded-xl p-5">
    <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
    <p className="text-xs text-muted-foreground mb-4">{description}</p>
    <button className="flex items-center gap-2 text-xs font-medium text-foreground hover:text-primary">
      <span
        className="w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: dotColor }}
      />
      {count} события <ChevronRight size={14} />
    </button>
  </div>
);

const EventsSection = () => (
  <section>
    <h2 className="text-lg font-semibold text-foreground mb-4">
      Работа с событиями ⚡
    </h2>
    <div className="grid grid-cols-2 gap-3">
      <EventCard
        title="У тебя в работе"
        description="Не завершена работа над несколькими событиями."
        count={103}
        dotColor="hsl(var(--primary))"
      />
      <EventCard
        title="Появились новые задачи"
        description="Эти события требуют утверждения риск-менеджером."
        count={103}
        dotColor="hsl(var(--warning))"
      />
    </div>
  </section>
);

export default EventsSection;

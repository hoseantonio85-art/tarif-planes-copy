import { ArrowUp } from "lucide-react";

const ActionButtons = () => (
  <div className="grid grid-cols-2 gap-3">
    <button className="gradient-green text-primary-foreground rounded-xl px-5 py-3.5 flex items-center justify-between text-sm font-semibold hover:opacity-90 transition-opacity">
      <span>Зарегистрировать событие</span>
      <ArrowUp size={18} />
    </button>
    <button className="gradient-green text-primary-foreground rounded-xl px-5 py-3.5 flex items-center justify-between text-sm font-semibold hover:opacity-90 transition-opacity">
      <span>Запросить аналитику</span>
      <ArrowUp size={18} />
    </button>
  </div>
);

export default ActionButtons;

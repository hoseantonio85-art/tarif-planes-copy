import { Clipboard } from "lucide-react";

const AiInput = () => (
  <div className="gradient-accent rounded-2xl p-[2px]">
    <div className="bg-card rounded-2xl flex items-center gap-3 px-5 py-4">
      <Clipboard size={20} className="text-muted-foreground flex-shrink-0" />
      <span className="text-muted-foreground text-sm">Я твой ИИ помощник</span>
    </div>
  </div>
);

export default AiInput;

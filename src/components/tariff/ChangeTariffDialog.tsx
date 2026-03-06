import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChangeTariffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTariff: string;
  onSelect: (tariff: string) => void;
}

const tariffs = [
  { name: "Базовый", description: "До 10 пользователей, базовые модули" },
  { name: "Профессиональный", description: "До 20 пользователей, AI-агенты, аналитика" },
  { name: "Enterprise", description: "До 50 пользователей, все модули, приоритетная поддержка" },
  { name: "Кастомный тариф", description: "Индивидуальные условия по запросу" },
];

const ChangeTariffDialog = ({ open, onOpenChange, currentTariff, onSelect }: ChangeTariffDialogProps) => {
  const [selected, setSelected] = useState(currentTariff);

  const handleConfirm = () => {
    if (selected !== currentTariff) {
      onSelect(selected);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Изменить тариф</DialogTitle>
          <DialogDescription>Выберите новый тарифный план</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {tariffs.map((t) => (
            <button
              key={t.name}
              onClick={() => setSelected(t.name)}
              className={cn(
                "w-full text-left rounded-lg border p-4 transition-colors",
                selected === t.name
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                </div>
                {selected === t.name && <Check size={16} className="text-primary flex-shrink-0" />}
              </div>
            </button>
          ))}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
          <Button onClick={handleConfirm} disabled={selected === currentTariff}>
            Выбрать
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeTariffDialog;

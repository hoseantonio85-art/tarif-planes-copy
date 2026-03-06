import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export interface TariffChange {
  type: "module" | "tariff" | "users" | "ai_runs" | "subsidiary";
  label: string;
}

interface TariffChangesBannerProps {
  changes: TariffChange[];
  onSubmit: () => void;
}

const TariffChangesBanner = ({ changes, onSubmit }: TariffChangesBannerProps) => {
  if (changes.length === 0) return null;

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 px-5 py-4 flex items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <Info size={18} className="text-primary mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground">
            У вас есть изменения тарифа
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Изменения вступят в силу после оформления договора
          </p>
        </div>
      </div>
      <Button size="sm" onClick={onSubmit}>
        Отправить на оформление
      </Button>
    </div>
  );
};

export default TariffChangesBanner;

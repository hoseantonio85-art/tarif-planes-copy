import { cn } from "@/lib/utils";

interface TariffBadgeProps {
  tariff: string;
  status: "active" | "expiring" | "expired";
  className?: string;
}

const TariffBadge = ({ tariff, status, className }: TariffBadgeProps) => {
  const statusStyles = {
    active: "bg-primary/10 text-primary",
    expiring: "bg-orange-100 text-orange-600",
    expired: "bg-destructive/10 text-destructive",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium leading-tight",
        statusStyles[status],
        className
      )}
    >
      Тариф {tariff}
    </span>
  );
};

export default TariffBadge;

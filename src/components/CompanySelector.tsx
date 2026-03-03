import { useState } from "react";
import { useCompany, Company } from "@/contexts/CompanyContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import TariffBadge from "./TariffBadge";

interface CompanySelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CompanySelector = ({ open, onOpenChange }: CompanySelectorProps) => {
  const { selectedCompany, setSelectedCompany, companies } = useCompany();
  const [tempSelected, setTempSelected] = useState<Company>(selectedCompany);

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) setTempSelected(selectedCompany);
    onOpenChange(isOpen);
  };

  const handleConfirm = () => {
    setSelectedCompany(tempSelected);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Выбор компании</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-2">
          {companies.map((company) => (
            <button
              key={company.id}
              onClick={() => setTempSelected(company)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-colors ${
                tempSelected.id === company.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {company.name}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <TariffBadge tariff={company.tariff} status={company.tariffStatus} />
                </div>
              </div>
              {tempSelected.id === company.id && (
                <Check size={18} className="text-primary flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleConfirm}>Выбрать</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompanySelector;

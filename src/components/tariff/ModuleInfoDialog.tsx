import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ModuleInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleName: string | null;
  isAvailable: boolean;
  onConnect: (moduleName: string) => void;
}

const moduleDescriptions: Record<string, string> = {
  "Риски": "Управление реестром рисков, оценка вероятности и воздействия, матрица рисков.",
  "События": "Фиксация инцидентов и событий операционного риска, автоматическая классификация.",
  "Меры": "Планирование и отслеживание мер по снижению рисков, контроль исполнения.",
  "Аналитика": "Дашборды и отчёты, визуализация данных, экспорт в PDF и Excel.",
  "AI мониторинг": "Автоматический мониторинг рисков с помощью AI-агентов, алерты и рекомендации.",
  "Лимитная кампания": "Управление лимитами контрагентов, автоматический контроль превышений.",
  "База знаний": "Централизованное хранилище нормативных документов, шаблонов и методологий.",
};

const ModuleInfoDialog = ({ open, onOpenChange, moduleName, isAvailable, onConnect }: ModuleInfoDialogProps) => {
  if (!moduleName) return null;

  const description = moduleDescriptions[moduleName] || "Описание модуля недоступно.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{moduleName}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {!isAvailable && (
          <Button onClick={() => onConnect(moduleName)} className="w-full">
            Подключить модуль
          </Button>
        )}
        {isAvailable && (
          <p className="text-sm text-muted-foreground text-center py-2">
            Модуль подключён и доступен
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModuleInfoDialog;

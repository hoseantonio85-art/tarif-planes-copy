import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface DeactivatePopoverProps {
  userName: string;
  isActive: boolean;
  canActivate: boolean;
  availableLicenses: number;
  activeUsersCount: number;
  onToggle: (newState: boolean) => void;
}

const UserTogglePopover = ({
  userName,
  isActive,
  canActivate,
  availableLicenses,
  activeUsersCount,
  onToggle,
}: DeactivatePopoverProps) => {
  const [open, setOpen] = useState(false);

  const handleSwitchClick = () => {
    if (isActive) {
      setOpen(true);
    } else if (!canActivate) {
      setOpen(true);
    } else {
      onToggle(true);
    }
  };

  const handleDeactivate = () => {
    onToggle(false);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex-shrink-0">
          <Switch
            checked={isActive}
            onCheckedChange={handleSwitchClick}
            className="scale-90"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        {isActive ? (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Деактивировать пользователя?
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Он потеряет доступ к системе. История действий сохранится.
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Отмена
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDeactivate}>
                Деактивировать
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Невозможно активировать пользователя
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Доступно лицензий: {availableLicenses}
              </p>
              <p className="text-xs text-muted-foreground">
                Активных пользователей: {activeUsersCount}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Деактивируйте другого пользователя или докупите лицензии.
            </p>
            <Button size="sm" className="w-full" onClick={() => setOpen(false)}>
              Докупить лицензии
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default UserTogglePopover;

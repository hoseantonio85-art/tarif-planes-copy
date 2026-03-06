import { useNavigate } from "react-router-dom";
import { useCompany } from "@/contexts/CompanyContext";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Lock, Search, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import ChangeTariffDialog from "@/components/tariff/ChangeTariffDialog";
import ModuleInfoDialog from "@/components/tariff/ModuleInfoDialog";
import TariffChangesBanner, { type TariffChange } from "@/components/tariff/TariffChangesBanner";
import UserTogglePopover from "@/components/tariff/UserTogglePopover";

const TariffInfo = () => {
  const navigate = useNavigate();
  const { selectedCompany, updateCompanyUsers } = useCompany();
  const { toast } = useToast();
  const [userSearch, setUserSearch] = useState("");
  const [tariffDialogOpen, setTariffDialogOpen] = useState(false);
  const [moduleDialog, setModuleDialog] = useState<{ open: boolean; name: string | null; available: boolean }>({
    open: false, name: null, available: false,
  });
  const [pendingChanges, setPendingChanges] = useState<TariffChange[]>([]);

  const c = selectedCompany;

  const statusLabel = {
    active: "Активен",
    expiring: "Активен",
    expired: "Срок действия договора завершён",
  };

  const statusStyle = {
    active: "bg-primary/10 text-primary",
    expiring: "bg-primary/10 text-primary",
    expired: "bg-destructive/10 text-destructive",
  };

  const filteredUsers = c.users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const activeCount = c.users.filter(u => u.active).length;
  const availableLicenses = c.maxUsers - activeCount;

  const subscriptionCards = [
    {
      show: c.maxUsers > 0,
      label: "Активные пользователи",
      current: activeCount,
      max: c.maxUsers,
      sub: `Доступно ${c.maxUsers - activeCount} лицензий`,
      cta: "Докупить пользователей",
      changeType: "users" as const,
    },
    {
      show: c.maxAiRuns > 0,
      label: "Запуски AI-агентов",
      current: c.aiRuns,
      max: c.maxAiRuns,
      sub: `Осталось ${c.maxAiRuns - c.aiRuns} запусков`,
      cta: "Докупить запуски",
      changeType: "ai_runs" as const,
    },
    {
      show: c.maxSubsidiaries > 0,
      label: "Дочерние общества",
      current: c.subsidiaries,
      max: c.maxSubsidiaries,
      sub: `${c.subsidiaries} из ${c.maxSubsidiaries} подключённых`,
      cta: "Добавить компанию",
      changeType: "subsidiary" as const,
    },
  ].filter((card) => card.show);

  const handleUserToggle = useCallback((index: number, newState: boolean) => {
    const updatedUsers = [...c.users];
    updatedUsers[index] = { ...updatedUsers[index], active: newState };
    updateCompanyUsers(c.id, updatedUsers);
  }, [c.users, c.id, updateCompanyUsers]);

  const addChange = (change: TariffChange) => {
    setPendingChanges(prev => {
      if (prev.some(p => p.type === change.type && p.label === change.label)) return prev;
      return [...prev, change];
    });
  };

  const handleTariffSelect = (tariff: string) => {
    addChange({ type: "tariff", label: `Смена тарифа на «${tariff}»` });
  };

  const handleModuleConnect = (moduleName: string) => {
    addChange({ type: "module", label: `Подключение модуля «${moduleName}»` });
    setModuleDialog({ open: false, name: null, available: false });
  };

  const handleCtaClick = (changeType: TariffChange["type"], label: string) => {
    addChange({ type: changeType, label });
  };

  const handleSubmitChanges = () => {
    toast({
      title: "Заявка отправлена",
      description: "Изменения будут применены после оформления договора.",
    });
    setPendingChanges([]);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[800px] mx-auto px-8 py-8 space-y-6">
          {/* Back button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-muted-foreground -ml-2"
          >
            <ArrowLeft size={16} />
            Назад
          </Button>

          {/* Changes banner */}
          <TariffChangesBanner changes={pendingChanges} onSubmit={handleSubmitChanges} />

          {/* Header card */}
          <Card className="shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h1 className="text-xl font-semibold text-foreground">{c.name}</h1>
                  <p className="text-sm font-medium text-muted-foreground">Тариф {c.tariff}</p>
                  <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
                    Полная доступность к модулям и аналитике системы, использование AI-агентов в рамках установленного лимита.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="inline-flex items-center rounded-md bg-muted text-muted-foreground px-2.5 py-1 text-xs font-medium">
                      Договор № {c.contractNumber}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-muted text-muted-foreground px-2.5 py-1 text-xs font-medium">
                      С {c.contractStart}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-muted text-muted-foreground px-2.5 py-1 text-xs font-medium">
                      До {c.contractEnd}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md px-3 py-1 text-xs font-medium",
                      statusStyle[c.tariffStatus]
                    )}
                  >
                    {statusLabel[c.tariffStatus]}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => setTariffDialogOpen(true)}>
                    Изменить тариф
                  </Button>
                </div>
              </div>

              {c.tariffStatus === "expiring" && (
                <div className="mt-4 rounded-lg bg-orange-50 border border-orange-200 px-4 py-3">
                  <p className="text-sm text-orange-600 font-medium">
                    Договор действует до {c.contractEnd}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscription params */}
          {subscriptionCards.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-foreground mb-3">Параметры подписки</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {subscriptionCards.map((card) => (
                  <Card key={card.label}>
                    <CardContent className="p-5 space-y-3">
                      <p className="text-sm text-muted-foreground">{card.label}</p>
                      <div className="space-y-1.5">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-semibold text-foreground">{card.current}</span>
                          <span className="text-sm text-muted-foreground">из {card.max}</span>
                        </div>
                        <Progress value={(card.current / card.max) * 100} className="h-1.5" />
                      </div>
                      <p className="text-xs text-muted-foreground/70">{card.sub}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs h-8"
                        onClick={() => handleCtaClick(card.changeType, card.cta)}
                      >
                        {card.cta}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Available modules */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Доступные модули</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {c.availableModules.map((mod) => (
                <button
                  key={mod}
                  onClick={() => setModuleDialog({ open: true, name: mod, available: true })}
                  className="inline-flex items-center rounded-md bg-primary/10 text-primary px-3 py-1.5 text-sm font-medium hover:bg-primary/15 transition-colors cursor-pointer"
                >
                  {mod}
                </button>
              ))}
              {c.unavailableModules.map((mod) => (
                <button
                  key={mod}
                  onClick={() => setModuleDialog({ open: true, name: mod, available: false })}
                  className="inline-flex items-center gap-1.5 rounded-md bg-muted text-muted-foreground px-3 py-1.5 text-sm font-medium hover:bg-muted/80 transition-colors cursor-pointer"
                >
                  <Lock size={12} />
                  {mod}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Active users */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Активные пользователи — {activeCount} из {c.maxUsers}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {c.users.length > 10 && (
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Поиск по имени или роли…"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-9 h-9 text-sm"
                  />
                </div>
              )}
              <div className="max-h-[320px] overflow-y-auto space-y-0.5">
                {filteredUsers.map((user, i) => {
                  const realIndex = c.users.indexOf(user);
                  const initials = user.name.split(/[\s.]+/).filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase();
                  const avatarColors = [
                    "bg-blue-100 text-blue-700",
                    "bg-emerald-100 text-emerald-700",
                    "bg-violet-100 text-violet-700",
                    "bg-amber-100 text-amber-700",
                    "bg-rose-100 text-rose-700",
                    "bg-cyan-100 text-cyan-700",
                  ];
                  const colorClass = avatarColors[i % avatarColors.length];
                  return (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted/50",
                        !user.active && "opacity-50"
                      )}
                    >
                      <div className={cn("flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold", colorClass)}>
                        {initials}
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-medium text-foreground">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.role}</span>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
                          <span>Вход: {user.lastLogin}</span>
                          <span className="inline-flex items-center gap-1">
                            <Bot size={12} />
                            {user.aiRuns}
                          </span>
                        </div>
                        <UserTogglePopover
                          userName={user.name}
                          isActive={user.active}
                          canActivate={availableLicenses > 0}
                          availableLicenses={availableLicenses}
                          activeUsersCount={activeCount}
                          onToggle={(newState) => handleUserToggle(realIndex, newState)}
                        />
                      </div>
                    </div>
                  );
                })}
                {filteredUsers.length === 0 && (
                  <p className="text-sm text-muted-foreground px-3 py-2">Ничего не найдено</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Dialogs */}
      <ChangeTariffDialog
        open={tariffDialogOpen}
        onOpenChange={setTariffDialogOpen}
        currentTariff={c.tariff}
        onSelect={handleTariffSelect}
      />
      <ModuleInfoDialog
        open={moduleDialog.open}
        onOpenChange={(open) => setModuleDialog(prev => ({ ...prev, open }))}
        moduleName={moduleDialog.name}
        isAvailable={moduleDialog.available}
        onConnect={handleModuleConnect}
      />
    </div>
  );
};

export default TariffInfo;

import { useNavigate } from "react-router-dom";
import { useCompany } from "@/contexts/CompanyContext";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Lock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const TariffInfo = () => {
  const navigate = useNavigate();
  const { selectedCompany } = useCompany();
  const [userSearch, setUserSearch] = useState("");

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

  const subscriptionCards = [
    {
      show: c.maxUsers > 0,
      label: "Активные пользователи",
      current: c.activeUsers,
      max: c.maxUsers,
      sub: `Доступно ${c.maxUsers - c.activeUsers} лицензий`,
    },
    {
      show: c.maxAiRuns > 0,
      label: "Запуски AI-агентов",
      current: c.aiRuns,
      max: c.maxAiRuns,
      sub: `Осталось ${c.maxAiRuns - c.aiRuns} запусков`,
    },
    {
      show: c.maxSubsidiaries > 0,
      label: "Дочерние общества",
      current: c.subsidiaries,
      max: c.maxSubsidiaries,
      sub: `${c.subsidiaries} из ${c.maxSubsidiaries} подключённых`,
    },
  ].filter((card) => card.show);

  const contractFields = [
    { label: "Номер договора", value: c.contractNumber },
    { label: "Дата начала оказания услуг", value: c.contractStart },
    { label: "Дата окончания действия", value: c.contractEnd },
  ];

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

          {/* Header card */}
          <Card className="shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h1 className="text-xl font-semibold text-foreground">
                    {c.name}
                  </h1>
                  <p className="text-sm font-medium text-muted-foreground">
                    Тариф {c.tariff}
                  </p>
                  <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
                    Полная доступность к модулям и аналитике системы, использование AI-агентов в рамках установленного лимита.
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center rounded-md px-3 py-1 text-xs font-medium flex-shrink-0",
                    statusStyle[c.tariffStatus]
                  )}
                >
                  {statusLabel[c.tariffStatus]}
                </span>
              </div>

              {/* Expiring warning */}
              {c.tariffStatus === "expiring" && (
                <div className="mt-4 rounded-lg bg-orange-50 border border-orange-200 px-4 py-3">
                  <p className="text-sm text-orange-600 font-medium">
                    Договор действует до {c.contractEnd}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Block 1 — Subscription params */}
          {subscriptionCards.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-foreground mb-3">
                Параметры подписки
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {subscriptionCards.map((card) => (
                  <Card key={card.label}>
                    <CardContent className="p-5 space-y-3">
                      <p className="text-sm text-muted-foreground">{card.label}</p>
                      <div className="space-y-1.5">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-semibold text-foreground">
                            {card.current}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            из {card.max}
                          </span>
                        </div>
                        <Progress
                          value={(card.current / card.max) * 100}
                          className="h-2"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{card.sub}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Block 2 — Available modules */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Доступные модули</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {c.availableModules.map((mod) => (
                <span
                  key={mod}
                  className="inline-flex items-center rounded-md bg-primary/10 text-primary px-3 py-1.5 text-sm font-medium"
                >
                  {mod}
                </span>
              ))}
              {c.unavailableModules.map((mod) => (
                <span
                  key={mod}
                  className="inline-flex items-center gap-1.5 rounded-md bg-muted text-muted-foreground px-3 py-1.5 text-sm font-medium"
                >
                  <Lock size={12} />
                  {mod}
                </span>
              ))}
            </CardContent>
          </Card>

          {/* Block 3 — Active users */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Активные пользователи ({c.users.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {c.users.length > 10 && (
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    placeholder="Поиск по имени или роли…"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-9 h-9 text-sm"
                  />
                </div>
              )}
              <div className="max-h-[320px] overflow-y-auto space-y-0.5">
                {filteredUsers.map((user, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50"
                  >
                    <span className="text-xs text-muted-foreground w-5 text-right">
                      {i + 1}.
                    </span>
                    <span className="text-sm text-foreground">
                      {user.role} {user.name}
                    </span>
                  </div>
                ))}
                {filteredUsers.length === 0 && (
                  <p className="text-sm text-muted-foreground px-3 py-2">
                    Ничего не найдено
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Block 4 — Contract data */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Данные договора</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                {contractFields.map((field) => (
                  <div key={field.label} className="flex items-baseline gap-2">
                    <dt className="text-sm text-muted-foreground min-w-[220px]">
                      {field.label}
                    </dt>
                    <dd className="text-sm text-foreground font-medium">
                      {field.value || "—"}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TariffInfo;

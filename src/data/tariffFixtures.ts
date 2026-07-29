import type { TariffContract } from "@/@types/tariff";

export const SCENARIO_NOW = "2026-03-05T12:00:00.000Z";

const contractFixture: TariffContract = {
  tariffName: "Базовый",
  startsAt: "01.02.2026",
  endsAt: "31.12.2026",
  contractStatus: "active",
  contractNumber: "452-26С",
  maxPaidUsers: 4,
  companies: [
    { id: "petr", name: "ООО СК Пётр и ученики", current: true },
    { id: "volga", name: "АО Финансовая группа «Волга»" },
    { id: "ural", name: "ПАО «Уральский кредит»" },
    { id: "sever", name: "ООО «Северный контур»" },
    { id: "vector", name: "АО «Вектор развития»" },
    { id: "capital", name: "ООО «Столичный партнёр»" },
  ],
  modules: [
    {
      id: "risks",
      name: "Риски",
      description: "Реестр рисков, оценка и контроль динамики риск-профиля.",
      roleAvailable: true,
    },
    {
      id: "events",
      name: "События",
      roleAvailable: true,
    },
    {
      id: "measures",
      name: "Меры",
      description: "Планирование и контроль мероприятий по снижению рисков.",
      roleAvailable: true,
    },
    {
      id: "analytics",
      name: "Аналитика",
      description: "Сводные показатели и отчёты по данным компании.",
      roleAvailable: false,
    },
  ],
  users: [
    {
      id: "anna",
      fullName: "Анна Кузнецова",
      email: "anna.kuznetsova@example.ru",
      roleIds: ["ORMCLOUD_RISKMANAGER"],
      inTariff: true,
      status: "active",
      lastLogin: "05.03.2026",
    },
    {
      id: "alexander",
      fullName: "Александр Волков",
      email: "alexander.volkov@example.ru",
      roleIds: ["ORMCLOUD_COORDINATOR"],
      inTariff: true,
      status: "active",
      lastLogin: "04.03.2026",
    },
    {
      id: "ivan",
      fullName: "Иван Петров",
      email: "ivan.petrov@example.ru",
      roleIds: ["ORMCLOUD_USER"],
      inTariff: true,
      status: "active",
      lastLogin: "28.02.2026",
    },
    {
      id: "maria",
      fullName: "Мария Дмитриева",
      email: "maria.dmitrieva@example.ru",
      roleIds: ["ORMCLOUD_ANALYST"],
      inTariff: true,
      status: "deactivated",
      lastLogin: "15.12.2025",
    },
    {
      id: "oleg",
      fullName: "Олег Смирнов",
      email: "oleg.smirnov@example.ru",
      roleIds: ["ORMCLOUD_AUDITOR"],
      inTariff: false,
      status: "active",
      lastLogin: "01.03.2026",
    },
    {
      id: "elena",
      fullName: "Елена Тимофеева",
      email: "elena.timofeeva@example.ru",
      roleIds: ["ORMCLOUD_RISKMANAGER"],
      inTariff: true,
      status: "deactivated",
      lastLogin: "20.02.2026",
    },
    {
      id: "dmitry",
      fullName: "Дмитрий Лебедев",
      email: "dmitry.lebedev@example.ru",
      roleIds: ["ORMCLOUD_COORDINATOR"],
      inTariff: false,
      status: "deactivated",
      lastLogin: "10.11.2025",
    },
    {
      id: "natalia",
      fullName: "Наталья Романова",
      email: "natalia.romanova@example.ru",
      roleIds: ["ORMCLOUD_AUDITOR", "ORMCLOUD_USER"],
      inTariff: true,
      status: "active",
      lastLogin: "20.12.2025",
    },
  ],
};

export const createTariffFixture = (limitReached: boolean): TariffContract => ({
  ...contractFixture,
  maxPaidUsers: limitReached ? 3 : contractFixture.maxPaidUsers,
  companies: contractFixture.companies.map((company) => ({ ...company })),
  modules: contractFixture.modules.map((module) => ({ ...module })),
  users: contractFixture.users.map((user) => ({
    ...user,
    status:
      limitReached && user.id === "natalia" ? "deactivated" : user.status,
    roleIds: [...user.roleIds],
  })),
});

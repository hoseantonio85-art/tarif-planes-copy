import type { TariffCode, TariffContract, TariffDetails } from "@/@types/tariff";

export const SCENARIO_NOW = "2026-03-05T12:00:00.000Z";

type ContractFixtureBase = Omit<
  TariffContract,
  "tariffCode" | "tariffName" | "description" | "maxPaidUsers" | "details"
>;

const contractFixture: ContractFixtureBase = {
  startsAt: "01.02.2026",
  endsAt: "31.12.2026",
  contractStatus: "active",
  contractNumber: "452-26",
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
      description:
        "В данном разделе можно найти все риски компании. Здесь можно выявить новые риски при помощи ИИ-помощника, зарегистрировать их и получить рекомендации по снижению потерь. Данные о рисках представлены в виде карточек с подробной информацией, для оптимизации поиска можно воспользоваться быстрыми фильтрами. Внутри карточек можно внести корректировки и связать риск с подходящим событием или мерой.",
      includedInContract: true,
      roleAvailable: true,
    },
    {
      id: "events",
      name: "События",
      description:
        "В этом разделе регистрируются все события, возникшие в результате реализации идентифицированных рисков компании, с описанием обстоятельств, временных рамок и последствий. Здесь можно вводить информацию о событии, классифицировать его по профилю риска и причинам и регистрировать финансовый и нефинансовый ущерб с возможным возмещением.",
      includedInContract: true,
      roleAvailable: true,
    },
    {
      id: "measures",
      name: "Меры",
      description:
        "Здесь собраны все действия компании, направленные на снижение вероятности рисков и уменьшение последствий от их реализации. Перейдите в раздел, чтобы создать новые меры или связать существующие с событиями или рисками.",
      includedInContract: true,
      roleAvailable: true,
    },
    {
      id: "analytics",
      name: "Аналитика",
      description:
        "В этом разделе собраны дашборды и таблицы со сводной информацией по всем данным системы, которые можно скачать в удобном формате. Здесь можно отслеживать ключевые показатели, тренды и общую картину для принятия управленческих решений.",
      includedInContract: true,
      roleAvailable: true,
    },
    {
      id: "ai_assessment",
      name: "Оценка ИИ-решений",
      description:
        "В данном разделе можно получить подробную оценку рисков внедряемого в компанию ИИ-решения (ИИ-агента или LLM-приложения) и рекомендации по их снижению.",
      includedInContract: true,
      roleAvailable: true,
    },
    {
      id: "behavior_risks",
      name: "Поведенческие риски",
      description:
        "В этом разделе оценивается поведение продукта на предмет недобросовестных практик на ранних стадиях разработки или при внесении изменений. Здесь выявляются потенциальные риски, связанные с действиями продукта, чтобы своевременно их обнаружить и предотвратить до вывода на рынок.",
      includedInContract: true,
      roleAvailable: true,
    },
    {
      id: "counterparties",
      name: "Контрагенты",
      description:
        "Здесь проводится анализ рисков, связанных с контрагентами, условиями договора и дебиторской задолженностью.",
      includedInContract: true,
      roleAvailable: true,
    },
    {
      id: "ai_monitoring",
      name: "AI-мониторинг",
      description:
        "В этом разделе собираются новости из СМИ и изменения в законодательстве, которые могут повлиять на компанию и привести к появлению новых рисков, а также предлагаются рекомендации по мерам для выявленных угроз.",
      includedInContract: true,
      roleAvailable: true,
    },
    {
      id: "limit_campaign",
      name: "Лимитная кампания",
      description:
        "В этом разделе проводится согласование лимитов по рискам в рамках лимитной кампании и ребаджета.",
      includedInContract: true,
      roleAvailable: true,
    },
    {
      id: "knowledge_base",
      name: "База знаний",
      description:
        "Это централизованное хранилище документов компании, которые могут использоваться для оценки операционных рисков и консультаций по управлению рисками. Здесь можно загрузить файлы с информацией, которую система должна учитывать при анализе рисков.",
      includedInContract: true,
      roleAvailable: true,
    },
  ],
  users: [
    {
      id: "anna",
      fullName: "Кузнецова Анна Сергеевна",
      email: "anna.kuznetsova@example.ru",
      roleIds: ["ORMCLOUD_RISKMANAGER"],
      status: "active",
      lastLogin: "05.03.2026",
    },
    {
      id: "alexander",
      fullName: "Волков Александр Игоревич",
      email: "alexander.volkov@example.ru",
      roleIds: ["ORMCLOUD_COORDINATOR"],
      status: "active",
      lastLogin: "04.03.2026",
    },
    {
      id: "ivan",
      fullName: "Петров Иван Михайлович",
      email: "ivan.petrov@example.ru",
      roleIds: ["ORMCLOUD_USER"],
      status: "active",
      lastLogin: "28.02.2026",
    },
    {
      id: "maria",
      fullName: "Дмитриева Мария Алексеевна",
      email: "maria.dmitrieva@example.ru",
      roleIds: ["ORMCLOUD_ANALYST"],
      status: "deactivated",
      lastLogin: "15.12.2025",
    },
    {
      id: "oleg",
      fullName: "Смирнов Олег Викторович",
      email: "oleg.smirnov@example.ru",
      roleIds: ["ORMCLOUD_AUDITOR"],
      status: "active",
      lastLogin: "01.03.2026",
    },
    {
      id: "elena",
      fullName: "Тимофеева Елена Андреевна",
      email: "elena.timofeeva@example.ru",
      roleIds: ["ORMCLOUD_RISKMANAGER"],
      status: "deactivated",
      lastLogin: "20.02.2026",
    },
    {
      id: "dmitry",
      fullName: "Лебедев Дмитрий Павлович",
      email: "dmitry.lebedev@example.ru",
      roleIds: ["ORMCLOUD_COORDINATOR"],
      status: "deactivated",
      lastLogin: "10.11.2025",
    },
    {
      id: "natalia",
      fullName: "Романова Наталья Олеговна",
      email: "natalia.romanova@example.ru",
      roleIds: ["ORMCLOUD_AUDITOR", "ORMCLOUD_USER"],
      status: "active",
      lastLogin: "20.12.2025",
    },
  ],
};

const AI_SOLUTIONS: TariffDetails["aiSolutions"] = [
  {
    id: "assistant",
    title: "Цифровой помощник",
    description: "для консультаций и автоматизации процесса регистрации событий.",
  },
  {
    id: "analyst",
    title: "AI-агент «Аналитик»",
    description: "глубоко анализирует накопленные данные по событиям, примененным мерам и динамике рисков.",
  },
  {
    id: "methodologist",
    title: "AI-агент «Методолог»",
    description: "помогает ответить на вопросы о внутренних стандартах и нормативных документах компании.",
  },
  {
    id: "assessment",
    title: "AI-агенты «Оценка рисков», «Оценка ИИ-решений», «Оценка рисков поведения»",
    description: "оценивают ситуацию и предлагают оптимальные шаги для минимизации ущерба.",
  },
];

const TARIFF_CONTENT: Record<TariffCode, Pick<TariffContract, "tariffCode" | "tariffName" | "description" | "maxPaidUsers" | "details">> = {
  basic: {
    tariffCode: "basic",
    tariffName: "Базовый",
    description: "Доступ к основным разделам НОРМа и базовой аналитике, использование AI-решений в рамках установленного лимита",
    maxPaidUsers: 4,
    details: {
      userTerms: "В тариф включено не более 5 пользователей. При необходимости возможно приобрести дополнительный пакет ролей.",
      aiSolutions: AI_SOLUTIONS,
      support: "Тариф предусматривает базовую поддержку пользователей.",
    },
  },
  premium: {
    tariffCode: "premium",
    tariffName: "Премиум",
    description: "Полный доступ ко всем разделам НОРМа и аналитике без ограничений, неограниченное использование AI-решений",
    maxPaidUsers: null,
    details: {
      userTerms: "Неограниченное количество пользователей.",
      aiSolutions: AI_SOLUTIONS,
      support: "Данный тариф предусматривает поддержку пользователей.",
    },
  },
};

export const createTariffFixture = (
  limitReached: boolean,
  tariffCode: TariffCode = "basic",
): TariffContract => ({
  ...contractFixture,
  ...TARIFF_CONTENT[tariffCode],
  maxPaidUsers:
    tariffCode === "basic" && limitReached
      ? 2
      : TARIFF_CONTENT[tariffCode].maxPaidUsers,
  details: {
    ...TARIFF_CONTENT[tariffCode].details,
    aiSolutions: TARIFF_CONTENT[tariffCode].details.aiSolutions.map((solution) => ({
      ...solution,
    })),
  },
  companies: contractFixture.companies.map((company) => ({ ...company })),
  modules: contractFixture.modules.map((module) => ({
    ...module,
    includedInContract: true,
    roleAvailable: true,
  })),
  users: contractFixture.users.map((user) => ({
    ...user,
    roleIds: [...user.roleIds],
  })),
});

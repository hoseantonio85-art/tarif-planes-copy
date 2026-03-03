import { createContext, useContext, useState, ReactNode } from "react";

export interface Company {
  id: string;
  name: string;
  tariff: string;
  tariffStatus: "active" | "expiring" | "expired";
  contractNumber: string;
  contractStart: string;
  contractEnd: string;
  activeUsers: number;
  maxUsers: number;
  aiRuns: number;
  maxAiRuns: number;
  subsidiaries: number;
  maxSubsidiaries: number;
  availableModules: string[];
  unavailableModules: string[];
  users: { name: string; role: string }[];
}

const companies: Company[] = [
  {
    id: "1",
    name: "ООО СК Пётр и ученики",
    tariff: "Профессиональный",
    tariffStatus: "active",
    contractNumber: "452-26",
    contractStart: "01.02.2026",
    contractEnd: "31.12.2026",
    activeUsers: 15,
    maxUsers: 20,
    aiRuns: 13,
    maxAiRuns: 100,
    subsidiaries: 3,
    maxSubsidiaries: 5,
    availableModules: ["Риски", "События", "Меры", "Аналитика", "AI мониторинг"],
    unavailableModules: ["Лимитная кампания", "База знаний"],
    users: [
      { name: "Анна К.", role: "Риск-менеджер" },
      { name: "Саша В.", role: "Риск-координатор" },
      { name: "Иван П.", role: "Аналитик" },
      { name: "Мария Д.", role: "Риск-менеджер" },
      { name: "Олег С.", role: "Аудитор" },
      { name: "Елена Т.", role: "Риск-координатор" },
      { name: "Дмитрий Л.", role: "Аналитик" },
      { name: "Наталья Р.", role: "Риск-менеджер" },
      { name: "Алексей М.", role: "Координатор" },
      { name: "Светлана Б.", role: "Аналитик" },
      { name: "Павел Г.", role: "Риск-менеджер" },
      { name: "Ирина Н.", role: "Аудитор" },
      { name: "Виктор Ф.", role: "Координатор" },
      { name: "Юлия Х.", role: "Аналитик" },
      { name: "Андрей Ж.", role: "Риск-менеджер" },
    ],
  },
  {
    id: "2",
    name: "АО Финансовая Группа «Волга»",
    tariff: "Базовый",
    tariffStatus: "expiring",
    contractNumber: "318-25",
    contractStart: "15.03.2025",
    contractEnd: "15.04.2026",
    activeUsers: 5,
    maxUsers: 10,
    aiRuns: 42,
    maxAiRuns: 50,
    subsidiaries: 0,
    maxSubsidiaries: 0,
    availableModules: ["Риски", "События", "Меры"],
    unavailableModules: ["Аналитика", "AI мониторинг", "Лимитная кампания", "База знаний"],
    users: [
      { name: "Григорий А.", role: "Риск-менеджер" },
      { name: "Татьяна О.", role: "Координатор" },
      { name: "Роман Е.", role: "Аналитик" },
      { name: "Ольга В.", role: "Риск-менеджер" },
      { name: "Сергей К.", role: "Аудитор" },
    ],
  },
  {
    id: "3",
    name: "ПАО «Уральский кредит»",
    tariff: "Корпоративный",
    tariffStatus: "expired",
    contractNumber: "201-24",
    contractStart: "01.01.2024",
    contractEnd: "31.12.2025",
    activeUsers: 30,
    maxUsers: 50,
    aiRuns: 100,
    maxAiRuns: 500,
    subsidiaries: 8,
    maxSubsidiaries: 10,
    availableModules: ["Риски", "События", "Меры", "Аналитика", "AI мониторинг"],
    unavailableModules: [],
    users: [
      { name: "Кирилл М.", role: "Директор" },
      { name: "Вера Н.", role: "Риск-менеджер" },
      { name: "Максим П.", role: "Координатор" },
    ],
  },
];

interface CompanyContextType {
  selectedCompany: Company;
  setSelectedCompany: (company: Company) => void;
  companies: Company[];
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCompany, setSelectedCompany] = useState<Company>(companies[0]);

  return (
    <CompanyContext.Provider value={{ selectedCompany, setSelectedCompany, companies }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
  return ctx;
};

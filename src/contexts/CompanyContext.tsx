import { createContext, useContext, useState, ReactNode } from "react";

export interface CompanyUser {
  name: string;
  role: string;
  active: boolean;
  lastLogin: string;
  aiRuns: number;
}

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
  users: CompanyUser[];
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
      { name: "Анна К.", role: "Риск-менеджер", active: true, lastLogin: "05.03.2026", aiRuns: 3 },
      { name: "Саша В.", role: "Риск-координатор", active: true, lastLogin: "04.03.2026", aiRuns: 1 },
      { name: "Иван П.", role: "Аналитик", active: true, lastLogin: "05.03.2026", aiRuns: 5 },
      { name: "Мария Д.", role: "Риск-менеджер", active: true, lastLogin: "03.03.2026", aiRuns: 0 },
      { name: "Олег С.", role: "Аудитор", active: true, lastLogin: "01.03.2026", aiRuns: 2 },
      { name: "Елена Т.", role: "Риск-координатор", active: true, lastLogin: "05.03.2026", aiRuns: 0 },
      { name: "Дмитрий Л.", role: "Аналитик", active: true, lastLogin: "02.03.2026", aiRuns: 1 },
      { name: "Наталья Р.", role: "Риск-менеджер", active: true, lastLogin: "28.02.2026", aiRuns: 0 },
      { name: "Алексей М.", role: "Координатор", active: true, lastLogin: "04.03.2026", aiRuns: 1 },
      { name: "Светлана Б.", role: "Аналитик", active: false, lastLogin: "15.01.2026", aiRuns: 0 },
      { name: "Павел Г.", role: "Риск-менеджер", active: true, lastLogin: "05.03.2026", aiRuns: 0 },
      { name: "Ирина Н.", role: "Аудитор", active: true, lastLogin: "03.03.2026", aiRuns: 0 },
      { name: "Виктор Ф.", role: "Координатор", active: true, lastLogin: "01.03.2026", aiRuns: 0 },
      { name: "Юлия Х.", role: "Аналитик", active: true, lastLogin: "04.03.2026", aiRuns: 0 },
      { name: "Андрей Ж.", role: "Риск-менеджер", active: true, lastLogin: "05.03.2026", aiRuns: 0 },
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
      { name: "Григорий А.", role: "Риск-менеджер", active: true, lastLogin: "04.03.2026", aiRuns: 12 },
      { name: "Татьяна О.", role: "Координатор", active: true, lastLogin: "03.03.2026", aiRuns: 8 },
      { name: "Роман Е.", role: "Аналитик", active: true, lastLogin: "05.03.2026", aiRuns: 15 },
      { name: "Ольга В.", role: "Риск-менеджер", active: true, lastLogin: "01.03.2026", aiRuns: 5 },
      { name: "Сергей К.", role: "Аудитор", active: true, lastLogin: "28.02.2026", aiRuns: 2 },
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
      { name: "Кирилл М.", role: "Директор", active: true, lastLogin: "20.12.2025", aiRuns: 30 },
      { name: "Вера Н.", role: "Риск-менеджер", active: true, lastLogin: "18.12.2025", aiRuns: 45 },
      { name: "Максим П.", role: "Координатор", active: true, lastLogin: "19.12.2025", aiRuns: 25 },
    ],
  },
];

interface CompanyContextType {
  selectedCompany: Company;
  setSelectedCompany: (company: Company) => void;
  companies: Company[];
  updateCompanyUsers: (companyId: string, users: CompanyUser[]) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [allCompanies, setAllCompanies] = useState<Company[]>(companies);
  const [selectedCompany, setSelectedCompanyState] = useState<Company>(allCompanies[0]);

  const setSelectedCompany = (company: Company) => {
    setSelectedCompanyState(company);
  };

  const updateCompanyUsers = (companyId: string, users: CompanyUser[]) => {
    const activeCount = users.filter(u => u.active).length;
    setAllCompanies(prev => prev.map(c =>
      c.id === companyId ? { ...c, users, activeUsers: activeCount } : c
    ));
    if (selectedCompany.id === companyId) {
      setSelectedCompanyState(prev => ({ ...prev, users, activeUsers: activeCount }));
    }
  };

  return (
    <CompanyContext.Provider value={{ selectedCompany, setSelectedCompany, companies: allCompanies, updateCompanyUsers }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
  return ctx;
};

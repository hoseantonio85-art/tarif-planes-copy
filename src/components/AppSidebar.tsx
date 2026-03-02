import { useState } from "react";
import {
  Home,
  Zap,
  AlertTriangle,
  Shield,
  BarChart3,
  Brain,
  Target,
  BookOpen,
  ChevronLeft,
  Headphones,
  Building2,
  Menu,
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Главная", active: true },
  { icon: Zap, label: "События", active: false },
  { icon: AlertTriangle, label: "Риски", active: false },
  { icon: Shield, label: "Меры", active: false },
  { icon: BarChart3, label: "Аналитика", active: false },
  { icon: Brain, label: "AI мониторинг", active: false },
  { icon: Target, label: "Лимитная кампания", active: false },
  { icon: BookOpen, label: "База знаний", active: false },
];

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col h-screen bg-card border-r border-border transition-all duration-300 ${
        collapsed ? "w-[68px]" : "w-[240px]"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="w-8 h-8 rounded-lg gradient-green flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2L2 9L9 16L16 9L9 2Z" fill="white" />
          </svg>
        </div>
        {!collapsed && (
          <span className="text-lg font-bold text-foreground tracking-tight">
            НОРМ
          </span>
        )}
      </div>

      {/* Organization selector */}
      <div className="px-3 mb-2">
        <div className={`flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-sidebar-hover cursor-pointer ${collapsed ? "justify-center" : ""}`}>
          <Building2 size={18} className="text-muted-foreground flex-shrink-0" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground">Организация</div>
              <div className="text-sm text-foreground truncate">Не выбрана</div>
            </div>
          )}
          {!collapsed && <Menu size={16} className="text-muted-foreground flex-shrink-0" />}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              item.active
                ? "text-primary bg-primary/5"
                : "text-sidebar-foreground hover:bg-sidebar-hover"
            } ${collapsed ? "justify-center" : ""}`}
          >
            <item.icon size={20} className="flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-3 space-y-1">
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-xs font-semibold text-muted-foreground">
            ME
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground truncate">
                Михайлова Екатерина
              </div>
              <div className="text-xs text-muted-foreground truncate">
                Риск-менеджер (ЦА)
              </div>
            </div>
          )}
        </div>

        <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-hover ${collapsed ? "justify-center" : ""}`}>
          <Headphones size={20} className="flex-shrink-0" />
          {!collapsed && <span>Служба поддержки</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-hover ${collapsed ? "justify-center" : ""}`}
        >
          <ChevronLeft
            size={20}
            className={`flex-shrink-0 transition-transform ${collapsed ? "rotate-180" : ""}`}
          />
          {!collapsed && <span>Свернуть</span>}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;

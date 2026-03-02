interface DonutProps {
  percentage: number;
  color: string;
  size?: number;
}

const DonutChart = ({ percentage, color, size = 72 }: DonutProps) => {
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-foreground">
        {percentage}%
      </div>
    </div>
  );
};

interface LimitCardProps {
  title: string;
  amount: string;
  total: string;
  monthly: string;
  percentage: number;
  color: string;
}

const LimitCard = ({ title, amount, total, monthly, percentage, color }: LimitCardProps) => (
  <div className="bg-card rounded-xl p-5 flex items-center justify-between">
    <div>
      <div className="text-sm text-muted-foreground mb-2">{title}</div>
      <div className="text-xl font-bold text-foreground">
        {amount} <span className="text-sm font-normal text-muted-foreground">из {total}</span>
      </div>
      <div className="text-xs text-muted-foreground mt-1">{monthly}</div>
    </div>
    <DonutChart percentage={percentage} color={color} />
  </div>
);

const limits = [
  {
    title: "Прямые потери",
    amount: "142 500 ₽",
    total: "1 000 000",
    monthly: "16 320 ₽ за май",
    percentage: 50,
    color: "hsl(36, 100%, 55%)",
  },
  {
    title: "Косвенные потери",
    amount: "142 500 ₽",
    total: "1 000 000",
    monthly: "16 320 ₽ за май",
    percentage: 85,
    color: "hsl(0, 75%, 55%)",
  },
  {
    title: "Кредитные потери",
    amount: "142 500 ₽",
    total: "1 000 000",
    monthly: "16 320 ₽ за май",
    percentage: 49,
    color: "hsl(175, 60%, 50%)",
  },
];

const LimitUtilization = () => (
  <section>
    <h2 className="text-lg font-semibold text-foreground mb-4">
      Утилизация лимита 🔥
    </h2>
    <div className="grid grid-cols-3 gap-3">
      {limits.map((l, i) => (
        <LimitCard key={i} {...l} />
      ))}
    </div>
  </section>
);

export default LimitUtilization;

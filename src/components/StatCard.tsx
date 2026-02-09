import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
  variant?: "default" | "accent" | "success" | "warning" | "info";
}

const variantStyles = {
  default: "bg-card border border-border",
  accent: "bg-accent/10 border border-accent/20",
  success: "bg-success/10 border border-success/20",
  warning: "bg-warning/10 border border-warning/20",
  info: "bg-info/10 border border-info/20",
};

const iconBgStyles = {
  default: "bg-secondary text-foreground",
  accent: "bg-accent/20 text-accent-foreground",
  success: "bg-success/20 text-success",
  warning: "bg-warning/20 text-warning",
  info: "bg-info/20 text-info",
};

export function StatCard({ title, value, subtitle, icon, trend, variant = "default" }: StatCardProps) {
  return (
    <div className={cn("rounded-xl p-5 shadow-card transition-all hover:shadow-elevated", variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 font-display text-2xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <p className={cn("mt-1 text-xs font-medium", trend.positive ? "text-success" : "text-destructive")}>
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", iconBgStyles[variant])}>
          {icon}
        </div>
      </div>
    </div>
  );
}

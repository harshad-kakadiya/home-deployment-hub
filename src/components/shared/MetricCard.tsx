import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  className?: string;
  variant?: "default" | "success" | "warning" | "danger";
}

const variantStyles = {
  default: "text-foreground",
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
};

export function MetricCard({ title, value, subtitle, icon: Icon, trend, className, variant = "default" }: MetricCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/20", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2">
        <span className={cn("text-2xl font-bold tracking-tight", variantStyles[variant])}>
          {value}
        </span>
        {subtitle && (
          <span className="ml-1 text-sm text-muted-foreground">{subtitle}</span>
        )}
      </div>
      {trend && (
        <div className="mt-1 text-xs text-muted-foreground">
          <span className={cn(trend.value >= 0 ? "text-success" : "text-destructive")}>
            {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>{" "}
          {trend.label}
        </div>
      )}
    </div>
  );
}

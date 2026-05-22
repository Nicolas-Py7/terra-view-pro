import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  trend,
  accent = "primary",
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  unit?: string;
  trend?: string;
  accent?: "primary" | "accent" | "warning" | "destructive";
}) {
  const accentMap = {
    primary: "text-primary bg-primary/10",
    accent: "text-accent bg-accent/10",
    warning: "text-warning bg-warning/10",
    destructive: "text-destructive bg-destructive/10",
  };
  return (
    <div className="glass group relative overflow-hidden rounded-2xl p-5 transition hover:-translate-y-0.5 hover:glow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-semibold tracking-tight">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {trend && (
            <p className="mt-2 text-xs text-muted-foreground">
              <span className="text-primary">{trend}</span> vs. ontem
            </p>
          )}
        </div>
        <div className={cn("rounded-xl p-2.5", accentMap[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition group-hover:bg-primary/20" />
    </div>
  );
}

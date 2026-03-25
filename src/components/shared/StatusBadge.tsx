import { cn } from "@/lib/utils";
import type { AppStatus, DeploymentStatus, SSLStatus, DomainVerificationStatus } from "@/types";

const statusConfig: Record<string, { label: string; className: string }> = {
  running: { label: "Running", className: "bg-success/15 text-success border-success/30" },
  stopped: { label: "Stopped", className: "bg-muted text-muted-foreground border-border" },
  failed: { label: "Failed", className: "bg-destructive/15 text-destructive border-destructive/30" },
  building: { label: "Building", className: "bg-warning/15 text-warning border-warning/30 animate-pulse-glow" },
  deploying: { label: "Deploying", className: "bg-info/15 text-info border-info/30 animate-pulse-glow" },
  success: { label: "Success", className: "bg-success/15 text-success border-success/30" },
  queued: { label: "Queued", className: "bg-muted text-muted-foreground border-border" },
  cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground border-border" },
  active: { label: "Active", className: "bg-success/15 text-success border-success/30" },
  pending: { label: "Pending", className: "bg-warning/15 text-warning border-warning/30" },
  expired: { label: "Expired", className: "bg-destructive/15 text-destructive border-destructive/30" },
  none: { label: "None", className: "bg-muted text-muted-foreground border-border" },
  verified: { label: "Verified", className: "bg-success/15 text-success border-success/30" },
};

interface StatusBadgeProps {
  status: AppStatus | DeploymentStatus | SSLStatus | DomainVerificationStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground border-border" };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}

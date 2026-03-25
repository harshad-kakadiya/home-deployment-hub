import { useEffect, useState } from "react";
import { Search, GitBranch, Rocket } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { CardSkeleton } from "@/components/shared/Skeletons";
import { fetchDeployments } from "@/services/api";
import type { Deployment, DeploymentStatus } from "@/types";
import { cn } from "@/lib/utils";

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DeploymentStatus | "all">("all");

  useEffect(() => {
    fetchDeployments().then((d) => {
      setDeployments(d);
      setLoading(false);
    });
  }, []);

  const filtered = deployments.filter((d) => {
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    if (search && !d.appName.toLowerCase().includes(search.toLowerCase()) && !d.commitMessage.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Deployments</h1>
        <p className="text-sm text-muted-foreground">Deployment history across all applications</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search deployments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-1">
          {(["all", "success", "failed", "building", "queued", "cancelled"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                statusFilter === s ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-accent")}>
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} className="h-20" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No deployments found" description="Try adjusting your search or filters."
          icon={<Rocket className="h-6 w-6 text-muted-foreground" />} />
      ) : (
        <div className="space-y-3">
          {filtered.map((dep) => (
            <div key={dep.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/20 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <StatusBadge status={dep.status} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{dep.appName}</span>
                    <span className="text-xs text-muted-foreground">{dep.version}</span>
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{dep.commitMessage}</div>
                  <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="font-mono">{dep.commitHash}</span>
                    <span className="flex items-center gap-1"><GitBranch className="h-2.5 w-2.5" />{dep.branch}</span>
                    <span>{dep.triggerSource}</span>
                    <span>{dep.author}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {dep.duration !== null && <span>{dep.duration}s</span>}
                <span>{new Date(dep.startedAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

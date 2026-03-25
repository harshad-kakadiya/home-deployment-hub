import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { CardSkeleton } from "@/components/shared/Skeletons";
import { fetchApps } from "@/services/api";
import type { App, AppStatus } from "@/types";
import { cn } from "@/lib/utils";

export default function AppsListPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"name" | "status" | "date">("date");

  useEffect(() => {
    fetchApps().then((a) => {
      setApps(a);
      setLoading(false);
    });
  }, []);

  const filtered = apps
    .filter((a) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "status") return a.status.localeCompare(b.status);
      return new Date(b.lastDeployedAt).getTime() - new Date(a.lastDeployedAt).getTime();
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
          <p className="text-sm text-muted-foreground">{apps.length} apps deployed on your server</p>
        </div>
        <Link to="/apps/new">
          <Button size="sm">
            <Plus className="mr-1 h-3 w-3" />
            Create App
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search apps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1">
          {(["all", "running", "stopped", "failed", "building"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                statusFilter === s
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground"
        >
          <option value="date">Latest deploy</option>
          <option value="name">Name</option>
          <option value="status">Status</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} className="h-48" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No apps found"
          description={search ? "Try adjusting your search or filters." : "Deploy your first application to get started."}
          icon={<Box className="h-6 w-6 text-muted-foreground" />}
          action={
            !search && (
              <Link to="/apps/new">
                <Button size="sm"><Plus className="mr-1 h-3 w-3" />Create App</Button>
              </Link>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((app) => (
            <Link
              key={app.id}
              to={`/apps/${app.id}`}
              className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">{app.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{app.framework} • {app.runtime}</p>
                </div>
                <StatusBadge status={app.status} />
              </div>

              {app.domain && (
                <div className="mt-3 text-xs text-muted-foreground font-mono">{app.domain}</div>
              )}

              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3">
                <div>
                  <div className="text-[10px] text-muted-foreground">CPU</div>
                  <div className="text-xs font-medium">{app.cpuUsage}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">RAM</div>
                  <div className="text-xs font-medium">{app.ramUsage}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Disk</div>
                  <div className="text-xs font-medium">{app.diskUsage}%</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="font-mono">{app.gitRepo.split("/").pop()}</span>
                <span>{new Date(app.lastDeployedAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box, Play, Square, Cpu, MemoryStick, HardDrive, Globe, Rocket, ArrowRight, Plus, Activity,
} from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CardSkeleton } from "@/components/shared/Skeletons";
import { Button } from "@/components/ui/button";
import { fetchApps, fetchDeployments, fetchMetricsHistory, fetchNotifications } from "@/services/api";
import type { App, Deployment, ServerMetric, Notification } from "@/types";
import { cn } from "@/lib/utils";
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

export default function DashboardPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [metrics, setMetrics] = useState<ServerMetric[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchApps(),
      fetchDeployments(),
      fetchMetricsHistory(12),
      fetchNotifications(),
    ]).then(([a, d, m, n]) => {
      setApps(a);
      setDeployments(d);
      setMetrics(m);
      setNotifications(n);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  const running = apps.filter((a) => a.status === "running").length;
  const stopped = apps.filter((a) => a.status === "stopped").length;
  const latestCpu = metrics[metrics.length - 1]?.cpu || 0;
  const latestRam = metrics[metrics.length - 1]?.ram || 0;
  const latestDisk = metrics[metrics.length - 1]?.disk || 0;
  const activeDomains = apps.filter((a) => a.domain).length;

  const chartData = metrics.map((m) => ({
    time: new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    cpu: Math.round(m.cpu),
    ram: Math.round(m.ram),
    disk: Math.round(m.disk),
  }));

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your home server infrastructure
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/apps/new">
            <Button size="sm">
              <Plus className="mr-1 h-3 w-3" />
              New App
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard title="Total Apps" value={apps.length} icon={Box} />
        <MetricCard title="Running" value={running} icon={Play} variant="success" />
        <MetricCard title="Stopped" value={stopped} icon={Square} />
        <MetricCard title="Active Domains" value={activeDomains} icon={Globe} />
        <MetricCard title="CPU Usage" value={`${Math.round(latestCpu)}%`} icon={Cpu}
          variant={latestCpu > 80 ? "danger" : latestCpu > 60 ? "warning" : "default"} />
        <MetricCard title="RAM Usage" value={`${Math.round(latestRam)}%`} icon={MemoryStick}
          variant={latestRam > 80 ? "danger" : latestRam > 60 ? "warning" : "default"} />
        <MetricCard title="Disk Usage" value={`${Math.round(latestDisk)}%`} icon={HardDrive} />
        <MetricCard title="Deployments Today" value={deployments.filter(d => {
          const today = new Date().toDateString();
          return new Date(d.startedAt).toDateString() === today;
        }).length} icon={Rocket} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {(["cpu", "ram", "disk"] as const).map((key) => (
          <div key={key} className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {key.toUpperCase()} Trend (12h)
            </h3>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis domain={[0, 100]} hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={key}
                  stroke="hsl(var(--primary))"
                  fill={`url(#grad-${key})`}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent deployments */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold">Recent Deployments</h3>
            <Link to="/deployments" className="text-xs text-primary hover:underline">
              View all <ArrowRight className="ml-1 inline h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {deployments.slice(0, 5).map((dep) => (
              <div key={dep.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="text-sm font-medium">{dep.appName}</div>
                    <div className="text-xs text-muted-foreground font-mono">{dep.commitHash}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={dep.status} />
                  <span className="text-xs text-muted-foreground">
                    {new Date(dep.startedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold">Alerts & Activity</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="divide-y divide-border">
            {notifications.map((n) => (
              <div key={n.id} className={cn("flex items-start gap-3 px-4 py-3", !n.read && "bg-accent/30")}>
                <div className={cn(
                  "mt-1 h-2 w-2 shrink-0 rounded-full",
                  n.type === "error" && "bg-destructive",
                  n.type === "warning" && "bg-warning",
                  n.type === "success" && "bg-success",
                  n.type === "info" && "bg-info",
                )} />
                <div>
                  <div className="text-sm font-medium">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{n.message}</div>
                  <div className="mt-1 text-[10px] text-muted-foreground">
                    {new Date(n.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

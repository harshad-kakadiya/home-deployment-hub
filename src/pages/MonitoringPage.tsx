import { useEffect, useState } from "react";
import { Cpu, MemoryStick, HardDrive, Wifi, Thermometer, Container, RefreshCw } from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";
import { CardSkeleton } from "@/components/shared/Skeletons";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { fetchServerInfo, fetchMetricsHistory, fetchProcesses } from "@/services/api";
import type { ServerInfo, ServerMetric, ProcessInfo } from "@/types";
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from "recharts";

export default function MonitoringPage() {
  const [server, setServer] = useState<ServerInfo | null>(null);
  const [metrics, setMetrics] = useState<ServerMetric[]>([]);
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([fetchServerInfo(), fetchMetricsHistory(24), fetchProcesses()]).then(([s, m, p]) => {
      setServer(s);
      setMetrics(m);
      setProcesses(p);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  if (loading || !server) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  const latest = metrics[metrics.length - 1];
  const chartData = metrics.map((m) => ({
    time: new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    cpu: Math.round(m.cpu),
    ram: Math.round(m.ram),
    netIn: Math.round(m.networkIn),
    netOut: Math.round(m.networkOut),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Server Monitoring</h1>
          <p className="text-sm text-muted-foreground">{server.hostname} • {server.os} • Up {server.uptime}</p>
        </div>
        <Button variant="outline" size="sm" onClick={load}>
          <RefreshCw className="mr-1 h-3 w-3" />Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard title="CPU Usage" value={`${Math.round(latest?.cpu || 0)}%`} subtitle={server.cpuModel}
          icon={Cpu} variant={latest?.cpu > 80 ? "danger" : "default"} />
        <MetricCard title="RAM Usage" value={`${Math.round(latest?.ram || 0)}%`} subtitle={`${server.totalRam} GB Total`}
          icon={MemoryStick} variant={latest?.ram > 80 ? "danger" : "default"} />
        <MetricCard title="Disk Usage" value={`${Math.round(latest?.disk || 0)}%`} subtitle={`${server.totalDisk} GB Total`}
          icon={HardDrive} />
        <MetricCard title="Temperature" value={`${server.temperature}°C`} icon={Thermometer}
          variant={server.temperature > 70 ? "danger" : server.temperature > 60 ? "warning" : "default"} />
        <MetricCard title="Network In" value={`${Math.round(latest?.networkIn || 0)} MB/s`} icon={Wifi} />
        <MetricCard title="Network Out" value={`${Math.round(latest?.networkOut || 0)} MB/s`} icon={Wifi} />
        <MetricCard title="Containers" value={server.runningContainers} subtitle="running"
          icon={Container} variant="success" />
        <MetricCard title="Docker" value={server.dockerVersion} icon={Container} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[
          { title: "CPU & RAM (24h)", keys: [{ key: "cpu", color: "hsl(var(--primary))" }, { key: "ram", color: "hsl(var(--info))" }] },
          { title: "Network I/O (24h)", keys: [{ key: "netIn", color: "hsl(var(--success))" }, { key: "netOut", color: "hsl(var(--warning))" }] },
        ].map((chart) => (
          <div key={chart.title} className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{chart.title}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }} />
                {chart.keys.map((k) => (
                  <Area key={k.key} type="monotone" dataKey={k.key} stroke={k.color} fill={k.color} fillOpacity={0.1} strokeWidth={2} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Process table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold">Running Processes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-4 py-2 font-medium">PID</th>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">CPU</th>
                <th className="px-4 py-2 font-medium">RAM</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Uptime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {processes.map((p) => (
                <tr key={p.pid} className="text-sm hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{p.pid}</td>
                  <td className="px-4 py-2 font-medium">{p.name}</td>
                  <td className="px-4 py-2 font-mono text-xs">{p.cpu}%</td>
                  <td className="px-4 py-2 font-mono text-xs">{p.ram} GB</td>
                  <td className="px-4 py-2">
                    <StatusBadge status={p.status as any} />
                  </td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">{p.uptime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

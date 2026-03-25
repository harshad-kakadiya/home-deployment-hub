import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, RefreshCw, Square, Rocket, Globe, Shield, Clock, GitBranch,
  ExternalLink, Plus, Trash2, Edit, Eye, EyeOff, Copy, Check, Settings as SettingsIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MetricCard } from "@/components/shared/MetricCard";
import { LogViewer } from "@/components/shared/LogViewer";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageSkeleton } from "@/components/shared/Skeletons";
import {
  fetchApp, fetchDeployments, fetchLogs, fetchEnvVars, fetchDomains,
  restartApp, stopApp, redeployApp,
} from "@/services/api";
import type { App, Deployment, LogEntry, EnvironmentVariable, Domain } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AppDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<App | null>(null);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [envVars, setEnvVars] = useState<EnvironmentVariable[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetchApp(id),
      fetchDeployments(id),
      fetchLogs(id),
      fetchEnvVars(id),
      fetchDomains(id),
    ]).then(([a, d, l, e, dom]) => {
      setApp(a || null);
      setDeployments(d);
      setLogs(l);
      setEnvVars(e);
      setDomains(dom);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <PageSkeleton />;
  if (!app) {
    return (
      <EmptyState
        title="App not found"
        description="The application you're looking for doesn't exist."
        action={<Link to="/apps"><Button variant="outline" size="sm">Back to Apps</Button></Link>}
      />
    );
  }

  const handleAction = async (action: string) => {
    try {
      if (action === "restart") { await restartApp(app.id); toast.success("App restarted"); }
      if (action === "stop") { await stopApp(app.id); toast.success("App stopped"); }
      if (action === "redeploy") { await redeployApp(app.id); toast.success("Redeployment triggered"); }
    } catch {
      toast.error(`Failed to ${action} app`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link to="/apps">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">{app.name}</h1>
              <StatusBadge status={app.status} />
            </div>
            <p className="text-xs text-muted-foreground">{app.framework} • {app.runtime} • {app.currentVersion}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleAction("restart")}>
            <RefreshCw className="mr-1 h-3 w-3" />Restart
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleAction("stop")}>
            <Square className="mr-1 h-3 w-3" />Stop
          </Button>
          <Button size="sm" onClick={() => handleAction("redeploy")}>
            <Rocket className="mr-1 h-3 w-3" />Redeploy
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="env">Environment</TabsTrigger>
          <TabsTrigger value="domains">Domains</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* ─── Overview ─── */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <MetricCard title="Uptime" value={app.uptime} icon={Clock} variant="success" />
            <MetricCard title="CPU" value={`${app.cpuUsage}%`} icon={RefreshCw} />
            <MetricCard title="RAM" value={`${app.ramUsage}%`} icon={RefreshCw} />
            <MetricCard title="Disk" value={`${app.diskUsage}%`} icon={RefreshCw} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <h3 className="text-sm font-semibold">App Info</h3>
              {([
                ["Domain", app.domain || "—"],
                ["SSL", app.sslStatus],
                ["Git Repo", app.gitRepo],
                ["Branch", app.branch],
                ["Port", app.port.toString()],
                ["Version", app.currentVersion],
                ["Health Check", app.healthCheckUrl || "—"],
              ] as const).map(([label, value]) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-mono text-xs">{value}</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <h3 className="text-sm font-semibold">Health Check</h3>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-success animate-pulse-glow" />
                <span className="text-sm">Healthy</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Last checked: {new Date().toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                Endpoint: <span className="font-mono">{app.healthCheckUrl}</span>
              </div>
              <div className="text-xs text-muted-foreground">Response time: 12ms</div>
            </div>
          </div>
        </TabsContent>

        {/* ─── Deployments ─── */}
        <TabsContent value="deployments" className="mt-4">
          <div className="space-y-3">
            {deployments.length === 0 ? (
              <EmptyState title="No deployments" description="This app hasn't been deployed yet." />
            ) : (
              deployments.map((dep) => (
                <div key={dep.id} className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={dep.status} />
                    <div>
                      <div className="text-sm font-medium">{dep.commitMessage}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-mono">{dep.commitHash}</span>
                        <span>•</span>
                        <GitBranch className="h-3 w-3" />
                        <span>{dep.branch}</span>
                        <span>•</span>
                        <span>{dep.triggerSource}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {dep.duration && <span>{dep.duration}s</span>}
                    <span>{new Date(dep.startedAt).toLocaleString()}</span>
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => handleAction("redeploy")}>
                      Redeploy
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        {/* ─── Logs ─── */}
        <TabsContent value="logs" className="mt-4">
          <LogViewer logs={logs} />
        </TabsContent>

        {/* ─── Environment ─── */}
        <TabsContent value="env" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {envVars.length} environment variables configured
            </p>
            <Button size="sm" variant="outline">
              <Plus className="mr-1 h-3 w-3" />Add Variable
            </Button>
          </div>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            {envVars.map((env) => (
              <div key={env.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono font-medium">{env.key}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="max-w-[200px] truncate text-xs font-mono text-muted-foreground">
                    {env.isSecret && !showSecrets[env.id] ? "••••••••••••" : env.value}
                  </span>
                  {env.isSecret && (
                    <Button variant="ghost" size="icon" className="h-6 w-6"
                      onClick={() => setShowSecrets(s => ({ ...s, [env.id]: !s[env.id] }))}>
                      {showSecrets[env.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            ℹ️ Environment variables will be injected at runtime. Connect your backend API to manage them.
          </p>
        </TabsContent>

        {/* ─── Domains ─── */}
        <TabsContent value="domains" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{domains.length} domain(s) configured</p>
            <Button size="sm" variant="outline"><Plus className="mr-1 h-3 w-3" />Add Domain</Button>
          </div>
          {domains.length === 0 ? (
            <EmptyState title="No domains" description="Add a custom domain for this application." />
          ) : (
            <div className="space-y-3">
              {domains.map((dom) => (
                <div key={dom.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{dom.domain}</span>
                      {dom.isPrimary && (
                        <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                          Primary
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={dom.sslStatus} />
                      <StatusBadge status={dom.verificationStatus} />
                    </div>
                  </div>
                  {dom.dnsRecords.length > 0 && (
                    <div className="mt-3 rounded-lg bg-surface p-3">
                      <p className="mb-2 text-xs font-medium text-muted-foreground">DNS Records</p>
                      {dom.dnsRecords.map((rec, i) => (
                        <div key={i} className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                          <span className="w-12">{rec.type}</span>
                          <span>{rec.name}</span>
                          <span className="text-foreground">{rec.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ─── Settings ─── */}
        <TabsContent value="settings" className="mt-4 space-y-6">
          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <h3 className="text-sm font-semibold">Build & Run Configuration</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs text-muted-foreground">Build Command</label>
                <Input defaultValue={app.buildCommand} className="mt-1 font-mono text-xs" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Start Command</label>
                <Input defaultValue={app.startCommand} className="mt-1 font-mono text-xs" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Port</label>
                <Input defaultValue={app.port.toString()} className="mt-1 font-mono text-xs" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Root Directory</label>
                <Input defaultValue={app.rootDirectory} className="mt-1 font-mono text-xs" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <div className="text-sm font-medium">Auto Deploy</div>
                <div className="text-xs text-muted-foreground">Automatically deploy on git push</div>
              </div>
              <div className={cn(
                "relative h-5 w-10 cursor-pointer rounded-full transition-colors",
                app.autoDeploy ? "bg-primary" : "bg-muted"
              )}>
                <div className={cn(
                  "absolute top-0.5 h-4 w-4 rounded-full bg-primary-foreground transition-transform",
                  app.autoDeploy ? "left-5" : "left-0.5"
                )} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Branch:</span>
              <span className="text-sm font-mono">{app.branch}</span>
            </div>
            <Button size="sm">Save Changes</Button>
          </div>

          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-destructive">Danger Zone</h3>
            <p className="text-xs text-muted-foreground">
              Permanently delete this application and all associated data.
            </p>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-1 h-3 w-3" />Delete App
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

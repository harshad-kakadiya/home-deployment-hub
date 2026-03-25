import { Server, Database, Shield, HardDrive, Webhook, Key, Moon, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { mockServerInfo } from "@/data/mock-data";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Server configuration and preferences</p>
      </div>

      {/* Server info */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Server Information</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {([
            ["Hostname", mockServerInfo.hostname],
            ["OS", mockServerInfo.os],
            ["Kernel", mockServerInfo.kernel],
            ["Uptime", mockServerInfo.uptime],
            ["CPU", `${mockServerInfo.cpuModel} (${mockServerInfo.cpuCores} cores)`],
            ["RAM", `${mockServerInfo.totalRam} GB`],
            ["Disk", `${mockServerInfo.totalDisk} GB`],
            ["Docker", mockServerInfo.dockerVersion],
          ] as const).map(([label, value]) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-mono text-xs">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reverse proxy */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Reverse Proxy</h3>
        </div>
        <p className="text-xs text-muted-foreground">Configure Nginx/Caddy reverse proxy settings. Connect your backend API to manage these.</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs text-muted-foreground">Proxy Engine</label>
            <Input defaultValue="Nginx" className="mt-1" readOnly />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Config Path</label>
            <Input defaultValue="/etc/nginx/sites-enabled/" className="mt-1 font-mono text-xs" readOnly />
          </div>
        </div>
      </div>

      {/* Docker */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Docker Engine</h3>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="h-2 w-2 rounded-full bg-success" />
          <span>Docker Engine running — v{mockServerInfo.dockerVersion}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {mockServerInfo.runningContainers} containers running
        </p>
      </div>

      {/* Storage */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Storage Paths</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs text-muted-foreground">App Data</label>
            <Input defaultValue="/var/deploy/apps" className="mt-1 font-mono text-xs" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Backups</label>
            <Input defaultValue="/var/deploy/backups" className="mt-1 font-mono text-xs" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Logs</label>
            <Input defaultValue="/var/log/deploy" className="mt-1 font-mono text-xs" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">SSL Certificates</label>
            <Input defaultValue="/etc/letsencrypt/live" className="mt-1 font-mono text-xs" />
          </div>
        </div>
      </div>

      {/* Backup */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Backups</h3>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <div>
            <div className="text-sm font-medium">Auto Backup</div>
            <div className="text-xs text-muted-foreground">Daily backup of all app data at 3:00 AM</div>
          </div>
          <div className="relative h-5 w-10 rounded-full bg-primary">
            <div className="absolute left-5 top-0.5 h-4 w-4 rounded-full bg-primary-foreground" />
          </div>
        </div>
        <div className="text-xs text-muted-foreground">Last backup: 2026-03-25 03:00:00 • Size: 2.4 GB</div>
      </div>

      {/* Webhooks / API */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">API & Webhooks</h3>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">API Token</label>
          <div className="mt-1 flex gap-2">
            <Input defaultValue="dp_••••••••••••••••••••" className="font-mono text-xs" readOnly />
            <Button variant="outline" size="sm">Regenerate</Button>
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Webhook URL</label>
          <Input defaultValue="" placeholder="https://hooks.example.com/deploy" className="mt-1 font-mono text-xs" />
        </div>
        <p className="text-xs text-muted-foreground">
          ℹ️ Connect your backend API to enable webhook delivery and token management.
        </p>
      </div>

      {/* Profile */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Profile</h3>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Display Name</label>
          <Input defaultValue="Admin" className="mt-1" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Email</label>
          <Input defaultValue="admin@homelab.dev" className="mt-1" />
        </div>
        <Button size="sm">Save Profile</Button>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Globe, Plus, Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { CardSkeleton } from "@/components/shared/Skeletons";
import { fetchDomains } from "@/services/api";
import type { Domain } from "@/types";

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDomains().then((d) => {
      setDomains(d);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Domains</h1>
          <p className="text-sm text-muted-foreground">{domains.length} domains configured</p>
        </div>
        <Button size="sm"><Plus className="mr-1 h-3 w-3" />Add Domain</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} className="h-40" />)}
        </div>
      ) : domains.length === 0 ? (
        <EmptyState
          title="No domains configured"
          description="Add a custom domain to route traffic to your applications."
          icon={<Globe className="h-6 w-6 text-muted-foreground" />}
          action={<Button size="sm"><Plus className="mr-1 h-3 w-3" />Add Domain</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {domains.map((dom) => (
            <div key={dom.id} className="rounded-xl border border-border bg-card p-4 space-y-3 hover:border-primary/20 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">{dom.domain}</span>
                  {dom.isPrimary && (
                    <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">Primary</span>
                  )}
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>App: <span className="text-foreground font-medium">{dom.appName}</span></span>
                <span>Last checked: {new Date(dom.lastChecked).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">SSL:</span>
                <StatusBadge status={dom.sslStatus} />
                <span className="text-xs text-muted-foreground">DNS:</span>
                <StatusBadge status={dom.verificationStatus} />
              </div>

              {dom.dnsRecords.length > 0 && (
                <div className="rounded-lg bg-surface p-3">
                  <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">DNS Records</p>
                  {dom.dnsRecords.map((rec, i) => (
                    <div key={i} className="flex gap-4 text-xs font-mono text-muted-foreground">
                      <span className="w-14 text-foreground">{rec.type}</span>
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
    </div>
  );
}

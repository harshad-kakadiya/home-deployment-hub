import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createApp } from "@/services/api";
import { toast } from "sonner";

const steps = ["Basic Info", "Build & Run", "Domain", "Review"];

const frameworks = ["FastAPI", "Flask", "Django", "Express", "React", "Docker", "Go", "Rust"];
const sourceTypes = ["GitHub Repo", "Docker Image", "Manual Upload"];

export default function CreateAppPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [form, setForm] = useState({
    name: "",
    framework: "FastAPI",
    sourceType: "GitHub Repo",
    gitRepo: "",
    buildCommand: "",
    startCommand: "",
    port: "3000",
    envVars: "",
    domain: "",
    https: true,
    isPublic: true,
  });

  const update = (key: string, value: string | boolean) => setForm({ ...form, [key]: value });

  const handleDeploy = async () => {
    setDeploying(true);
    try {
      await createApp({
        name: form.name,
        framework: form.framework,
        gitRepo: form.gitRepo,
        buildCommand: form.buildCommand,
        startCommand: form.startCommand,
        port: parseInt(form.port),
      });
      setDeployed(true);
      toast.success("App deployment initiated!");
    } catch {
      toast.error("Failed to create app");
    } finally {
      setDeploying(false);
    }
  };

  if (deployed) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/15 glow-primary">
          <Check className="h-8 w-8 text-success" />
        </div>
        <h1 className="text-2xl font-bold">Deployment Initiated!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your app <span className="font-mono text-foreground">{form.name}</span> is being deployed.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={() => navigate("/apps")}>View Apps</Button>
          <Button onClick={() => navigate("/")}>Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold tracking-tight">Create New App</h1>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors",
                i < step && "bg-primary text-primary-foreground",
                i === step && "bg-primary/15 text-primary border border-primary",
                i > step && "bg-muted text-muted-foreground"
              )}
            >
              {i < step ? <Check className="h-3 w-3" /> : i + 1}
            </div>
            <span className={cn("hidden text-xs sm:block", i === step ? "text-foreground font-medium" : "text-muted-foreground")}>{s}</span>
            {i < steps.length - 1 && <div className="h-px w-8 bg-border" />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        {step === 0 && (
          <>
            <div>
              <label className="text-xs font-medium text-muted-foreground">App Name</label>
              <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="my-awesome-app" className="mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Framework / Runtime</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {frameworks.map((f) => (
                  <button key={f} onClick={() => update("framework", f)}
                    className={cn("rounded-lg border px-3 py-1.5 text-xs transition-colors",
                      form.framework === f ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent")}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Source</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {sourceTypes.map((s) => (
                  <button key={s} onClick={() => update("sourceType", s)}
                    className={cn("rounded-lg border px-3 py-1.5 text-xs transition-colors",
                      form.sourceType === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent")}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            {form.sourceType === "GitHub Repo" && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">Repository URL</label>
                <Input value={form.gitRepo} onChange={(e) => update("gitRepo", e.target.value)}
                  placeholder="github.com/user/repo" className="mt-1 font-mono text-xs" />
              </div>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Build Command</label>
              <Input value={form.buildCommand} onChange={(e) => update("buildCommand", e.target.value)}
                placeholder="npm run build" className="mt-1 font-mono text-xs" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Start Command</label>
              <Input value={form.startCommand} onChange={(e) => update("startCommand", e.target.value)}
                placeholder="npm start" className="mt-1 font-mono text-xs" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Port</label>
              <Input value={form.port} onChange={(e) => update("port", e.target.value)}
                placeholder="3000" className="mt-1 font-mono text-xs" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Environment Variables (one per line, KEY=VALUE)</label>
              <textarea
                value={form.envVars}
                onChange={(e) => update("envVars", e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-lg border border-border bg-background p-3 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="DATABASE_URL=postgres://..."
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Domain / Subdomain</label>
              <Input value={form.domain} onChange={(e) => update("domain", e.target.value)}
                placeholder="myapp.homelab.dev" className="mt-1 font-mono text-xs" />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <div className="text-sm font-medium">HTTPS</div>
                <div className="text-xs text-muted-foreground">Enable SSL/TLS encryption</div>
              </div>
              <button
                onClick={() => update("https", !form.https)}
                className={cn("relative h-5 w-10 rounded-full transition-colors", form.https ? "bg-primary" : "bg-muted")}
              >
                <div className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-primary-foreground transition-transform", form.https ? "left-5" : "left-0.5")} />
              </button>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <div className="text-sm font-medium">Public App</div>
                <div className="text-xs text-muted-foreground">Accessible from external network</div>
              </div>
              <button
                onClick={() => update("isPublic", !form.isPublic)}
                className={cn("relative h-5 w-10 rounded-full transition-colors", form.isPublic ? "bg-primary" : "bg-muted")}
              >
                <div className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-primary-foreground transition-transform", form.isPublic ? "left-5" : "left-0.5")} />
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3 className="text-sm font-semibold">Deployment Summary</h3>
            <div className="space-y-2 text-sm">
              {([
                ["App Name", form.name || "—"],
                ["Framework", form.framework],
                ["Source", form.sourceType],
                ["Build Command", form.buildCommand || "—"],
                ["Start Command", form.startCommand || "—"],
                ["Port", form.port],
                ["Domain", form.domain || "—"],
                ["HTTPS", form.https ? "Yes" : "No"],
                ["Public", form.isPublic ? "Yes" : "No"],
              ] as const).map(([label, value]) => (
                <div key={label} className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-mono text-xs">{value}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
          <ArrowLeft className="mr-1 h-3 w-3" />Back
        </Button>
        {step < 3 ? (
          <Button onClick={() => setStep(step + 1)}>
            Next<ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        ) : (
          <Button onClick={handleDeploy} disabled={deploying}>
            <Rocket className="mr-1 h-3 w-3" />{deploying ? "Deploying..." : "Deploy App"}
          </Button>
        )}
      </div>
    </div>
  );
}

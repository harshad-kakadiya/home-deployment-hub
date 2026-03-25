import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Search, Copy, Trash2, ArrowDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LogEntry, LogLevel } from "@/types";

interface LogViewerProps {
  logs: LogEntry[];
  loading?: boolean;
  className?: string;
}

const levelColors: Record<LogLevel, string> = {
  info: "text-info",
  warn: "text-warning",
  error: "text-destructive",
  debug: "text-muted-foreground",
};

export function LogViewer({ logs, loading, className }: LogViewerProps) {
  const [filter, setFilter] = useState<LogLevel | "all">("all");
  const [search, setSearch] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const filteredLogs = logs.filter((log) => {
    if (filter !== "all" && log.level !== filter) return false;
    if (search && !log.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [filteredLogs.length, autoScroll]);

  const handleCopy = () => {
    const text = filteredLogs.map(l => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.message}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("flex flex-col rounded-xl border border-border bg-terminal", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/50 px-3 py-2">
        <div className="flex items-center gap-1 rounded-md bg-background/10 px-2 py-1">
          <Search className="h-3 w-3 text-terminal-foreground/50" />
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-32 bg-transparent text-xs text-terminal-foreground placeholder:text-terminal-foreground/30 focus:outline-none"
          />
        </div>
        <div className="flex gap-1">
          {(["all", "info", "warn", "error", "debug"] as const).map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={cn(
                "rounded px-2 py-0.5 text-[10px] font-medium uppercase transition-colors",
                filter === level
                  ? "bg-primary/20 text-primary"
                  : "text-terminal-foreground/50 hover:text-terminal-foreground"
              )}
            >
              {level}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-terminal-foreground/50 hover:text-terminal-foreground"
            onClick={() => setAutoScroll(!autoScroll)}
            title={autoScroll ? "Auto-scroll on" : "Auto-scroll off"}
          >
            <ArrowDown className={cn("h-3 w-3", autoScroll && "text-primary")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-terminal-foreground/50 hover:text-terminal-foreground"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
      </div>

      {/* Log lines */}
      <div className="h-96 overflow-y-auto p-3 font-mono text-xs">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-8 text-center text-terminal-foreground/30">No logs found</div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="flex gap-2 py-0.5 hover:bg-background/5">
              <span className="shrink-0 text-terminal-foreground/30">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className={cn("shrink-0 w-12 uppercase", levelColors[log.level])}>
                [{log.level}]
              </span>
              <span className="text-terminal-foreground/80">{log.message}</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

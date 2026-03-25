import { useState, useEffect } from "react";
import { Bell, Search, Menu, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchNotifications } from "@/services/api";
import type { Notification } from "@/types";
import { cn } from "@/lib/utils";

interface TopNavProps {
  onMenuToggle: () => void;
  onCommandOpen: () => void;
}

export function TopNav({ onMenuToggle, onCommandOpen }: TopNavProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchNotifications().then(setNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuToggle}
        >
          <Menu className="h-4 w-4" />
        </Button>
        <button
          onClick={onCommandOpen}
          className="hidden items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground md:flex"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search...</span>
          <kbd className="ml-4 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* System status indicator */}
        <div className="hidden items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs md:flex">
          <Circle className="h-2 w-2 fill-success text-success" />
          <span className="text-muted-foreground">All systems operational</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </Button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-10 z-50 w-80 rounded-lg border border-border bg-card p-2 shadow-lg">
                <div className="mb-2 px-2 py-1 text-xs font-semibold text-muted-foreground">
                  Notifications
                </div>
                {notifications.length === 0 ? (
                  <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  <div className="max-h-72 space-y-1 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          "rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                          !n.read && "bg-accent/50"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Circle
                            className={cn(
                              "h-2 w-2 shrink-0",
                              n.type === "error" && "fill-destructive text-destructive",
                              n.type === "warning" && "fill-warning text-warning",
                              n.type === "success" && "fill-success text-success",
                              n.type === "info" && "fill-info text-info"
                            )}
                          />
                          <span className="font-medium">{n.title}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{n.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
          AD
        </div>
      </div>
    </header>
  );
}

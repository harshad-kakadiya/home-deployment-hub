import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Box, Globe, Rocket, Server, Settings, ChevronLeft, Zap,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Applications", path: "/apps", icon: Box },
  { label: "Deployments", path: "/deployments", icon: Rocket },
  { label: "Domains", path: "/domains", icon: Globe },
  { label: "Monitoring", path: "/monitoring", icon: Server },
  { label: "Settings", path: "/settings", icon: Settings },
];

interface AppSidebarProps {
  open: boolean;
  onToggle: () => void;
}

export function AppSidebar({ open, onToggle }: AppSidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onToggle}
        />
      )}
      <aside
        className={cn(
          "fixed z-50 flex h-full flex-col border-r border-border bg-card transition-all duration-300 md:relative md:z-auto",
          open ? "w-60" : "w-0 md:w-16",
          !open && "overflow-hidden md:overflow-visible"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          {open && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-foreground">
                Deploy Panel
              </span>
            </div>
          )}
          {!open && (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-3">
          {navItems.map((item) => {
            const isActive =
              item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
                title={item.label}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {open && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse button (desktop) */}
        <div className="hidden border-t border-border p-2 md:block">
          <button
            onClick={onToggle}
            className="flex w-full items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronLeft
              className={cn("h-4 w-4 transition-transform", !open && "rotate-180")}
            />
          </button>
        </div>
      </aside>
    </>
  );
}

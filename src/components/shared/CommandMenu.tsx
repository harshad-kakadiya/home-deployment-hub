import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Box, LayoutDashboard, Globe, Rocket, Server, Settings } from "lucide-react";

const routes = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Applications", path: "/apps", icon: Box },
  { label: "Deployments", path: "/deployments", icon: Rocket },
  { label: "Domains", path: "/domains", icon: Globe },
  { label: "Monitoring", path: "/monitoring", icon: Server },
  { label: "Settings", path: "/settings", icon: Settings },
];

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, apps, commands..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {routes.map((route) => (
            <CommandItem
              key={route.path}
              onSelect={() => {
                navigate(route.path);
                onOpenChange(false);
              }}
            >
              <route.icon className="mr-2 h-4 w-4" />
              {route.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

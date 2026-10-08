import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Mail, NotebookPen, ListChecks, Leaf, ShieldCheck, AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ResponsibleAIDialog } from "./responsible-ai-dialog";

export const NAV = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Smart Email Generator", url: "/email", icon: Mail },
  { title: "Meeting Notes Summarizer", url: "/meetings", icon: NotebookPen },
  { title: "AI Task Planner", url: "/planner", icon: ListChecks },
] as const;

function AppSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2.5 px-1 py-2">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-hero text-primary-foreground shadow-soft">
            <Leaf className="size-4.5" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-bold tracking-tight">Workplace AI</p>
            <p className="truncate text-xs text-muted-foreground">Productivity assistant</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={path === item.url} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ResponsibleAIDialog>
              <SidebarMenuButton tooltip="Responsible AI Guidelines">
                <ShieldCheck />
                <span>Responsible AI Guidelines</span>
              </SidebarMenuButton>
            </ResponsibleAIDialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const current = NAV.find((n) => n.url === path)?.title ?? "Workplace AI";
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0 bg-background">
        <header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 md:px-6">
            <div className="flex min-w-0 items-center gap-2">
              <SidebarTrigger className="shrink-0" />
              <nav className="flex min-w-0 items-center gap-1.5 text-sm">
                <span className="hidden text-muted-foreground sm:inline">Workplace AI</span>
                <span className="hidden text-muted-foreground sm:inline">/</span>
                <span className="truncate font-semibold">{current}</span>
              </nav>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                <span className="size-2 rounded-full bg-primary-glow" /> Online
              </span>
              <div className="relative grid size-9 place-items-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                NS
                <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-background bg-primary-glow" />
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2 border-t border-warning-foreground/15 bg-warning px-4 py-2 text-xs text-warning-foreground md:px-6">
            <AlertTriangle className="mt-px size-3.5 shrink-0" />
            <p>
              <strong className="font-semibold">Responsible AI:</strong> AI outputs can be inaccurate. Please review
              and verify all generated content before use.
            </p>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

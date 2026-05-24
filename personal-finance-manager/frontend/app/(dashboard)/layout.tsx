"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Receipt,
  Tags,
  Target,
  BarChart3,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: Receipt },
  { href: "/categories", label: "Categories", icon: Tags },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex gap-6 p-6 min-h-screen">
        {/* Sidebar */}
        <aside
          className={`shrink-0 rounded-3xl border border-border bg-card flex flex-col px-4 py-5 shadow-sm transition-all duration-200 ease-out ${
            collapsed ? "w-24" : "w-72"
          }`}
        >
          <div className="px-2 pb-4 border-b border-border/70">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="text-sm font-semibold tracking-wide text-foreground">
                <span className={collapsed ? "sr-only" : ""}>Finance Manager</span>
                <span className={collapsed ? "inline" : "sr-only"}>FM</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed((prev) => !prev)}
                className="h-9 w-9 rounded-xl border border-border/70 bg-muted/70 hover:bg-accent"
              >
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </div>
            {!collapsed && (
              <p className="mt-1 text-xs text-muted-foreground">Personal finance workspace</p>
            )}
          </div>
          <nav className={`flex-1 ${collapsed ? "px-2 py-4" : "px-2 py-5"}`}>
            <ul className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={item.label}
                      className={`group flex items-center rounded-xl text-sm font-medium transition-colors ${
                        collapsed ? "justify-center px-0 py-2" : "gap-3 px-3 py-2.5"
                      } ${
                        isActive
                          ? "bg-accent text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border border-border/70 ${
                          isActive
                            ? "bg-background text-foreground"
                            : "bg-muted/80 text-foreground/70 group-hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className={collapsed ? "sr-only" : ""}>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className={`pt-4 border-t border-border/70 space-y-2 ${collapsed ? "px-2" : "px-2"}`}>
            <div
              className={`flex items-center rounded-xl border border-border/70 bg-muted/50 px-3 py-2 ${
                collapsed ? "justify-center" : "gap-3"
              }`}
            >
              <ModeToggle />
              <span className={collapsed ? "sr-only" : "text-xs uppercase tracking-[0.2em] text-muted-foreground"}>
                Theme
              </span>
            </div>
            <Button
              variant="ghost"
              className={`w-full rounded-xl border border-border/70 bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-accent ${
                collapsed ? "justify-center" : "justify-start"
              }`}
              onClick={handleLogout}
            >
              <LogOut className={collapsed ? "h-4 w-4" : "h-4 w-4 mr-3"} />
              <span className={collapsed ? "sr-only" : ""}>Logout</span>
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

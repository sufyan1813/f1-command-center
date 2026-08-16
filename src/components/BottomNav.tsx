"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Radio, Trophy, Calendar, Users, History } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/live", icon: Radio, label: "Live" },
  { href: "/standings", icon: Trophy, label: "Standings" },
  { href: "/schedule", icon: Calendar, label: "Schedule" },
  { href: "/drivers", icon: Users, label: "Drivers" },
  { href: "/history", icon: History, label: "History" },
] as const;

export default function BottomNav() {
  const path = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-surface pb-safe"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 8px)" }}
    >
      <div className="flex items-stretch justify-around max-w-lg mx-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = href === "/" ? path === "/" : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2 text-xs font-medium transition-colors
                ${active ? "text-f1-red" : "text-muted hover:text-foreground"}`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] leading-none">{label}</span>
              {active && (
                <span className="absolute top-0 w-8 h-0.5 bg-f1-red rounded-b-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

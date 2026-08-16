"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Radio, Trophy, Calendar, Users, History } from "lucide-react";

const NAV = [
  { href: "/",          icon: Home,     label: "Home"      },
  { href: "/live",      icon: Radio,    label: "Live"      },
  { href: "/standings", icon: Trophy,   label: "Standings" },
  { href: "/schedule",  icon: Calendar, label: "Schedule"  },
  { href: "/drivers",   icon: Users,    label: "Drivers"   },
  { href: "/history",   icon: History,  label: "History"   },
] as const;

export default function Navbar() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur">
      <div className="flex items-center gap-3 px-4 sm:px-6 h-14 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 shrink-0 mr-2">
          <span className="text-f1-red font-black text-xl tracking-tight leading-none">F1</span>
          <span className="font-semibold text-sm hidden sm:block tracking-tight">Command Center</span>
        </Link>

        <nav className="flex items-center gap-0.5 overflow-x-auto flex-1 scrollbar-none">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = href === "/" ? path === "/" : path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap
                  ${active ? "text-f1-red bg-f1-red/10" : "text-muted hover:text-foreground hover:bg-surface"}`}
              >
                <Icon size={14} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-xs sm:text-sm">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="h-0.5 bg-f1-red" />
    </header>
  );
}

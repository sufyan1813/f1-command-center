import type { ReactNode } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  live?: boolean;
  right?: ReactNode;
}

export default function Header({ title, subtitle, live, right }: HeaderProps) {
  return (
    <div className="border-b border-border bg-surface">
      <div className="flex items-center justify-between px-4 sm:px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          {live && (
            <span className="flex items-center gap-1.5">
              <span className="live-dot w-2 h-2 rounded-full bg-f1-red inline-block" />
              <span className="text-f1-red text-xs font-bold tracking-widest uppercase">Live</span>
            </span>
          )}
          <div>
            <h1 className="text-2xl font-bold leading-tight tracking-tight">{title}</h1>
            {subtitle && <p className="text-muted text-sm mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {right && <div>{right}</div>}
      </div>
    </div>
  );
}

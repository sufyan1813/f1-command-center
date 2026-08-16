"use client";

import { useState } from "react";
import { getTeamColor } from "@/lib/teamColors";
import type { DriverStanding, ConstructorStanding } from "@/lib/types";
import { Trophy } from "lucide-react";

type Tab = "drivers" | "constructors";

const POS_COLORS: Record<number, string> = { 1: "text-gold", 2: "text-silver", 3: "text-bronze" };

function PointsBar({ points, max }: { points: number; max: number }) {
  const pct = max > 0 ? (points / max) * 100 : 0;
  return (
    <div className="h-1 bg-border rounded-full overflow-hidden mt-1.5">
      <div className="h-full bg-f1-red rounded-full" style={{ width: `${pct}%` }} />
    </div>
  );
}

function DriverRow({ d, maxPts, leaderPts }: { d: DriverStanding; maxPts: number; leaderPts: number }) {
  const pos = parseInt(d.position);
  const pts = parseInt(d.points);
  const gap = leaderPts - pts;
  const color = getTeamColor(d.Constructors[0]?.constructorId ?? "");
  return (
    <div className={`rounded-xl border border-border px-4 py-3 flex items-center gap-3 ${pos <= 3 ? "bg-elevated" : "bg-surface"}`}>
      <span className={`font-bold font-mono text-lg w-7 shrink-0 ${POS_COLORS[pos] ?? "text-muted"}`}>{pos}</span>
      <div className="w-1 h-12 rounded-full shrink-0" style={{ background: color }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-sm font-bold" style={{ color }}>{d.Driver.code}</span>
          <span className="font-semibold text-sm truncate">{d.Driver.givenName} {d.Driver.familyName}</span>
        </div>
        <p className="text-xs text-muted truncate">{d.Constructors[0]?.name}</p>
        <PointsBar points={pts} max={maxPts} />
      </div>
      <div className="text-right shrink-0">
        <p className="text-lg font-bold">{d.points}</p>
        {pos === 1
          ? <p className="text-xs font-bold text-gold">{d.wins}W · Leader</p>
          : <p className="text-xs text-muted">-{gap}pts</p>
        }
      </div>
    </div>
  );
}

function ConstructorRow({ c, maxPts, leaderPts }: { c: ConstructorStanding; maxPts: number; leaderPts: number }) {
  const pos = parseInt(c.position);
  const pts = parseInt(c.points);
  const gap = leaderPts - pts;
  const color = getTeamColor(c.Constructor.constructorId);
  return (
    <div className={`rounded-xl border border-border px-4 py-3 flex items-center gap-3 ${pos <= 3 ? "bg-elevated" : "bg-surface"}`}>
      <span className={`font-bold font-mono text-lg w-7 shrink-0 ${POS_COLORS[pos] ?? "text-muted"}`}>{pos}</span>
      <div className="w-1 h-12 rounded-full shrink-0" style={{ background: color }} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{c.Constructor.name}</p>
        <p className="text-xs text-muted">{c.Constructor.nationality}</p>
        <PointsBar points={pts} max={maxPts} />
      </div>
      <div className="text-right shrink-0">
        <p className="text-lg font-bold">{c.points}</p>
        {pos === 1
          ? <p className="text-xs font-bold text-gold">{c.wins}W · Leader</p>
          : <p className="text-xs text-muted">-{gap}pts</p>
        }
      </div>
    </div>
  );
}

interface Props {
  drivers: DriverStanding[];
  constructors: ConstructorStanding[];
  season: string;
}

export default function StandingsTabs({ drivers, constructors, season }: Props) {
  const [tab, setTab] = useState<Tab>("drivers");
  const maxDriverPts = drivers[0] ? parseInt(drivers[0].points) : 1;
  const maxConPts    = constructors[0] ? parseInt(constructors[0].points) : 1;

  return (
    <div>
      <div className="sticky top-14 z-30 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-gold" />
            <h1 className="text-lg font-bold">Championship Standings</h1>
            <span className="text-xs text-muted hidden sm:block">{season} Season</span>
          </div>
          <div className="flex md:hidden bg-surface rounded-xl p-1 shrink-0">
            {(["drivers", "constructors"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                  tab === t ? "bg-f1-red text-white" : "text-muted"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={tab === "constructors" ? "hidden md:block" : "block"}>
            <h2 className="hidden md:flex items-center gap-2 text-sm font-semibold text-muted uppercase tracking-wider mb-3">
              Drivers Championship
            </h2>
            <div className="space-y-1.5">
              {drivers.map((d) => (
                <DriverRow key={d.Driver.driverId} d={d} maxPts={maxDriverPts} leaderPts={maxDriverPts} />
              ))}
            </div>
          </div>

          <div className={tab === "drivers" ? "hidden md:block" : "block"}>
            <h2 className="hidden md:flex items-center gap-2 text-sm font-semibold text-muted uppercase tracking-wider mb-3">
              Constructors Championship
            </h2>
            <div className="space-y-1.5">
              {constructors.map((c) => (
                <ConstructorRow key={c.Constructor.constructorId} c={c} maxPts={maxConPts} leaderPts={maxConPts} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

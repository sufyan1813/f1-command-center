"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import { RefreshCw, AlertTriangle, Wifi, WifiOff, Clock } from "lucide-react";
import { getCompoundColor, getCompoundLabel } from "@/lib/teamColors";
import type { OF1Session, OF1Driver, OF1Position, OF1Interval, OF1Stint, OF1RaceControl, Race } from "@/lib/types";

const OF1 = "https://api.openf1.org/v1";

async function apiFetch<T>(path: string): Promise<T[]> {
  try {
    const res = await fetch(`${OF1}${path}`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

function latestByDriver<T extends { driver_number: number; date?: string }>(arr: T[]): T[] {
  const m = new Map<number, T>();
  for (const x of arr) {
    const ex = m.get(x.driver_number);
    if (!ex || (x.date && ex.date && x.date > ex.date)) m.set(x.driver_number, x);
  }
  return Array.from(m.values());
}

function latestStintByDriver(arr: OF1Stint[]): OF1Stint[] {
  const m = new Map<number, OF1Stint>();
  for (const s of arr) {
    const ex = m.get(s.driver_number);
    if (!ex || s.stint_number > ex.stint_number) m.set(s.driver_number, s);
  }
  return Array.from(m.values());
}

const FLAG_COLORS: Record<string, string> = {
  GREEN:               "bg-green-700/20 text-green-400 border-green-700/40",
  YELLOW:              "bg-yellow-600/20 text-yellow-300 border-yellow-600/40",
  RED:                 "bg-red-700/20 text-red-400 border-red-700/40",
  SAFETY_CAR:          "bg-yellow-500/20 text-yellow-200 border-yellow-500/40",
  VIRTUAL_SAFETY_CAR:  "bg-yellow-400/20 text-yellow-200 border-yellow-400/40",
  CHEQUERED:           "bg-white/10 text-white border-white/20",
};

const FLAG_LABELS: Record<string, string> = {
  GREEN:              "🟢 Green Flag",
  YELLOW:             "🟡 Yellow Flag",
  RED:                "🔴 Red Flag",
  SAFETY_CAR:         "🚗 Safety Car",
  VIRTUAL_SAFETY_CAR: "🔶 Virtual SC",
  CHEQUERED:          "🏁 Chequered",
};

interface NextSession {
  label: string;
  date: Date;
  raceName: string;
  country: string;
}

function getNextScheduledSession(schedule: Race[]): NextSession | null {
  const now = new Date();
  for (const race of schedule) {
    const candidates = [
      { label: "Practice 1",        s: race.FirstPractice },
      { label: "Practice 2",        s: race.SecondPractice },
      { label: "Practice 3",        s: race.ThirdPractice },
      { label: "Sprint Qualifying", s: race.SprintQualifying },
      { label: "Sprint Race",       s: race.Sprint },
      { label: "Qualifying",        s: race.Qualifying },
      { label: "Race",              s: { date: race.date, time: race.time } },
    ] as { label: string; s: { date: string; time?: string } | undefined }[];
    for (const { label, s } of candidates) {
      if (!s) continue;
      const t = s.time ? s.time.replace(/Z$/, "") : "00:00:00";
      const d = new Date(`${s.date}T${t}Z`);
      if (d > now) return { label, date: d, raceName: race.raceName, country: race.Circuit.Location.country };
    }
  }
  return null;
}

function timeUntil(date: Date): string {
  const diff = date.getTime() - Date.now();
  if (diff <= 0) return "Starting now";
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `in ${mins} minute${mins !== 1 ? "s" : ""}`;
  if (hours < 24) return `in ${hours} hour${hours !== 1 ? "s" : ""}`;
  return `in ${days} day${days !== 1 ? "s" : ""}`;
}

const COUNTRY_FLAGS: Record<string, string> = {
  Australia: "🇦🇺", Bahrain: "🇧🇭", "Saudi Arabia": "🇸🇦", Japan: "🇯🇵",
  China: "🇨🇳", USA: "🇺🇸", Monaco: "🇲🇨", Canada: "🇨🇦", Spain: "🇪🇸",
  Austria: "🇦🇹", "United Kingdom": "🇬🇧", Hungary: "🇭🇺", Belgium: "🇧🇪",
  Netherlands: "🇳🇱", Italy: "🇮🇹", Azerbaijan: "🇦🇿", Singapore: "🇸🇬",
  Mexico: "🇲🇽", Brazil: "🇧🇷", "United Arab Emirates": "🇦🇪", Qatar: "🇶🇦",
};

export default function LiveClient({ schedule }: { schedule: Race[] }) {
  const [session, setSession]         = useState<OF1Session | null>(null);
  const [drivers, setDrivers]         = useState<OF1Driver[]>([]);
  const [positions, setPositions]     = useState<OF1Position[]>([]);
  const [intervals, setIntervals]     = useState<OF1Interval[]>([]);
  const [stints, setStints]           = useState<OF1Stint[]>([]);
  const [raceControl, setRaceControl] = useState<OF1RaceControl[]>([]);
  const [loading, setLoading]         = useState(true);
  const [lastUpdate, setLastUpdate]   = useState<Date | null>(null);
  const [isLive, setIsLive]           = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isSessionLive = useCallback((s: OF1Session) => {
    const now = Date.now();
    return now >= new Date(s.date_start).getTime() && now <= new Date(s.date_end).getTime();
  }, []);

  const loadLiveData = useCallback(async (sessionKey: number) => {
    const [pos, iv, st, rc] = await Promise.all([
      apiFetch<OF1Position>(`/position?session_key=${sessionKey}`),
      apiFetch<OF1Interval>(`/intervals?session_key=${sessionKey}`),
      apiFetch<OF1Stint>(`/stints?session_key=${sessionKey}`),
      apiFetch<OF1RaceControl>(`/race_control?session_key=${sessionKey}`),
    ]);
    setPositions(latestByDriver(pos).sort((a, b) => a.position - b.position));
    setIntervals(latestByDriver(iv));
    setStints(latestStintByDriver(st));
    setRaceControl(rc.slice(-5).reverse());
    setLastUpdate(new Date());
  }, []);

  const init = useCallback(async () => {
    setLoading(true);
    const sessions = await apiFetch<OF1Session>("/sessions?session_key=latest");
    const s = sessions[0] ?? null;
    setSession(s);
    if (s) {
      const live = isSessionLive(s);
      setIsLive(live);
      const drvs = await apiFetch<OF1Driver>(`/drivers?session_key=${s.session_key}`);
      setDrivers(drvs);
      await loadLiveData(s.session_key);
    }
    setLoading(false);
  }, [isSessionLive, loadLiveData]);

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    if (!session || !isLive) return;
    pollRef.current = setInterval(() => loadLiveData(session.session_key), 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [session, isLive, loadLiveData]);

  const driverMap   = new Map(drivers.map((d) => [d.driver_number, d]));
  const intervalMap = new Map(intervals.map((iv) => [iv.driver_number, iv]));
  const stintMap    = new Map(stints.map((s) => [s.driver_number, s]));
  const latestFlag  = raceControl.find(m => m.flag && m.flag !== "NONE")?.flag ?? "GREEN";

  if (loading) {
    return (
      <div>
        <Header title="Live Timing" />
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="w-8 h-8 border-2 border-f1-red border-t-transparent rounded-full animate-spin" />
          <p className="text-muted text-sm">Connecting to live timing…</p>
        </div>
      </div>
    );
  }

  if (!session) {
    const nextSched = getNextScheduledSession(schedule);
    return (
      <div>
        <Header title="Live Timing" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center gap-6 text-center">
          <WifiOff size={44} className="text-muted" />
          <div>
            <p className="text-xl font-bold">No active session</p>
            <p className="text-muted text-sm mt-1">Formula 1 is currently between sessions.</p>
          </div>

          {nextSched ? (
            <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-sm text-left">
              <p className="text-xs text-muted uppercase tracking-wider font-semibold mb-4 flex items-center gap-1.5">
                <Clock size={11} /> Coming Up Next
              </p>
              <div className="flex items-start gap-3">
                <span className="text-3xl">{COUNTRY_FLAGS[nextSched.country] ?? "🏁"}</span>
                <div>
                  <p className="font-black text-xl">{nextSched.label}</p>
                  <p className="text-muted text-sm mt-0.5">{nextSched.raceName}</p>
                  <p className="text-f1-red font-bold text-sm mt-2">{timeUntil(nextSched.date)}</p>
                  <p className="text-xs text-muted font-mono mt-0.5">
                    {nextSched.date.toLocaleString(undefined, {
                      weekday: "short", month: "short", day: "numeric",
                      hour: "2-digit", minute: "2-digit", timeZoneName: "short",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted text-sm">No upcoming sessions found. Check back later.</p>
          )}

          <button
            onClick={init}
            className="flex items-center gap-2 bg-f1-red text-white px-5 py-2.5 rounded-full text-sm font-semibold"
          >
            <RefreshCw size={14} /> Check Again
          </button>
        </div>
      </div>
    );
  }

  const flagClass = FLAG_COLORS[latestFlag] ?? FLAG_COLORS.GREEN;
  const flagLabel = FLAG_LABELS[latestFlag] ?? "Green Flag";

  return (
    <div>
      <Header
        title="Live Timing"
        live={isLive}
        subtitle={`${session.country_name} · ${session.session_name}`}
        right={
          <button
            onClick={() => loadLiveData(session.session_key)}
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors text-sm px-3 py-1.5 rounded-lg hover:bg-surface"
            aria-label="Refresh"
          >
            <RefreshCw size={14} />
            <span className="hidden sm:block">Refresh</span>
          </button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Position tower */}
          <div className="lg:col-span-2">
            {positions.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center bg-surface border border-border rounded-2xl">
                <AlertTriangle size={32} className="text-muted" />
                <p className="font-semibold">No timing data</p>
                <p className="text-muted text-sm">Session may not have started yet</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-border overflow-hidden">
                <div className="px-4 py-3 border-b border-border bg-surface flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider">Position Tower</p>
                  {lastUpdate && (
                    <span className="text-xs text-muted">{lastUpdate.toLocaleTimeString()}</span>
                  )}
                </div>
                {positions.map((pos, idx) => {
                  const driver   = driverMap.get(pos.driver_number);
                  const iv       = intervalMap.get(pos.driver_number);
                  const stint    = stintMap.get(pos.driver_number);
                  const colour   = driver?.team_colour ? `#${driver.team_colour}` : "#999";
                  const compound = stint?.compound ?? "UNKNOWN";
                  const compoundAge = stint
                    ? (stint.lap_end ?? 0) - stint.lap_start + (stint.tyre_age_at_start ?? 0)
                    : 0;
                  const gapStr = pos.position === 1
                    ? "LEADER"
                    : iv?.gap_to_leader != null
                      ? `+${Number(iv.gap_to_leader).toFixed(3)}`
                      : "—";

                  return (
                    <div
                      key={pos.driver_number}
                      className={`flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 ${idx % 2 === 0 ? "bg-surface" : "bg-elevated"}`}
                    >
                      <span className="font-mono font-bold text-sm w-6 text-center text-muted">{pos.position}</span>
                      <span className="w-1 h-9 rounded-full shrink-0" style={{ background: colour }} />
                      <span className="font-mono font-bold text-sm w-10 shrink-0" style={{ color: colour }}>
                        {driver?.name_acronym ?? `#${pos.driver_number}`}
                      </span>
                      <span className="flex-1 text-sm truncate">
                        {driver?.full_name ?? `Driver ${pos.driver_number}`}
                      </span>
                      <span className={`font-mono text-xs w-24 text-right shrink-0 ${pos.position === 1 ? "text-gold font-bold" : "text-muted"}`}>
                        {gapStr}
                      </span>
                      <span
                        className="font-mono font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: getCompoundColor(compound),
                          color: ["MEDIUM", "HARD"].includes(compound) ? "#000" : "#fff",
                        }}
                        title={`${compound} · ${compoundAge} laps`}
                      >
                        {getCompoundLabel(compound)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Track Status</p>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full border ${flagClass}`}>
                  {flagLabel}
                </span>
                {!isLive && (
                  <span className="flex items-center gap-1.5 text-muted text-xs">
                    <Wifi size={12} /> Last session data
                  </span>
                )}
              </div>
            </div>

            {raceControl.length > 0 && (
              <div className="rounded-2xl border border-border bg-surface p-4">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Race Control</p>
                <div className="space-y-3">
                  {raceControl.map((m, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <span className="text-muted font-mono shrink-0 text-xs pt-0.5">L{m.lap_number ?? "--"}</span>
                      <span className="text-foreground leading-snug text-xs">{m.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Session</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted text-xs">Event</span>
                  <span className="font-semibold text-xs text-right">{session.country_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted text-xs">Session</span>
                  <span className="font-semibold text-xs">{session.session_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted text-xs">Status</span>
                  <span className={`text-xs font-bold ${isLive ? "text-f1-red" : "text-muted"}`}>
                    {isLive ? "LIVE" : "ENDED"}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

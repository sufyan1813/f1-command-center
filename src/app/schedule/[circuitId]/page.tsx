import { Metadata } from "next";
import Link from "next/link";
import { getRaceSchedule, getCircuitHistory } from "@/lib/api";
import { getTrackInfo } from "@/lib/trackData";
import { getTeamColor } from "@/lib/teamColors";
import {
  ArrowLeft, MapPin, Calendar, Clock, Trophy, Zap,
  RotateCcw, Flag, Activity, Route,
} from "lucide-react";
import LocalTime from "@/components/LocalTime";

interface Props {
  params: Promise<{ circuitId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { circuitId } = await params;
  return { title: circuitId.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) };
}

const COUNTRY_FLAGS: Record<string, string> = {
  Australia: "🇦🇺", Bahrain: "🇧🇭", "Saudi Arabia": "🇸🇦", Japan: "🇯🇵",
  China: "🇨🇳", USA: "🇺🇸", "United States": "🇺🇸", Monaco: "🇲🇨",
  Canada: "🇨🇦", Spain: "🇪🇸", Austria: "🇦🇹", "United Kingdom": "🇬🇧",
  Hungary: "🇭🇺", Belgium: "🇧🇪", Netherlands: "🇳🇱", Italy: "🇮🇹",
  Azerbaijan: "🇦🇿", Singapore: "🇸🇬", Mexico: "🇲🇽", Brazil: "🇧🇷",
  "United Arab Emirates": "🇦🇪", "Abu Dhabi": "🇦🇪", UAE: "🇦🇪",
  Qatar: "🇶🇦", Malaysia: "🇲🇾", UK: "🇬🇧", "Great Britain": "🇬🇧",
};

function getFlag(country: string): string {
  return COUNTRY_FLAGS[country] ?? "🏁";
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

function formatTime(time?: string): string {
  if (!time) return "TBC";
  const [h, m] = time.replace("Z", "").split(":").map(Number);
  return `${h.toString().padStart(2, "0")}:${String(m).padStart(2, "0")} UTC`;
}

function isPast(date: string, time?: string): boolean {
  return new Date(`${date}T${time ?? "23:59:59Z"}`) < new Date();
}

type SessionEntry = { label: string; date?: string; time?: string };

export default async function CircuitDetailPage({ params }: Props) {
  const { circuitId } = await params;

  const [schedule, history] = await Promise.all([
    getRaceSchedule(),
    getCircuitHistory(circuitId),
  ]);

  const race = schedule.find((r) => r.Circuit.circuitId === circuitId);

  if (!race && history.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-muted">Circuit not found.</p>
        <Link href="/schedule" className="text-f1-red text-sm mt-4 inline-block hover:underline">
          ← Back to schedule
        </Link>
      </div>
    );
  }

  const circuit = race?.Circuit ?? history[0]?.Circuit;
  const track = getTrackInfo(circuitId);
  const raceDistance = track ? (track.length * track.laps).toFixed(1) : null;

  // Last 5 winners
  const recentWinners = [...history]
    .sort((a, b) => parseInt(b.season) - parseInt(a.season))
    .slice(0, 5);

  // Most wins at this circuit (from all history)
  const winCounts = new Map<string, { name: string; team: string; count: number; constructorId: string }>();
  for (const h of history) {
    const r = h.Results?.[0];
    if (!r) continue;
    const key = r.Driver.driverId;
    const existing = winCounts.get(key);
    if (existing) {
      existing.count++;
    } else {
      winCounts.set(key, {
        name: `${r.Driver.givenName} ${r.Driver.familyName}`,
        team: r.Constructor.name,
        constructorId: r.Constructor.constructorId,
        count: 1,
      });
    }
  }
  const topWinners = Array.from(winCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Weekend session schedule
  const sessions: SessionEntry[] = [];
  if (race?.FirstPractice) sessions.push({ label: "Practice 1", ...race.FirstPractice });
  if (race?.SecondPractice) sessions.push({ label: "Practice 2", ...race.SecondPractice });
  if (race?.SprintQualifying) sessions.push({ label: "Sprint Qualifying", ...race.SprintQualifying });
  if (race?.ThirdPractice) sessions.push({ label: "Practice 3", ...race.ThirdPractice });
  if (race?.Sprint) sessions.push({ label: "Sprint Race", ...race.Sprint });
  if (race?.Qualifying) sessions.push({ label: "Qualifying", ...race.Qualifying });
  if (race) sessions.push({ label: "Race", date: race.date, time: race.time });

  const raceIsPast = race ? isPast(race.date, race.time) : true;

  return (
    <div>
      {/* Header */}
      <div className="border-b border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Link
            href="/schedule"
            className="inline-flex items-center gap-1.5 text-muted hover:text-foreground text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={14} /> Back to calendar
          </Link>

          <div className="flex items-start gap-4">
            <span className="text-5xl leading-none mt-1">{getFlag(circuit?.Location.country ?? "")}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted uppercase tracking-wider mb-1">
                {circuit?.Location.locality}, {circuit?.Location.country}
              </p>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                {race?.raceName ?? circuit?.circuitName}
              </h1>
              <p className="text-muted mt-1">{circuit?.circuitName}</p>
              {race && (
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <Calendar size={11} /> Round {race.round} · {race.season}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <Clock size={11} /> {formatDate(race.date)}
                  </span>
                  {race.Sprint && (
                    <span className="text-xs bg-f1-red/20 text-f1-red border border-f1-red/30 rounded-full px-2 py-0.5 font-semibold">
                      SPRINT WEEKEND
                    </span>
                  )}
                  {raceIsPast && (
                    <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/30 rounded-full px-2 py-0.5 font-semibold">
                      COMPLETED
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left column ── */}
          <div className="space-y-5">

            {/* Track specs */}
            {track && (
              <section className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border bg-elevated flex items-center gap-2">
                  <Route size={13} className="text-f1-red" />
                  <h2 className="text-xs text-muted uppercase tracking-wider font-semibold">Circuit Stats</h2>
                </div>
                <div className="divide-y divide-border">
                  {[
                    { label: "Circuit length", value: `${track.length} km` },
                    { label: "Race laps", value: track.laps },
                    { label: "Race distance", value: `${raceDistance} km` },
                    { label: "Turns", value: track.turns },
                    { label: "DRS zones", value: track.drsZones },
                    { label: "Circuit type", value: track.type.charAt(0).toUpperCase() + track.type.slice(1) },
                    { label: "First GP", value: track.firstGP },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between px-4 py-2.5 text-sm">
                      <span className="text-muted">{label}</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Lap record */}
            {track && (
              <section className="bg-surface border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Activity size={13} className="text-purple-400" />
                  <h2 className="text-xs text-muted uppercase tracking-wider font-semibold">Lap Record</h2>
                </div>
                <p className="text-3xl font-black font-mono text-purple-400">{track.lapRecord.time}</p>
                <p className="text-sm font-semibold mt-1">{track.lapRecord.driver}</p>
                <p className="text-xs text-muted">{track.lapRecord.year} Formula 1 Grand Prix</p>
              </section>
            )}

            {/* Description */}
            {track && (
              <section className="bg-surface border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={13} className="text-muted" />
                  <h2 className="text-xs text-muted uppercase tracking-wider font-semibold">About This Circuit</h2>
                </div>
                <p className="text-sm text-muted leading-relaxed">{track.description}</p>
              </section>
            )}

            {!track && (
              <section className="bg-surface border border-border rounded-xl p-4 text-center text-muted text-sm">
                Detailed track data not yet available for this circuit.
              </section>
            )}
          </div>

          {/* ── Right column ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Weekend schedule (only for current/future races) */}
            {race && sessions.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={13} className="text-muted" />
                  <h2 className="text-xs text-muted uppercase tracking-wider font-semibold">Weekend Schedule</h2>
                </div>
                <div className="rounded-xl border border-border overflow-hidden">
                  {sessions.map((s, i) => {
                    const done = s.date ? isPast(s.date, s.time) : false;
                    const isRace = s.label === "Race";
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 text-sm
                          ${isRace ? "bg-f1-red/5" : i % 2 === 0 ? "bg-surface" : "bg-elevated/40"}`}
                      >
                        <div className={`w-1.5 h-8 rounded-full shrink-0 ${isRace ? "bg-f1-red" : done ? "bg-green-500" : "bg-border"}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold ${isRace ? "text-f1-red" : ""}`}>{s.label}</p>
                          {s.date && <p className="text-xs text-muted">{formatDate(s.date)}</p>}
                        </div>
                        <div className="text-right shrink-0">
                          {s.time && (s.date
                            ? <LocalTime date={s.date} time={s.time} />
                            : <p className="text-xs font-mono text-muted">{formatTime(s.time)}</p>
                          )}
                          {done && <p className="text-xs text-green-400 font-semibold">Done</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Last 5 winners */}
            {recentWinners.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Trophy size={13} className="text-gold" />
                  <h2 className="text-xs text-muted uppercase tracking-wider font-semibold">
                    Recent Winners — Last {recentWinners.length} Editions
                  </h2>
                </div>
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-elevated text-xs text-muted font-semibold uppercase tracking-wider border-b border-border">
                    <span className="col-span-1">Year</span>
                    <span className="col-span-5">Driver</span>
                    <span className="col-span-3">Team</span>
                    <span className="col-span-3 text-right">Time</span>
                  </div>
                  {recentWinners.map((h, idx) => {
                    const winner = h.Results?.[0];
                    if (!winner) return null;
                    const color = getTeamColor(winner.Constructor.constructorId);
                    return (
                      <div
                        key={h.season}
                        className={`grid grid-cols-12 gap-2 px-4 py-3 items-center border-b border-border last:border-0 text-sm
                          ${idx === 0 ? "bg-gold/5" : idx % 2 === 0 ? "bg-surface" : "bg-elevated/40"}`}
                      >
                        <span className="col-span-1 font-bold text-muted text-xs font-mono">{h.season}</span>
                        <div className="col-span-5 flex items-center gap-2">
                          {idx === 0 && <span className="text-base">🏆</span>}
                          <div>
                            <p className="font-semibold text-sm">
                              {winner.Driver.givenName} {winner.Driver.familyName}
                            </p>
                            {winner.Driver.code && (
                              <p className="text-xs font-mono" style={{ color }}>{winner.Driver.code}</p>
                            )}
                          </div>
                        </div>
                        <span
                          className="col-span-3 text-xs font-medium truncate"
                          style={{ color }}
                        >
                          {winner.Constructor.name}
                        </span>
                        <span className="col-span-3 text-right text-xs font-mono text-muted">
                          {winner.Time?.time ?? winner.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Most wins at this circuit */}
            {topWinners.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={13} className="text-f1-red" />
                  <h2 className="text-xs text-muted uppercase tracking-wider font-semibold">
                    Most Wins At This Circuit
                  </h2>
                </div>
                <div className="space-y-2">
                  {topWinners.map((w, idx) => {
                    const color = getTeamColor(w.constructorId);
                    const barWidth = Math.round((w.count / topWinners[0].count) * 100);
                    return (
                      <div key={w.name} className="bg-surface border border-border rounded-xl px-4 py-3">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-black text-muted font-mono w-6 shrink-0">
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm">{w.name}</p>
                            <p className="text-xs" style={{ color }}>{w.team}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-2xl font-black" style={{ color }}>{w.count}</p>
                            <p className="text-xs text-muted">{w.count === 1 ? "win" : "wins"}</p>
                          </div>
                        </div>
                        <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${barWidth}%`, background: color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {history.length === 0 && (
              <div className="bg-surface border border-border rounded-xl p-8 text-center text-muted">
                <RotateCcw size={20} className="mx-auto mb-2 opacity-40" />
                <p>No historical data available yet.</p>
                <p className="text-xs mt-1">Check back after the first race here.</p>
              </div>
            )}

            {/* Winner of current-year race if completed */}
            {raceIsPast && race && recentWinners[0]?.season === race.season && (
              <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 flex items-center gap-3">
                <span className="text-3xl">🏆</span>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider font-semibold">
                    {race.season} Winner
                  </p>
                  {recentWinners[0].Results?.[0] && (
                    <>
                      <p className="font-bold text-lg">
                        {recentWinners[0].Results[0].Driver.givenName}{" "}
                        {recentWinners[0].Results[0].Driver.familyName}
                      </p>
                      <p className="text-sm" style={{ color: getTeamColor(recentWinners[0].Results[0].Constructor.constructorId) }}>
                        {recentWinners[0].Results[0].Constructor.name}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

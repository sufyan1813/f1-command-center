import { Metadata } from "next";
import Link from "next/link";
import CountdownTimer from "@/components/CountdownTimer";
import {
  getDriverStandings,
  getConstructorStandings,
  getRaceSchedule,
  getLastRaceResults,
  getNextRace,
} from "@/lib/api";
import { getTeamColor } from "@/lib/teamColors";
import type { Race } from "@/lib/types";
import { Flag, Trophy, Calendar, AlertCircle, Zap, ChevronRight } from "lucide-react";

export const metadata: Metadata = { title: "Dashboard" };

function formatRaceDate(race: Race): string {
  return new Date(race.date).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function raceISO(race: Race): string {
  const time = race.time ? race.time.replace(/Z$/, "") : "00:00:00";
  return `${race.date}T${time}Z`;
}

export default async function HomePage() {
  const [driverStandings, constructorStandings, schedule, lastRace] = await Promise.all([
    getDriverStandings(),
    getConstructorStandings(),
    getRaceSchedule(),
    getLastRaceResults(),
  ]);

  const nextRace = getNextRace(schedule);
  const leader = driverStandings[0] ?? null;
  const conLeader = constructorStandings[0] ?? null;
  const top3 = lastRace?.Results?.slice(0, 3) ?? [];
  const season = schedule[0]?.season ?? new Date().getFullYear();
  const completedCount = schedule.filter(
    (r) => new Date(`${r.date}T${r.time ?? "23:59:59Z"}`) < new Date()
  ).length;
  const seasonComplete = schedule.length >= 20 && completedCount >= schedule.length;

  return (
    <div>
      {/* Hero */}
      <div className="border-b border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <p className="text-xs text-f1-red font-bold tracking-widest uppercase mb-1">Formula 1</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{season} Season</h1>
          <p className="text-muted mt-1 text-sm">Live timing · Championship standings · Historical records</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Left column ── */}
          <div className="space-y-4">

            {/* Next Race */}
            {nextRace ? (
              <section className="rounded-2xl border border-border bg-surface overflow-hidden">
                <div className="px-5 pt-5 pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={14} className="text-f1-red" />
                    <span className="text-xs text-muted uppercase tracking-wider font-semibold">
                      Round {nextRace.round} · Next Race
                    </span>
                    {nextRace.Sprint && (
                      <span className="text-xs bg-f1-red/20 text-f1-red border border-f1-red/30 rounded-full px-2 py-0.5 font-semibold ml-auto">
                        SPRINT WEEKEND
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold leading-tight">{nextRace.raceName}</h2>
                  <p className="text-muted text-sm mt-1">
                    {nextRace.Circuit.circuitName}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {nextRace.Circuit.Location.locality}, {nextRace.Circuit.Location.country} · {formatRaceDate(nextRace)}
                  </p>
                </div>
                <div className="px-5 pb-3">
                  <CountdownTimer targetISO={raceISO(nextRace)} label={nextRace.raceName} />
                </div>
                <Link
                  href={`/schedule/${nextRace.Circuit.circuitId}`}
                  className="flex items-center justify-between px-5 py-3 border-t border-border hover:bg-elevated transition-colors text-sm text-muted hover:text-foreground group"
                >
                  <span>Track details &amp; session schedule</span>
                  <ChevronRight size={14} className="group-hover:text-f1-red transition-colors" />
                </Link>
              </section>
            ) : (
              <div className="rounded-2xl border border-border bg-surface p-5 flex items-center gap-3">
                <AlertCircle size={20} className="text-muted shrink-0" />
                <div>
                  <p className="font-semibold">
                    {seasonComplete ? "Season complete" : "Season on break"}
                  </p>
                  <p className="text-muted text-sm mt-0.5">
                    {seasonComplete
                      ? "Tune in next year for the new season"
                      : "No upcoming round scheduled yet — check back soon"}
                  </p>
                </div>
              </div>
            )}

            {/* Season at a Glance */}
            <section className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={14} className="text-f1-red" />
                <p className="text-xs text-muted uppercase tracking-wider font-semibold">Season at a Glance</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-elevated rounded-xl p-4">
                  <p className="text-3xl font-bold text-f1-red">{schedule.length}</p>
                  <p className="text-xs text-muted mt-1">Rounds</p>
                </div>
                <div className="bg-elevated rounded-xl p-4">
                  <p className="text-3xl font-bold">{driverStandings.length}</p>
                  <p className="text-xs text-muted mt-1">Drivers</p>
                </div>
                <div className="bg-elevated rounded-xl p-4">
                  <p className="text-3xl font-bold">{constructorStandings.length}</p>
                  <p className="text-xs text-muted mt-1">Teams</p>
                </div>
              </div>
            </section>
          </div>

          {/* ── Right column ── */}
          <div className="space-y-4">

            {/* Championship Leaders */}
            <section className="rounded-2xl border border-border bg-surface">
              <div className="px-5 pt-5 pb-3 flex items-center gap-2">
                <Trophy size={15} className="text-gold" />
                <span className="text-xs text-muted uppercase tracking-wider font-semibold">
                  Championship Leaders
                </span>
              </div>
              <div className="divide-y divide-border">
                {leader && (
                  <Link
                    href={`/drivers/${leader.Driver.driverId}`}
                    className="px-5 py-4 flex items-center gap-3 hover:bg-elevated transition-colors group"
                  >
                    <div
                      className="w-1 h-12 rounded-full shrink-0"
                      style={{ background: getTeamColor(leader.Constructors[0]?.constructorId ?? "") }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted">Drivers Championship</p>
                      <p className="font-bold text-lg truncate group-hover:text-foreground">
                        {leader.Driver.givenName} {leader.Driver.familyName}
                      </p>
                      <p className="text-xs text-muted">{leader.Constructors[0]?.name}</p>
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-2">
                      <div>
                        <p className="text-3xl font-bold text-f1-red">{leader.points}</p>
                        <p className="text-xs text-muted">points</p>
                      </div>
                      <ChevronRight size={14} className="text-muted group-hover:text-f1-red transition-colors" />
                    </div>
                  </Link>
                )}
                {conLeader && (
                  <Link
                    href="/standings"
                    className="px-5 py-4 flex items-center gap-3 hover:bg-elevated transition-colors group"
                  >
                    <div
                      className="w-1 h-12 rounded-full shrink-0"
                      style={{ background: getTeamColor(conLeader.Constructor.constructorId) }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted">Constructors Championship</p>
                      <p className="font-bold text-lg truncate group-hover:text-foreground">{conLeader.Constructor.name}</p>
                      <p className="text-xs text-muted">{conLeader.wins} wins this season</p>
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-2">
                      <div>
                        <p className="text-3xl font-bold text-f1-red">{conLeader.points}</p>
                        <p className="text-xs text-muted">points</p>
                      </div>
                      <ChevronRight size={14} className="text-muted group-hover:text-f1-red transition-colors" />
                    </div>
                  </Link>
                )}
              </div>
            </section>

            {/* Last Race */}
            {lastRace && top3.length > 0 && (
              <section className="rounded-2xl border border-border bg-surface">
                <Link
                  href={`/schedule/${lastRace.Circuit.circuitId}`}
                  className="px-5 pt-5 pb-3 flex items-center gap-2 hover:bg-elevated transition-colors rounded-t-2xl group"
                >
                  <Flag size={14} className="text-muted" />
                  <span className="text-xs text-muted uppercase tracking-wider font-semibold flex-1">
                    Last Race — {lastRace.raceName}
                  </span>
                  <ChevronRight size={13} className="text-muted group-hover:text-f1-red transition-colors" />
                </Link>
                <div className="pb-4">
                  {top3.map((result, idx) => {
                    const medals = ["🥇", "🥈", "🥉"];
                    const podiumColors = ["text-gold", "text-silver", "text-bronze"];
                    return (
                      <Link
                        key={result.Driver.driverId}
                        href={`/drivers/${result.Driver.driverId}`}
                        className="px-5 py-2.5 flex items-center gap-3 hover:bg-elevated transition-colors"
                      >
                        <span className="text-xl w-7 text-center shrink-0">{medals[idx]}</span>
                        <div
                          className="w-1 h-9 rounded-full shrink-0"
                          style={{ background: getTeamColor(result.Constructor.constructorId) }}
                        />
                        <span
                          className="font-mono text-sm font-bold w-9 shrink-0"
                          style={{ color: getTeamColor(result.Constructor.constructorId) }}
                        >
                          {result.Driver.code}
                        </span>
                        <span className="flex-1 text-sm truncate">
                          {result.Driver.givenName} {result.Driver.familyName}
                        </span>
                        {result.Time?.time && (
                          <span className="text-xs text-muted font-mono hidden sm:block">
                            {idx === 0 ? result.Time.time : `+${result.Time.time}`}
                          </span>
                        )}
                        <span className={`text-sm font-bold w-10 text-right shrink-0 ${podiumColors[idx]}`}>
                          {result.points}pt
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

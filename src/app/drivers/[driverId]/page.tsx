import { Metadata } from "next";
import Link from "next/link";
import { getDriverStandings, getDriverSeasonResults } from "@/lib/api";
import { getTeamColor, getFlag } from "@/lib/teamColors";
import { ArrowLeft, Trophy, Flag, Circle } from "lucide-react";

interface Props {
  params: Promise<{ driverId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { driverId } = await params;
  return { title: driverId.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) };
}

const POSITION_STYLE: Record<string, string> = {
  "1": "text-gold font-bold",
  "2": "text-silver font-bold",
  "3": "text-bronze font-bold",
};

const COUNTRY_FLAGS: Record<string, string> = {
  Australia: "🇦🇺", Bahrain: "🇧🇭", "Saudi Arabia": "🇸🇦", Japan: "🇯🇵",
  China: "🇨🇳", USA: "🇺🇸", "United States": "🇺🇸", Monaco: "🇲🇨",
  Canada: "🇨🇦", Spain: "🇪🇸", Austria: "🇦🇹", "United Kingdom": "🇬🇧",
  Hungary: "🇭🇺", Belgium: "🇧🇪", Netherlands: "🇳🇱", Italy: "🇮🇹",
  Azerbaijan: "🇦🇿", Singapore: "🇸🇬", Mexico: "🇲🇽", Brazil: "🇧🇷",
  "United Arab Emirates": "🇦🇪",
};

function getCountryFlag(country: string): string {
  return COUNTRY_FLAGS[country] ?? "🏁";
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function calcAge(dob: string): number {
  return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}

export default async function DriverDetailPage({ params }: Props) {
  const { driverId } = await params;

  const [standings, races] = await Promise.all([
    getDriverStandings(),
    getDriverSeasonResults(driverId),
  ]);

  const standing = standings.find((s) => s.Driver.driverId === driverId);
  const driver = standing?.Driver ?? races[0]?.Results?.[0]?.Driver;
  const constructor = standing?.Constructors[0] ?? races[0]?.Results?.[0]?.Constructor;

  if (!driver) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-muted">Driver not found.</p>
        <Link href="/drivers" className="text-f1-red text-sm mt-4 inline-block hover:underline">
          ← Back to drivers
        </Link>
      </div>
    );
  }

  const color = getTeamColor(constructor?.constructorId ?? "");
  const wins = races.filter((r) => r.Results?.[0]?.position === "1");
  const podiums = races.filter((r) => ["1", "2", "3"].includes(r.Results?.[0]?.position ?? ""));
  const dnfs = races.filter((r) => r.Results?.[0]?.status && !r.Results[0].status.startsWith("Finished") && r.Results[0].status !== "+1 Lap" && r.Results[0].status !== "+2 Laps");
  const totalPoints = races.reduce((sum, r) => sum + parseFloat(r.Results?.[0]?.points ?? "0"), 0);

  return (
    <div>
      {/* Driver header */}
      <div className="border-b border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Link
            href="/drivers"
            className="inline-flex items-center gap-1.5 text-muted hover:text-foreground text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={14} /> Back to drivers
          </Link>

          <div className="flex items-start gap-5">
            {/* Team color bar */}
            <div className="w-2 rounded-full self-stretch shrink-0" style={{ background: color }} />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider mb-1">
                    {getFlag(driver.nationality)} {driver.nationality}
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                    {driver.givenName} <span style={{ color }}>{driver.familyName}</span>
                  </h1>
                  <p className="text-muted mt-1">{constructor?.name}</p>
                </div>
                <div
                  className="px-5 py-3 rounded-2xl font-mono font-black text-3xl shrink-0"
                  style={{ background: `${color}20`, color }}
                >
                  #{driver.permanentNumber}
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                <div className="bg-elevated rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold" style={{ color }}>{standing?.position ?? "—"}</p>
                  <p className="text-xs text-muted mt-0.5">Championship</p>
                </div>
                <div className="bg-elevated rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold">{standing?.points ?? totalPoints}</p>
                  <p className="text-xs text-muted mt-0.5">Points</p>
                </div>
                <div className="bg-elevated rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-gold">{wins.length}</p>
                  <p className="text-xs text-muted mt-0.5">Wins</p>
                </div>
                <div className="bg-elevated rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold">{calcAge(driver.dateOfBirth)}</p>
                  <p className="text-xs text-muted mt-0.5">Age</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Wins + Podiums ── */}
          <div className="space-y-5">

            {/* Race wins */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Trophy size={14} className="text-gold" />
                <h2 className="text-xs text-muted uppercase tracking-wider font-semibold">
                  {wins.length > 0 ? `${wins.length} Win${wins.length > 1 ? "s" : ""} This Season` : "No Wins Yet This Season"}
                </h2>
              </div>

              {wins.length === 0 ? (
                <div className="bg-surface border border-border rounded-xl p-4 text-center text-muted text-sm">
                  No wins recorded yet
                </div>
              ) : (
                <div className="space-y-2">
                  {wins.map((race) => (
                    <div key={race.round} className="bg-surface border border-gold/30 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{getCountryFlag(race.Circuit.Location.country)}</span>
                            <p className="font-bold text-sm">{race.raceName}</p>
                          </div>
                          <p className="text-xs text-muted">{race.Circuit.circuitName}</p>
                          <p className="text-xs text-muted mt-0.5">{formatDate(race.date)}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs bg-gold/20 text-gold border border-gold/30 rounded-full px-2 py-0.5 font-bold">
                            🏆 P1
                          </span>
                          {race.Results?.[0]?.Time?.time && (
                            <p className="text-xs text-muted font-mono mt-1">{race.Results[0].Time.time}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Season summary */}
            <section className="bg-surface border border-border rounded-xl p-4">
              <h2 className="text-xs text-muted uppercase tracking-wider font-semibold mb-3">Season Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Races entered</span>
                  <span className="font-semibold">{races.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Podiums</span>
                  <span className="font-semibold">{podiums.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Wins</span>
                  <span className="font-semibold text-gold">{wins.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">DNFs</span>
                  <span className="font-semibold text-f1-red">{dnfs.length}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 mt-2">
                  <span className="text-muted">Total points</span>
                  <span className="font-bold" style={{ color }}>{totalPoints}</span>
                </div>
              </div>
            </section>
          </div>

          {/* ── Right: All results ── */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Flag size={14} className="text-muted" />
              <h2 className="text-xs text-muted uppercase tracking-wider font-semibold">
                All Results — {races.length} Races
              </h2>
            </div>

            {races.length === 0 ? (
              <div className="bg-surface border border-border rounded-xl p-8 text-center text-muted">
                No race data available yet
              </div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-elevated text-xs text-muted font-semibold uppercase tracking-wider border-b border-border">
                  <span className="col-span-1">Rd</span>
                  <span className="col-span-5">Race</span>
                  <span className="col-span-2">Circuit</span>
                  <span className="col-span-1 text-center">Pos</span>
                  <span className="col-span-2 text-right">Pts</span>
                  <span className="col-span-1 text-right hidden sm:block">Status</span>
                </div>

                {races.map((race, idx) => {
                  const result = race.Results?.[0];
                  const pos = result?.position ?? "—";
                  const posClass = POSITION_STYLE[pos] ?? "text-foreground";
                  const isWin = pos === "1";

                  return (
                    <div
                      key={race.round}
                      className={`grid grid-cols-12 gap-2 px-4 py-3 items-center border-b border-border last:border-0 text-sm
                        ${isWin ? "bg-gold/5" : idx % 2 === 0 ? "bg-surface" : "bg-elevated/50"}`}
                    >
                      <span className="col-span-1 font-mono text-xs text-muted">{race.round}</span>

                      <div className="col-span-5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base leading-none">{getCountryFlag(race.Circuit.Location.country)}</span>
                          <span className="font-medium truncate text-xs sm:text-sm">{race.raceName}</span>
                          {isWin && <span className="text-xs">🏆</span>}
                        </div>
                        <p className="text-xs text-muted mt-0.5">{formatDate(race.date)}</p>
                      </div>

                      <div className="col-span-2 min-w-0">
                        <p className="text-xs text-muted truncate hidden sm:block">{race.Circuit.circuitName}</p>
                        <p className="text-xs text-muted truncate sm:hidden">{race.Circuit.Location.country}</p>
                      </div>

                      <span className={`col-span-1 text-center font-mono text-sm ${posClass}`}>
                        {isNaN(Number(pos)) ? pos : `P${pos}`}
                      </span>

                      <span className="col-span-2 text-right font-semibold" style={{ color: parseFloat(result?.points ?? "0") > 0 ? color : undefined }}>
                        {result?.points ?? "—"}
                      </span>

                      <div className="col-span-1 text-right hidden sm:flex items-center justify-end">
                        <Circle
                          size={8}
                          fill="currentColor"
                          className={result?.status?.startsWith("Finished") || result?.status?.includes("Lap")
                            ? "text-green-500"
                            : "text-f1-red"}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

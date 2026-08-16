import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import { getRaceSchedule, getLastRaceResults } from "@/lib/api";
import type { Race } from "@/lib/types";
import { MapPin, Clock, CheckCircle, ChevronRight } from "lucide-react";
import LocalTime from "@/components/LocalTime";

export const metadata: Metadata = { title: "Schedule" };

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

function formatSessionDate(race: Race): string {
  return new Date(race.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}


function isPast(race: Race): boolean {
  return new Date(`${race.date}T${race.time ?? "23:59:59Z"}`) < new Date();
}

function isThisWeekend(race: Race): boolean {
  const diff = new Date(race.date).getTime() - Date.now();
  return diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000;
}

export default async function SchedulePage() {
  const [races, lastRace] = await Promise.all([getRaceSchedule(), getLastRaceResults()]);
  const completed = races.filter(isPast);
  const upcoming = races.filter((r) => !isPast(r));

  return (
    <div>
      <Header
        title="Race Calendar"
        subtitle={`${races.length} rounds · ${races[0]?.season ?? ""} season`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section>
            <p className="text-xs text-muted uppercase tracking-wider font-semibold mb-3">
              Upcoming — {upcoming.length} races remaining
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {upcoming.map((race) => {
                const weekend = isThisWeekend(race);
                return (
                  <Link
                    key={race.round}
                    href={`/schedule/${race.Circuit.circuitId}`}
                    className={`rounded-xl border p-4 block hover:bg-elevated transition-colors group ${weekend ? "border-f1-red bg-f1-red/5" : "border-border bg-surface"}`}
                  >
                    {weekend && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="live-dot w-1.5 h-1.5 rounded-full bg-f1-red" />
                        <span className="text-xs text-f1-red font-bold tracking-wider">THIS WEEKEND</span>
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{getFlag(race.Circuit.Location.country)}</span>
                          <div>
                            <p className="font-bold text-sm leading-tight">{race.raceName}</p>
                            <p className="text-xs text-muted truncate">{race.Circuit.circuitName}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted mt-2">
                          <span className="flex items-center gap-1">
                            <MapPin size={10} />
                            {race.Circuit.Location.locality}
                          </span>
                          {race.time && (
                            <span className="flex items-center gap-1">
                              <Clock size={10} />
                              <LocalTime date={race.date} time={race.time} />
                            </span>
                          )}
                        </div>
                        {race.Sprint && (
                          <span className="mt-2 inline-block text-xs bg-f1-red/20 text-f1-red border border-f1-red/30 rounded-full px-2 py-0.5 font-semibold">
                            SPRINT
                          </span>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted">Round</p>
                        <p className="text-3xl font-bold text-f1-red leading-none">{race.round}</p>
                        <p className="text-xs font-semibold mt-1">{formatSessionDate(race)}</p>
                        <ChevronRight size={13} className="text-muted ml-auto mt-1 group-hover:text-f1-red transition-colors" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <section>
            <p className="text-xs text-muted uppercase tracking-wider font-semibold mb-3 flex items-center gap-2">
              <CheckCircle size={12} />
              Completed — {completed.length} races
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {[...completed].reverse().map((race) => {
                const isLastRace = race.round === lastRace?.round;
                return (
                  <Link
                    key={race.round}
                    href={`/schedule/${race.Circuit.circuitId}`}
                    className={`rounded-xl border px-4 py-3 flex items-center gap-3 group hover:bg-elevated transition-colors ${
                      isLastRace ? "border-border bg-elevated" : "border-border/40 bg-surface/60"
                    }`}
                  >
                    <span className="text-xl shrink-0">{getFlag(race.Circuit.Location.country)}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${isLastRace ? "text-foreground" : "text-muted"}`}>
                        {race.raceName}
                      </p>
                      <p className="text-xs text-muted">{formatSessionDate(race)}</p>
                    </div>
                    <div className="text-right shrink-0 flex flex-col items-end gap-0.5">
                      <p className="text-xs text-muted font-mono">R{race.round}</p>
                      {isLastRace && lastRace?.Results?.[0] && (
                        <p className="text-xs font-bold text-gold">{lastRace.Results[0].Driver.code}</p>
                      )}
                      <ChevronRight size={11} className="text-muted group-hover:text-f1-red transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

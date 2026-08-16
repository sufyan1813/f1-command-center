import { Metadata } from "next";
import Header from "@/components/Header";
import { getDriverStandings } from "@/lib/api";
import { getTeamColor, getFlag } from "@/lib/teamColors";
import { Star, Award } from "lucide-react";

export const metadata: Metadata = { title: "Drivers" };

function calcAge(dob: string): number {
  return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}

export default async function DriversPage() {
  const standings = await getDriverStandings();

  return (
    <div>
      <Header title="2025 Driver Grid" subtitle={`${standings.length} drivers`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {standings.map((standing) => {
            const driver = standing.Driver;
            const constructor = standing.Constructors[0];
            const color = getTeamColor(constructor?.constructorId ?? "");
            const pos = parseInt(standing.position);
            const age = calcAge(driver.dateOfBirth);

            return (
              <div
                key={driver.driverId}
                className="rounded-xl border border-border bg-surface overflow-hidden flex flex-col"
              >
                {/* Team color header */}
                <div className="h-1.5" style={{ background: color }} />

                <div className="p-4 flex flex-col flex-1">
                  {/* Position + car number */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold font-mono text-muted">{pos}</span>
                    <div
                      className="px-3 py-1 rounded-lg font-mono font-black text-sm"
                      style={{ background: `${color}20`, color }}
                    >
                      #{driver.permanentNumber || "—"}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="flex items-center gap-1.5 mb-1">
                    <h3 className="font-bold text-base leading-tight">
                      {driver.givenName} {driver.familyName}
                    </h3>
                    {pos === 1 && <Star size={13} className="text-gold shrink-0" fill="currentColor" />}
                  </div>
                  <p className="text-xs text-muted mb-3">{constructor?.name}</p>

                  {/* Stats */}
                  <div className="mt-auto grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-elevated rounded-lg p-2">
                      <p className="text-muted">{getFlag(driver.nationality)} Nationality</p>
                      <p className="font-semibold truncate">{driver.nationality}</p>
                    </div>
                    <div className="bg-elevated rounded-lg p-2">
                      <p className="text-muted">Age</p>
                      <p className="font-semibold">{age} yrs</p>
                    </div>
                  </div>

                  {/* Points + wins */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <div>
                      <p className="text-2xl font-bold" style={{ color }}>{standing.points}</p>
                      <p className="text-xs text-muted">points</p>
                    </div>
                    {parseInt(standing.wins) > 0 && (
                      <div className="flex items-center gap-1.5 bg-gold/10 px-3 py-1.5 rounded-lg">
                        <Award size={12} className="text-gold" />
                        <span className="text-sm font-bold text-gold">{standing.wins}W</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { Metadata } from "next";
import Header from "@/components/Header";
import { getConstructorStandings, getDriverStandings } from "@/lib/api";
import { getTeamColor } from "@/lib/teamColors";
import { Users, Trophy } from "lucide-react";

export const metadata: Metadata = { title: "Teams" };

const TEAM_BIOS: Record<string, { founded: string; base: string; chassis: string; engine: string; titles: number; fact: string }> = {
  red_bull:         { founded: "2005", base: "Milton Keynes, UK",    chassis: "RB21",      engine: "Honda RBPT", titles: 6, fact: "Dominant era started in 2010. Adrian Newey's aerodynamic genius drove 4 titles in a row 2010–2013." },
  ferrari:          { founded: "1950", base: "Maranello, Italy",     chassis: "SF-25",     engine: "Ferrari",    titles: 16, fact: "The most successful constructor in F1 history. Schumacher won 5 titles here 2000–2004." },
  mercedes:         { founded: "2010", base: "Brackley, UK",         chassis: "W16",       engine: "Mercedes",   titles: 8, fact: "Dominated the turbo-hybrid era 2014–2021. Hamilton won 6 of his 7 titles here." },
  mclaren:          { founded: "1966", base: "Woking, UK",           chassis: "MCL39",     engine: "Mercedes",   titles: 8, fact: "Senna & Prost era 1988–1991 is legendary. Now charging back with Lando Norris & Oscar Piastri." },
  aston_martin:     { founded: "2021", base: "Silverstone, UK",      chassis: "AMR25",     engine: "Mercedes",   titles: 0, fact: "Rebranded from Racing Point in 2021. Alonso joined in 2023 and brought instant podiums." },
  alpine:           { founded: "2021", base: "Enstone, UK",          chassis: "A525",      engine: "Renault",    titles: 0, fact: "Renault under the Alpine name. French team racing with a French engine — a rare pure pairing." },
  williams:         { founded: "1977", base: "Grove, UK",            chassis: "FW47",      engine: "Mercedes",   titles: 9, fact: "Mansell, Prost, Hill and Villeneuve all won here. 9 constructor titles 1980–1997 before the hybrid era decline." },
  haas:             { founded: "2016", base: "Kannapolis, USA",       chassis: "VF-25",     engine: "Ferrari",    titles: 0, fact: "America's only current F1 team. Uses Ferrari engines and gearbox." },
  sauber:           { founded: "1993", base: "Hinwil, Switzerland",   chassis: "C45",       engine: "Ferrari",    titles: 0, fact: "Transitioning to Audi works team from 2026. As BMW Sauber, Robert Kubica took a famous win at the 2008 Canadian GP." },
  rb:               { founded: "2006", base: "Faenza, Italy",         chassis: "VCARB 01",  engine: "Honda RBPT", titles: 0, fact: "Red Bull's junior team — formerly Toro Rosso, AlphaTauri. Vettel's first F1 win came here in 2008." },
  visa_cash_app_rb: { founded: "2006", base: "Faenza, Italy",         chassis: "VCARB 01",  engine: "Honda RBPT", titles: 0, fact: "Red Bull's junior team — formerly Toro Rosso, AlphaTauri. Vettel's first F1 win came here in 2008." },
};

export default async function TeamsPage() {
  const [constructors, driverStandings] = await Promise.all([
    getConstructorStandings(),
    getDriverStandings(),
  ]);

  const driversByTeam = new Map<string, string[]>();
  for (const ds of driverStandings) {
    const cid = ds.Constructors[0]?.constructorId ?? "";
    if (!driversByTeam.has(cid)) driversByTeam.set(cid, []);
    driversByTeam.get(cid)!.push(`${ds.Driver.givenName} ${ds.Driver.familyName}`);
  }

  return (
    <div>
      <Header title="Constructor Teams" subtitle={`${constructors.length} teams · ${new Date().getFullYear()}`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {constructors.map((c) => {
            const cid = c.Constructor.constructorId;
            const color = getTeamColor(cid);
            const bio = TEAM_BIOS[cid] ?? TEAM_BIOS[cid.replace(/-/g, "_")] ?? null;
            const drivers = driversByTeam.get(cid) ?? [];
            const pos = parseInt(c.position);

            return (
              <div key={cid} className="rounded-2xl border border-border bg-surface overflow-hidden flex flex-col">
                <div className="h-2" style={{ background: color }} />

                <div className="p-5 flex flex-col flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{c.Constructor.name}</h3>
                      <p className="text-xs text-muted">{c.Constructor.nationality}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold leading-none" style={{ color }}>P{pos}</p>
                      <p className="text-sm text-muted mt-0.5">{c.points} pts</p>
                    </div>
                  </div>

                  {/* Drivers */}
                  {drivers.length > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      <Users size={12} className="text-muted shrink-0" />
                      <p className="text-xs text-muted">{drivers.join("  ·  ")}</p>
                    </div>
                  )}

                  {/* Bio grid */}
                  {bio && (
                    <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                      <div className="bg-elevated rounded-lg p-2.5">
                        <p className="text-muted">Founded</p>
                        <p className="font-semibold">{bio.founded}</p>
                      </div>
                      <div className="bg-elevated rounded-lg p-2.5">
                        <p className="text-muted">Base</p>
                        <p className="font-semibold truncate">{bio.base}</p>
                      </div>
                      <div className="bg-elevated rounded-lg p-2.5">
                        <p className="text-muted">Chassis</p>
                        <p className="font-semibold">{bio.chassis}</p>
                      </div>
                      <div className="bg-elevated rounded-lg p-2.5">
                        <p className="text-muted">Engine</p>
                        <p className="font-semibold">{bio.engine}</p>
                      </div>
                    </div>
                  )}

                  {/* Titles */}
                  {bio && bio.titles > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <Trophy size={13} className="text-gold" />
                      <span className="text-xs text-gold font-semibold">
                        {bio.titles} Constructor Championship{bio.titles > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}

                  {/* Fun fact */}
                  {bio?.fact && (
                    <p className="text-xs text-muted leading-relaxed border-t border-border pt-3 mt-auto">
                      {bio.fact}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

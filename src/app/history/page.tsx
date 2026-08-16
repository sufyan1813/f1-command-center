import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import { getAllDriverChampions } from "@/lib/api";
import { getTeamColor } from "@/lib/teamColors";
import { Crown, Star } from "lucide-react";

export const metadata: Metadata = { title: "History" };

const STATIC_RECORDS = [
  { label: "Most Race Wins",          value: "104+",    holder: "Lewis Hamilton",         detail: "2007 – present (Ferrari 2025)" },
  { label: "Most Pole Positions",     value: "104+",    holder: "Lewis Hamilton",         detail: "Unmatched qualifying pace" },
  { label: "Most Constructor Titles", value: "16",      holder: "Ferrari",                detail: "1961–2008" },
  { label: "Youngest WDC",            value: "23 yrs",  holder: "Sebastian Vettel",       detail: "2010 — Red Bull Racing" },
  { label: "Youngest Race Winner",    value: "18 yrs",  holder: "Max Verstappen",         detail: "Spain GP 2016 (Red Bull)" },
  { label: "Most Podiums",            value: "197+",    holder: "Lewis Hamilton",         detail: "Consistent across 4 eras" },
  { label: "Most Wins in a Season",   value: "19/22",   holder: "Max Verstappen",         detail: "2023 — historic dominance" },
  { label: "Most Points in a Season", value: "575",     holder: "Max Verstappen",         detail: "2023 — 19 race wins" },
  { label: "Longest Career",          value: "~19 yrs", holder: "Rubens Barrichello",     detail: "1993–2011 (323 starts)" },
];

const ERAS = [
  { years: "1950–1961", name: "The Front-Engine Era",    desc: "Alfa Romeo, Ferrari, and Maserati dominated the early years. Fangio's 5 championships defined the sport's foundation." },
  { years: "1962–1973", name: "The British Invasion",    desc: "Lotus, BRM, Tyrrell reigned. Jim Clark, Jackie Stewart brought technical innovation and safety campaigns." },
  { years: "1974–1988", name: "Turbo Revolution",        desc: "The 1500hp turbocharged era — Renault, Ferrari, Honda. Senna, Lauda, Prost and Mansell defined a golden age." },
  { years: "1989–2005", name: "Modern Formula 1",        desc: "Senna's tragic 1994 forced sweeping safety changes. Schumacher's Ferrari dynasty 2000–2004 was awe-inspiring." },
  { years: "2006–2013", name: "The Aerodynamic War",     desc: "Alonso, Räikkönen, Hamilton, Vettel — 4 different champions in 4 years before Vettel's Red Bull four-peat." },
  { years: "2014–2021", name: "The Turbo Hybrid Era",    desc: "Mercedes dominance; Hamilton won 6 of 8 drivers' titles (Rosberg took 2016). Hamilton vs Verstappen's Abu Dhabi 2021 finale is one of F1's most controversial moments ever." },
  { years: "2022–now",  name: "Verstappen's Dominance", desc: "The ground-effect era brought Red Bull and Verstappen to historic dominance. 19 wins in 2023 shattered every record." },
];

export default async function HistoryPage() {
  const champions = await getAllDriverChampions();

  const multiChamps: Record<string, { count: number; driverId: string }> = {};
  for (const season of champions) {
    const ds = season.DriverStandings[0];
    if (!ds) continue;
    const name = `${ds.Driver.givenName} ${ds.Driver.familyName}`;
    if (!multiChamps[name]) multiChamps[name] = { count: 0, driverId: ds.Driver.driverId };
    multiChamps[name].count += 1;
  }

  // Compute dynamic "Most Driver Titles" from champions data
  const maxTitles = Math.max(1, ...Object.values(multiChamps).map((v) => v.count));
  const topNames = Object.entries(multiChamps)
    .filter(([, v]) => v.count === maxTitles)
    .map(([name]) => name.split(" ").pop()!);
  const titlesRecord = {
    label: "Most Driver Titles",
    value: topNames.length > 1 ? `${maxTitles} each` : `${maxTitles}`,
    holder: topNames.length > 1 ? topNames.join(" & ") : (Object.keys(multiChamps).find((n) => multiChamps[n].count === maxTitles) ?? "—"),
    detail: topNames.length > 1 ? `Record tied (${maxTitles} titles each)` : `Sole record holder`,
  };

  const RECORDS = [titlesRecord, ...STATIC_RECORDS];

  return (
    <div>
      <Header title="F1 History" subtitle={`${champions.length} seasons · 1950–present`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-10">

        {/* All-time records */}
        <section>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Crown size={16} className="text-gold" />
              <h2 className="text-xs text-muted uppercase tracking-wider font-semibold">All-time Records</h2>
            </div>
            <span className="text-xs text-muted hidden sm:block">Records verified through 2024</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {RECORDS.map((r) => (
              <div key={r.label} className="bg-surface border border-border rounded-xl p-4">
                <p className="text-xs text-muted leading-tight">{r.label}</p>
                <p className="text-2xl font-bold text-f1-red mt-1.5">{r.value}</p>
                <p className="text-xs font-semibold mt-1 truncate">{r.holder}</p>
                <p className="text-xs text-muted mt-0.5 leading-tight">{r.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Eras + Champions side-by-side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* F1 Eras */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Star size={14} className="text-muted" />
              <h2 className="text-xs text-muted uppercase tracking-wider font-semibold">The Eras of F1</h2>
            </div>
            <div className="space-y-2">
              {ERAS.map((era) => (
                <div key={era.years} className="bg-surface border border-border rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-sm">{era.name}</h3>
                    <span className="text-xs text-f1-red font-mono font-semibold shrink-0">{era.years}</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{era.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* World Champions */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Crown size={14} className="text-gold" />
              <h2 className="text-xs text-muted uppercase tracking-wider font-semibold">
                World Champions ({champions.length})
              </h2>
            </div>
            <div className="space-y-1.5">
              {champions.map((season) => {
                const ds = season.DriverStandings[0];
                if (!ds) return null;
                const cid = ds.Constructors[0]?.constructorId ?? "";
                const color = getTeamColor(cid);
                const fullName = `${ds.Driver.givenName} ${ds.Driver.familyName}`;
                const count = multiChamps[fullName]?.count ?? 1;
                return (
                  <Link
                    key={season.season}
                    href={`/drivers/${ds.Driver.driverId}`}
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2.5 hover:bg-elevated hover:border-f1-red/30 transition-colors group"
                  >
                    <span className="font-mono font-bold text-f1-red w-10 shrink-0 text-sm">
                      {season.season}
                    </span>
                    <div className="w-1 h-8 rounded-full shrink-0" style={{ background: color }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate group-hover:text-foreground">{fullName}</p>
                      <p className="text-xs text-muted truncate">{ds.Constructors[0]?.name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {count > 1 && <span className="text-xs text-gold font-bold block">×{count}</span>}
                      <p className="text-xs text-muted">{ds.points}pts</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

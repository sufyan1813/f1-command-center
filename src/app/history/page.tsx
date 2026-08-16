import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import { getSeasonDrivers } from "@/lib/api";
import { getTeamColor } from "@/lib/teamColors";
import { Crown, Star } from "lucide-react";
import { F1_CHAMPIONS } from "@/lib/championsData";

export const metadata: Metadata = { title: "History" };

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
  const currentDrivers = await getSeasonDrivers();
  const activeDriverIds = new Set(currentDrivers.map((d) => d.driverId));

  // Sorted newest first (F1_CHAMPIONS is oldest-first)
  const champions = [...F1_CHAMPIONS].reverse();

  // Count titles per driver
  const titleCounts: Record<string, number> = {};
  for (const c of F1_CHAMPIONS) {
    const key = `${c.givenName} ${c.familyName}`;
    titleCounts[key] = (titleCounts[key] ?? 0) + 1;
  }

  // Compute Most Driver Titles dynamically
  const maxTitles = Math.max(...Object.values(titleCounts));
  const topNames = Object.entries(titleCounts)
    .filter(([, count]) => count === maxTitles)
    .map(([name]) => name.split(" ").pop()!);
  const titlesHolder =
    topNames.length > 1
      ? topNames.join(" & ")
      : (Object.keys(titleCounts).find((n) => titleCounts[n] === maxTitles) ?? "—");

  const RECORDS = [
    { label: "Most Driver Titles",      value: topNames.length > 1 ? `${maxTitles} each` : `${maxTitles}`, holder: titlesHolder, detail: topNames.length > 1 ? "Record shared" : "Sole record holder" },
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
              {champions.map((c) => {
                const color = getTeamColor(c.constructorId);
                const fullName = `${c.givenName} ${c.familyName}`;
                const count = titleCounts[fullName] ?? 1;
                const isActive = activeDriverIds.has(c.driverId);
                const rowContent = (
                  <>
                    <span className="font-mono font-bold text-f1-red w-10 shrink-0 text-sm">
                      {c.season}
                    </span>
                    <div className="w-1 h-8 rounded-full shrink-0" style={{ background: color }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{fullName}</p>
                      <p className="text-xs text-muted truncate">{c.constructorName}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {count > 1 && <span className="text-xs text-gold font-bold block">×{count}</span>}
                      <p className="text-xs text-muted">{c.points}pts</p>
                    </div>
                  </>
                );
                return isActive ? (
                  <Link
                    key={c.season}
                    href={`/drivers/${c.driverId}`}
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2.5 hover:bg-elevated hover:border-f1-red/30 transition-colors"
                  >
                    {rowContent}
                  </Link>
                ) : (
                  <div
                    key={c.season}
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2.5"
                  >
                    {rowContent}
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

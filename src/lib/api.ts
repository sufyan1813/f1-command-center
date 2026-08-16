import type {
  Race, DriverStanding, ConstructorStanding, Driver,
  ChampionSeason, ConstructorChampionSeason,
  OF1Session, OF1Driver, OF1Position, OF1Interval, OF1Stint, OF1RaceControl,
} from "./types";

const JOLPICA = "https://api.jolpi.ca/ergast/f1";
const OF1 = "https://api.openf1.org/v1";

async function jolpicaFetch<T>(path: string, revalidate = 300): Promise<T | null> {
  try {
    const res = await fetch(`${JOLPICA}${path}`, { next: { revalidate } });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

async function openf1Fetch<T>(path: string, noStore = false): Promise<T[]> {
  try {
    const res = await fetch(`${OF1}${path}`, noStore ? { cache: "no-store" } : { next: { revalidate: 30 } });
    if (!res.ok) return [];
    return res.json() as Promise<T[]>;
  } catch {
    return [];
  }
}

// ──────────────── Jolpica / Ergast ────────────────

export async function getDriverStandings(): Promise<DriverStanding[]> {
  const data = await jolpicaFetch<{ MRData: { StandingsTable: { StandingsLists: Array<{ DriverStandings: DriverStanding[] }> } } }>(
    "/current/driverStandings.json"
  );
  return data?.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [];
}

export async function getConstructorStandings(): Promise<ConstructorStanding[]> {
  const data = await jolpicaFetch<{ MRData: { StandingsTable: { StandingsLists: Array<{ ConstructorStandings: ConstructorStanding[] }> } } }>(
    "/current/constructorStandings.json"
  );
  return data?.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? [];
}

export async function getRaceSchedule(): Promise<Race[]> {
  const data = await jolpicaFetch<{ MRData: { RaceTable: { Races: Race[] } } }>(
    "/current.json", 3600
  );
  return data?.MRData.RaceTable.Races ?? [];
}

export async function getLastRaceResults(): Promise<Race | null> {
  const data = await jolpicaFetch<{ MRData: { RaceTable: { Races: Race[] } } }>(
    "/current/last/results.json"
  );
  return data?.MRData.RaceTable.Races[0] ?? null;
}

export async function getSeasonDrivers(): Promise<Driver[]> {
  const data = await jolpicaFetch<{ MRData: { DriverTable: { Drivers: Driver[] } } }>(
    "/current/drivers.json", 3600
  );
  return data?.MRData.DriverTable.Drivers ?? [];
}

export async function getDriverStandingsWithRounds(): Promise<DriverStanding[]> {
  return getDriverStandings();
}

export async function getAllDriverChampions(): Promise<ChampionSeason[]> {
  const data = await jolpicaFetch<{ MRData: { StandingsTable: { StandingsLists: ChampionSeason[] } } }>(
    "/driverStandings/1.json?limit=100", 86400
  );
  return (data?.MRData.StandingsTable.StandingsLists ?? []).reverse();
}

export async function getAllConstructorChampions(): Promise<ConstructorChampionSeason[]> {
  const data = await jolpicaFetch<{ MRData: { StandingsTable: { StandingsLists: ConstructorChampionSeason[] } } }>(
    "/constructorStandings/1.json?limit=100", 86400
  );
  return (data?.MRData.StandingsTable.StandingsLists ?? []).reverse();
}

// ──────────────── OpenF1 ────────────────

export async function getLatestSession(): Promise<OF1Session | null> {
  const data = await openf1Fetch<OF1Session>("/sessions?session_key=latest", true);
  return data[0] ?? null;
}

export async function getSessionDrivers(sessionKey: number): Promise<OF1Driver[]> {
  return openf1Fetch<OF1Driver>(`/drivers?session_key=${sessionKey}`);
}

export async function getLatestPositions(sessionKey: number): Promise<OF1Position[]> {
  const all = await openf1Fetch<OF1Position>(`/position?session_key=${sessionKey}`, true);
  const latest = new Map<number, OF1Position>();
  for (const p of all) {
    const ex = latest.get(p.driver_number);
    if (!ex || p.date > ex.date) latest.set(p.driver_number, p);
  }
  return Array.from(latest.values()).sort((a, b) => a.position - b.position);
}

export async function getLatestIntervals(sessionKey: number): Promise<OF1Interval[]> {
  const all = await openf1Fetch<OF1Interval>(`/intervals?session_key=${sessionKey}`, true);
  const latest = new Map<number, OF1Interval>();
  for (const iv of all) {
    const ex = latest.get(iv.driver_number);
    if (!ex || iv.date > ex.date) latest.set(iv.driver_number, iv);
  }
  return Array.from(latest.values());
}

export async function getCurrentStints(sessionKey: number): Promise<OF1Stint[]> {
  const all = await openf1Fetch<OF1Stint>(`/stints?session_key=${sessionKey}`, true);
  const latest = new Map<number, OF1Stint>();
  for (const s of all) {
    const ex = latest.get(s.driver_number);
    if (!ex || s.stint_number > ex.stint_number) latest.set(s.driver_number, s);
  }
  return Array.from(latest.values());
}

export async function getRaceControlMessages(sessionKey: number): Promise<OF1RaceControl[]> {
  const data = await openf1Fetch<OF1RaceControl>(`/race_control?session_key=${sessionKey}`, true);
  return data.slice(-10).reverse();
}

// ──────────────── Utilities ────────────────

export async function getCircuitHistory(circuitId: string): Promise<Race[]> {
  const data = await jolpicaFetch<{ MRData: { RaceTable: { Races: Race[] } } }>(
    `/circuits/${circuitId}/results/1.json?limit=30`,
    86400
  );
  return data?.MRData.RaceTable.Races ?? [];
}

export async function getDriverSeasonResults(driverId: string): Promise<Race[]> {
  const data = await jolpicaFetch<{ MRData: { RaceTable: { Races: Race[] } } }>(
    `/current/drivers/${driverId}/results.json?limit=30`,
    300
  );
  return data?.MRData.RaceTable.Races ?? [];
}

function toRaceDate(r: Race): Date {
  // API returns times with trailing Z (e.g. "13:10:00Z"); strip it before
  // re-appending so we never produce an invalid double-Z ISO string.
  const time = r.time ? r.time.replace(/Z$/, "") : "00:00:00";
  return new Date(`${r.date}T${time}Z`);
}

export function getNextRace(races: Race[]): Race | null {
  const now = new Date();
  return races.find((r) => toRaceDate(r) > now) ?? null;
}

export function getLastCompletedRace(races: Race[]): Race | null {
  const now = new Date();
  const past = races.filter((r) => toRaceDate(r) <= now);
  return past[past.length - 1] ?? null;
}

export function formatLapTime(seconds: number | null): string {
  if (seconds === null || seconds === undefined) return "—";
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toFixed(3).padStart(6, "0");
  return m > 0 ? `${m}:${s}` : `${s}`;
}

export function formatGap(gap: number | null): string {
  if (gap === null || gap === undefined) return "—";
  return gap === 0 ? "Leader" : `+${gap.toFixed(3)}`;
}

export function isSessionLive(session: OF1Session | null): boolean {
  if (!session) return false;
  const now = new Date();
  const start = new Date(session.date_start);
  const end = new Date(session.date_end);
  return now >= start && now <= end;
}

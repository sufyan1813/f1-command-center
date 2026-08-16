import { Metadata } from "next";
import { getDriverStandings, getConstructorStandings, getRaceSchedule } from "@/lib/api";
import StandingsTabs from "./StandingsTabs";

export const metadata: Metadata = { title: "Standings" };

export default async function StandingsPage() {
  const [drivers, constructors, schedule] = await Promise.all([
    getDriverStandings(),
    getConstructorStandings(),
    getRaceSchedule(),
  ]);
  const season = schedule[0]?.season ?? String(new Date().getFullYear());
  return <StandingsTabs drivers={drivers} constructors={constructors} season={season} />;
}

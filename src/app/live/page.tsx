import { getRaceSchedule } from "@/lib/api";
import LiveClient from "./LiveClient";

export default async function LivePage() {
  const schedule = await getRaceSchedule();
  return <LiveClient schedule={schedule} />;
}

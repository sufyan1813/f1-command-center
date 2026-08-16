"use client";

import { useEffect, useState } from "react";

interface Props {
  date: string;
  time?: string;
  className?: string;
}

function utcFallback(time?: string): string {
  const t = (time ?? "00:00:00").replace(/Z$/, "");
  const [hStr, mStr] = t.split(":");
  return `${String(hStr ?? "00").padStart(2, "0")}:${String(mStr ?? "00").padStart(2, "0")} UTC`;
}

export default function LocalTime({ date, time, className = "text-xs font-mono text-muted" }: Props) {
  const [local, setLocal] = useState<string | null>(null);

  useEffect(() => {
    const t = time ? time.replace(/Z$/, "") : "00:00:00";
    const d = new Date(`${date}T${t}Z`);
    if (isNaN(d.getTime())) return;
    setLocal(
      d.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      })
    );
  }, [date, time]);

  return (
    <span className={className}>
      {utcFallback(time)}
      {local && <> · {local}</>}
    </span>
  );
}

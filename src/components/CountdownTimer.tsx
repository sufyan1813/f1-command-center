"use client";

import { useEffect, useState } from "react";

interface Props {
  targetISO: string;
  label: string;
}

function calcRemaining(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, done: true };
  const secs = Math.floor(diff / 1000);
  return {
    days: Math.floor(secs / 86400),
    hours: Math.floor((secs % 86400) / 3600),
    mins: Math.floor((secs % 3600) / 60),
    secs: secs % 60,
    done: false,
  };
}

function Digit({ n, unit }: { n: number; unit: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-elevated rounded-lg px-3 py-2 min-w-[52px] text-center border border-border">
        <span className="text-2xl font-bold font-mono tabular-nums">
          {String(n).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] text-muted mt-1 uppercase tracking-wider">{unit}</span>
    </div>
  );
}

export default function CountdownTimer({ targetISO, label }: Props) {
  const [t, setT] = useState(() => calcRemaining(targetISO));

  useEffect(() => {
    if (t.done) return;
    const id = setInterval(() => setT(calcRemaining(targetISO)), 1000);
    return () => clearInterval(id);
  }, [targetISO, t.done]);

  if (t.done) {
    return (
      <div className="flex items-center justify-center gap-2 py-3">
        <span className="live-dot w-2 h-2 rounded-full bg-f1-red" />
        <span className="text-f1-red font-bold text-sm tracking-wider uppercase">
          {label} — ON NOW
        </span>
      </div>
    );
  }

  return (
    <div className="flex gap-3 justify-center py-2">
      <Digit n={t.days} unit="days" />
      <Digit n={t.hours} unit="hrs" />
      <Digit n={t.mins} unit="min" />
      <Digit n={t.secs} unit="sec" />
    </div>
  );
}

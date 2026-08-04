import { useState, useEffect } from "react";

export function AugustPromoCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date("2026-08-31T23:59:59").getTime();
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex items-center justify-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400">
      <span className="text-xs uppercase tracking-wide">Ends in</span>
      <div className="flex gap-1">
        <span className="rounded bg-amber-500/15 px-2 py-0.5 font-mono font-bold">{pad(timeLeft.days)}d</span>
        <span className="rounded bg-amber-500/15 px-2 py-0.5 font-mono font-bold">{pad(timeLeft.hours)}h</span>
        <span className="rounded bg-amber-500/15 px-2 py-0.5 font-mono font-bold">{pad(timeLeft.minutes)}m</span>
        <span className="rounded bg-amber-500/15 px-2 py-0.5 font-mono font-bold">{pad(timeLeft.seconds)}s</span>
      </div>
    </div>
  );
}

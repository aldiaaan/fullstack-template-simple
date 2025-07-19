import { intervalToDuration } from "date-fns";

export function formatDurationWithMs(startMs: number, endMs: number) {
  if (startMs > endMs) {
    [startMs, endMs] = [endMs, startMs];
  }

  const durationObj = intervalToDuration({
    start: startMs,
    end: endMs,
  });

  const units = ["years", "months", "days", "hours", "minutes", "seconds"];
  const parts = [];

  for (const unit of units) {
    // @ts-ignore
    const value = durationObj[unit];
    if (value > 0) {
      const label = value === 1 ? unit.slice(0, -1) : unit;
      parts.push(`${value} ${label}`);
    }
  }

  const remainingMs = (endMs - startMs) % 1000;
  if (remainingMs > 0) {
    parts.push(`${remainingMs} ms`);
  }

  if (parts.length === 0) {
    return "0 ms";
  }

  return parts.join(" ");
}

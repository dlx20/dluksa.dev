"use client";

import { useNow } from "./hooks";

// 3x5 block digits, drawn two characters wide
const DIGITS: Record<string, string[]> = {
  "0": ["███", "█ █", "█ █", "█ █", "███"],
  "1": ["  █", "  █", "  █", "  █", "  █"],
  "2": ["███", "  █", "███", "█  ", "███"],
  "3": ["███", "  █", "███", "  █", "███"],
  "4": ["█ █", "█ █", "███", "  █", "  █"],
  "5": ["███", "█  ", "███", "  █", "███"],
  "6": ["███", "█  ", "███", "█ █", "███"],
  "7": ["███", "  █", "  █", "  █", "  █"],
  "8": ["███", "█ █", "███", "█ █", "███"],
  "9": ["███", "█ █", "███", "  █", "███"],
  "-": ["   ", "   ", "███", "   ", "   "],
};

const ZONES = [
  ["london", "Europe/London"],
  ["new york", "America/New_York"],
  ["san francisco", "America/Los_Angeles"],
  ["tokyo", "Asia/Tokyo"],
] as const;

const clockTime = (date: Date, timeZone: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);

// "12:34" as five rows of block characters, with a colon that can blink
const bigTime = (time: string, colon: boolean) =>
  Array.from({ length: 5 }, (_, row) =>
    [...time]
      .map((char) =>
        char === ":"
          ? colon && (row === 1 || row === 3)
            ? "██"
            : "  "
          : DIGITS[char][row].replace(/█/g, "██").replace(/ /g, "  "),
      )
      .join(" "),
  ).join("\n");

// "Europe/London" -> "london"
const cityName = (timeZone: string) =>
  (timeZone.split("/").pop() ?? timeZone).replace(/_/g, " ").toLowerCase();

// London time in big digits, plus other cities and the visitor's own zone
export default function ClockWidget({ active }: { active: boolean }) {
  const now = useNow(active);
  const londonTime = now ? clockTime(now, "Europe/London") : "--:--";

  // The visitor's zone, when it isn't one of the cities already listed
  const ownZone = now ? Intl.DateTimeFormat().resolvedOptions().timeZone : null;
  const zones: (readonly [string, string])[] =
    ownZone && !ZONES.some(([, zone]) => zone === ownZone)
      ? [...ZONES, [`${cityName(ownZone)} (you)`, ownZone]]
      : [...ZONES];

  const date = now
    ? now
        .toLocaleDateString("en-GB", {
          timeZone: "Europe/London",
          weekday: "short",
          day: "numeric",
          month: "short",
        })
        .toLowerCase()
    : "";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end justify-between gap-2">
        <pre
          role="img"
          aria-label={`London time ${londonTime}`}
          className="font-ubuntu-mono text-ui leading-none text-accent"
        >
          {bigTime(londonTime, !now || now.getSeconds() % 2 === 0)}
        </pre>
        <span className="text-ui text-fg-muted">{date}</span>
      </div>
      <pre className="font-ubuntu-mono text-ui leading-snug">
        {zones.map(([name, zone], i) => (
          <span key={zone} className="flex justify-between">
            <span className={i === 0 ? "text-accent" : "text-fg-muted"}>
              {i === 0 ? "●" : "○"} {name}
            </span>
            <span className={i === 0 ? "text-accent" : "text-fg-base"}>
              {now ? clockTime(now, zone) : "--:--"}
            </span>
          </span>
        ))}
      </pre>
    </div>
  );
}

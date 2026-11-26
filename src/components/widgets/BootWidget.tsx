"use client";

import { useReducedMotion, useTicker } from "./hooks";

const LINES = [
  ["OK", "Started ddev.service"],
  ["OK", "Mounted /home/ddev/projects"],
  ["OK", "Reached target coffee.target"],
  ["OK", "Started next-server on :3000"],
  ["WARN", "caffeine below threshold"],
  ["OK", "Loaded 5 themes, 7 accents"],
  ["OK", 'Started tmux session "menu"'],
  ["OK", "Reached target graphical.target"],
] as const;

// Lines shown at once, and steps to wait at the login prompt before rebooting
const VISIBLE = 6;
const HOLD = 8;

// A systemd-style boot log for the site that types itself out on a loop
export default function BootWidget({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const tick = useTicker(active && !reduced, 450);

  // With reduced motion, show the finished log instead of animating it
  const step = reduced ? LINES.length + 1 : tick % (LINES.length + 1 + HOLD);
  const shown = LINES.slice(0, Math.min(step, LINES.length));
  const done = step > LINES.length;

  return (
    // Always six lines tall, so the widgets below don't jump as it types
    <pre
      className="font-ubuntu-mono text-ui leading-snug"
      style={{ minHeight: `${VISIBLE * 1.375}em` }}
    >
      {shown.length < VISIBLE && (
        <span className="block text-fg-muted">booting dluksa.dev…</span>
      )}
      {shown.slice(-VISIBLE + (done ? 1 : 0)).map(([status, message]) => (
        <span key={message} className="block">
          [
          <span className={status === "OK" ? "text-accent" : "text-warning"}>
            {status === "OK" ? "  OK  " : " WARN "}
          </span>
          ] {message}
        </span>
      ))}
      {done && (
        <span className="block">
          <span className="text-accent">ddev login:</span>{" "}
          <span className="animate-blink">_</span>
        </span>
      )}
    </pre>
  );
}

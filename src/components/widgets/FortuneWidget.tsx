"use client";

import { useReducedMotion, useTicker } from "./hooks";

const QUOTES = [
  "there's no place like 127.0.0.1",
  "it works on my machine",
  "i use arch, btw",
  "rm -rf node_modules && pray",
  "naming things is hard",
  "git push --force is a lifestyle",
  "ctrl+c, ctrl+v, ship it",
  "tabs vs spaces? monospace.",
];

// Steps to hold a finished quote before typing the next one
const HOLD = 60;

// Bubble width fits the longest quote, so the layout never jumps
const WIDTH = Math.max(...QUOTES.map((q) => q.length));

// Which quote is showing and how much of it is typed, `tick` steps into the loop
const typedAt = (tick: number) => {
  let left = tick % QUOTES.reduce((sum, q) => sum + q.length + HOLD, 0);
  for (const quote of QUOTES) {
    if (left < quote.length + HOLD) return quote.slice(0, left);
    left -= quote.length + HOLD;
  }
  return "";
};

// A small robot reading out dev one-liners, `fortune | cowsay` style
export default function FortuneWidget({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const tick = useTicker(active && !reduced, 40);

  // With reduced motion, show the first quote whole instead of typing it
  const text = reduced ? QUOTES[0] : typedAt(tick);

  return (
    <pre className="font-ubuntu-mono text-ui leading-snug text-fg-base">
      {` ${"_".repeat(WIDTH + 2)}\n`}
      {"< "}
      <span className="text-accent">{text.padEnd(WIDTH)}</span>
      {" >\n"}
      {` ${"-".repeat(WIDTH + 2)}\n`}
      <span className="text-fg-muted">{"    \\   "}</span>
      <span className="text-primary">{"[o_o]\n"}</span>
      <span className="text-fg-muted">{"     \\  "}</span>
      <span className="text-primary">{"/|_|\\\n"}</span>
      <span className="text-primary">{"         / \\"}</span>
    </pre>
  );
}

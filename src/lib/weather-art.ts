// ASCII drawings for the weather pane, one frame at a time

import type { WeatherKind } from "./weather";

// What each character is part of, so the pane can color it
export type Tone =
  | "sun"
  | "moon"
  | "star"
  | "cloud"
  | "fog"
  | "rain"
  | "snow"
  | "bolt";

export type Grid = [char: string, tone: Tone][][];

// Drawing size in characters
const W = 18;
const H = 7;

const SUN = [
  [
    "  \\  |  /  ",
    "   .---.   ",
    "--(     )--",
    "   '---'   ",
    "  /  |  \\  ",
  ],
  [
    "  .  '  .  ",
    "   .---.   ",
    "- (     ) -",
    "   '---'   ",
    "  '  .  '  ",
  ],
];

const MOON = ["  .--.  ", " /  .'  ", "|  (    ", " \\  '.  ", "  '--'  "];

const CLOUD = ["   .-~~~~-.   ", ".-(        )-.", "(____________)"];

const SMALL_CLOUD = [" .-~-. ", "(_____)"];

const BOLT = ["  /", " /_", "  /", " /"];

const STARS = [[1, 1], [16, 0], [15, 3], [2, 5], [13, 6]];

// Snowflake columns and their starting offsets
const FLAKES = [[3, 0], [6, 2], [9, 1], [12, 3], [15, 0], [5, 3], [11, 2], [14, 1]];

// Milliseconds per animation frame
export const FRAME_MS: Record<WeatherKind, number> = {
  clear: 700,
  partly: 700,
  cloudy: 900,
  fog: 500,
  rain: 150,
  storm: 150,
  snow: 350,
};

const blank = (): Grid =>
  Array.from({ length: H }, () =>
    Array.from({ length: W }, (): [string, Tone] => [" ", "cloud"]),
  );

// Draw lines onto the grid at (x, y). Spaces are see-through, unless opaque,
// which fills the inside of each line so a cloud can cover the sun behind it
const stamp = (
  grid: Grid,
  x: number,
  y: number,
  lines: string[],
  tone: Tone,
  opaque = false,
) => {
  lines.forEach((line, dy) => {
    const row = grid[y + dy];
    if (!row) return;
    const first = line.search(/\S/);
    const last = line.trimEnd().length - 1;
    [...line].forEach((char, dx) => {
      const col = x + dx;
      if (col < 0 || col >= W) return;
      const inside = opaque && dx >= first && dx <= last;
      if (char !== " " || inside) row[col] = [char, tone];
    });
  });
};

export const drawArt = (
  kind: WeatherKind,
  isDay: boolean,
  frame: number,
): Grid => {
  const grid = blank();
  const sun = SUN[frame % 2];

  switch (kind) {
    case "clear":
      if (isDay) {
        stamp(grid, 3, 1, sun, "sun");
      } else {
        stamp(grid, 5, 1, MOON, "moon");
        STARS.forEach(([x, y], i) =>
          stamp(grid, x, y, [(frame + i) % 4 < 2 ? "*" : "."], "star"),
        );
      }
      break;

    case "partly":
      stamp(grid, 0, 0, isDay ? sun : MOON, isDay ? "sun" : "moon");
      stamp(grid, 4, 4, CLOUD, "cloud", true);
      break;

    case "cloudy": {
      const drift = [0, 1, 2, 1][frame % 4];
      stamp(grid, 10 - drift, 0, SMALL_CLOUD, "cloud");
      stamp(grid, 1 + drift, 2, CLOUD, "cloud", true);
      break;
    }

    case "fog":
      for (let y = 1; y < 6; y++) {
        const offset = (frame + y * 2) % 4;
        stamp(grid, 0, y, ["_ - ".repeat(6).slice(offset, offset + W)], "fog");
      }
      break;

    case "rain":
    case "storm":
      stamp(grid, 2, 0, CLOUD, "cloud", true);
      // Diagonal streaks that shift each frame, thinned out so they flicker
      for (let y = 3; y < H; y++) {
        for (let x = 3; x < 16; x++) {
          if ((x - y + frame + 30) % 3 === 0 && (x * 7 + y * 3) % 5 !== 0) {
            stamp(grid, x, y, ["/"], "rain");
          }
        }
      }
      // Lightning flashes now and then, with the rain behind it cleared so
      // its shape reads
      if (kind === "storm" && frame % 10 < 2) {
        for (let y = 3; y < H; y++) {
          for (let x = 6; x < 13; x++) grid[y][x] = [" ", "rain"];
        }
        stamp(grid, 8, 3, BOLT, "bolt");
      }
      break;

    case "snow":
      stamp(grid, 2, 0, CLOUD, "cloud", true);
      FLAKES.forEach(([x, offset], i) => {
        const step = frame + offset;
        stamp(grid, x + ((step >> 1) % 2), 3 + (step % 4), [i % 2 ? "*" : "."], "snow");
      });
      break;
  }

  return grid;
};

// Join neighbouring characters of the same tone into one run of text
export const toSpans = (row: Grid[number]) =>
  row.reduce<{ text: string; tone: Tone }[]>((spans, [char, tone]) => {
    const last = spans.at(-1);
    if (last && (last.tone === tone || char === " ")) last.text += char;
    else spans.push({ text: char, tone });
    return spans;
  }, []);

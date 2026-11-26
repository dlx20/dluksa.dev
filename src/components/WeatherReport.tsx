"use client";

import { Fragment, use, useEffect, useState } from "react";
import type { Weather, WeatherKind } from "@/lib/weather";
import { drawArt, FRAME_MS, toSpans, type Tone } from "@/lib/weather-art";

// Colors for each part of the drawing, from the active theme
const TONES: Record<Tone, string> = {
  sun: "text-warning",
  moon: "text-fg-base",
  star: "text-fg-muted",
  cloud: "text-fg-muted",
  fog: "text-fg-muted",
  rain: "text-(--color-sky-blue)",
  snow: "text-fg-base",
  bolt: "text-warning",
};

// Forecast word and color for each kind
const SHORT: Record<WeatherKind, [word: string, tone: Tone]> = {
  clear: ["sun", "sun"],
  partly: ["part", "sun"],
  cloudy: ["cloud", "cloud"],
  fog: ["fog", "fog"],
  rain: ["rain", "rain"],
  snow: ["snow", "snow"],
  storm: ["storm", "bolt"],
};

type WeatherReportProps = {
  weather: Promise<Weather | null>;
  // Only animate while the drawer is open
  animate: boolean;
};

// Current London weather as animated ASCII art, plus a 3-day forecast
export default function WeatherReport({
  weather: weatherPromise,
  animate,
}: WeatherReportProps) {
  const weather = use(weatherPromise);
  const [frame, setFrame] = useState(0);
  const kind = weather?.kind;

  useEffect(() => {
    if (
      !animate ||
      !kind ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const interval = setInterval(() => setFrame((f) => f + 1), FRAME_MS[kind]);
    return () => clearInterval(interval);
  }, [animate, kind]);

  if (!weather) {
    return (
      <span className="text-ui text-fg-muted">forecast unavailable right now</span>
    );
  }

  const art = drawArt(weather.kind, weather.isDay, frame);

  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="flex gap-4">
        <pre
          aria-hidden="true"
          className="shrink-0 font-ubuntu-mono text-ui leading-tight"
        >
          {art.map((row, y) => (
            <Fragment key={y}>
              {toSpans(row).map(({ text, tone }, i) => (
                <span key={i} className={TONES[tone]}>
                  {text}
                </span>
              ))}
              {"\n"}
            </Fragment>
          ))}
        </pre>

        <div className="flex min-w-0 flex-col text-ui">
          <span className="text-fg-muted">London, UK</span>
          <span className="text-heading leading-tight text-accent">
            {weather.temperature}°C
          </span>
          <span className="text-fg-base">{weather.label}</span>
          <span className="text-fg-muted">feels {weather.feelsLike}°</span>
          <span className="text-fg-muted">
            wind {weather.windArrow} {weather.windSpeed} km/h
          </span>
          <span className="text-fg-muted">humidity {weather.humidity}%</span>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-1 text-ui text-fg-muted">
        <div className="flex justify-between gap-2">
          {weather.forecast.map(({ day, kind, max }) => {
            const [word, tone] = SHORT[kind];
            return (
              <span key={day}>
                {day} <span className={TONES[tone]}>{word}</span> {max}°
              </span>
            );
          })}
        </div>
        <span>updated {weather.updated}</span>
      </div>
    </div>
  );
}

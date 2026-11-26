// Every widget the menu can show. To add one, give it an id in
// lib/widgets.ts and an entry here

import { Suspense, type ReactNode } from "react";
import type { Weather } from "@/lib/weather";
import type { WidgetId } from "@/lib/widgets";
import WeatherReport from "../WeatherReport";
import BootWidget from "./BootWidget";
import ClockWidget from "./ClockWidget";
import FortuneWidget from "./FortuneWidget";
import VisitorWidget from "./VisitorWidget";

export type WidgetProps = {
  // True while the drawer is open, so widgets only animate when seen
  active: boolean;
  weather: Promise<Weather | null>;
};

type WidgetInfo = {
  // For the add list and screen readers
  name: string;
  // Shown in the widget's header
  title: string;
  // Data source that asks to be credited
  credit?: { label: string; href: string };
  render: (props: WidgetProps) => ReactNode;
};

export const WIDGETS: Record<WidgetId, WidgetInfo> = {
  weather: {
    name: "weather",
    title: "wx · london",
    credit: { label: "open-meteo", href: "https://open-meteo.com/" },
    render: ({ active, weather }) => (
      <Suspense
        fallback={<span className="text-ui text-fg-muted">fetching forecast…</span>}
      >
        <WeatherReport weather={weather} animate={active} />
      </Suspense>
    ),
  },
  clock: {
    name: "world clock",
    title: "clock · world",
    render: ({ active }) => <ClockWidget active={active} />,
  },
  boot: {
    name: "boot log",
    title: "journalctl -f",
    render: ({ active }) => <BootWidget active={active} />,
  },
  fortune: {
    name: "fortune",
    title: "fortune | ddev-bot",
    render: ({ active }) => <FortuneWidget active={active} />,
  },
  visitor: {
    name: "visitor info",
    title: "you · neofetch",
    render: () => <VisitorWidget />,
  },
};

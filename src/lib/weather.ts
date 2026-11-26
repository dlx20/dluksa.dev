// London weather from Open-Meteo (free, no API key, CC BY 4.0)

import { cacheLife } from "next/cache";

const FORECAST_URL = `https://api.open-meteo.com/v1/forecast?${new URLSearchParams({
  latitude: "51.5072",
  longitude: "-0.1276",
  current:
    "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,is_day",
  daily: "weather_code,temperature_2m_max,temperature_2m_min",
  timezone: "Europe/London",
  forecast_days: "4",
})}`;

// Which ASCII drawing the weather pane shows
export type WeatherKind =
  | "clear"
  | "partly"
  | "cloudy"
  | "fog"
  | "rain"
  | "snow"
  | "storm";

export type Weather = {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  // Arrow pointing where the wind blows to
  windArrow: string;
  label: string;
  kind: WeatherKind;
  isDay: boolean;
  // Local time of the reading, "HH:MM"
  updated: string;
  forecast: { day: string; kind: WeatherKind; max: number }[];
};

type OpenMeteoResponse = {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    is_day: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
  };
};

// WMO weather codes -> label and drawing
const CONDITIONS: [codes: number[], label: string, kind: WeatherKind][] = [
  [[0], "clear sky", "clear"],
  [[1], "mainly clear", "clear"],
  [[2], "partly cloudy", "partly"],
  [[3], "overcast", "cloudy"],
  [[45, 48], "fog", "fog"],
  [[51, 53, 55, 56, 57], "drizzle", "rain"],
  [[61], "light rain", "rain"],
  [[63], "rain", "rain"],
  [[65], "heavy rain", "rain"],
  [[66, 67], "freezing rain", "rain"],
  [[71, 73, 75, 77], "snow", "snow"],
  [[80, 81, 82], "showers", "rain"],
  [[85, 86], "snow showers", "snow"],
  [[95, 96, 99], "thunderstorm", "storm"],
];

const describe = (code: number) => {
  const match = CONDITIONS.find(([codes]) => codes.includes(code));
  return match
    ? { label: match[1], kind: match[2] }
    : { label: "unknown", kind: "cloudy" as const };
};

// Open-Meteo gives the direction the wind comes from, so a north wind points down
const WIND_ARROWS = ["↓", "↙", "←", "↖", "↑", "↗", "→", "↘"];
const windArrow = (degrees: number) => WIND_ARROWS[Math.round(degrees / 45) % 8];

// "2026-11-26" -> "thu"
const weekday = (date: string) =>
  new Date(`${date}T12:00:00Z`)
    .toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" })
    .toLowerCase();

const toWeather = ({ current, daily }: OpenMeteoResponse): Weather => ({
  temperature: Math.round(current.temperature_2m),
  feelsLike: Math.round(current.apparent_temperature),
  humidity: Math.round(current.relative_humidity_2m),
  windSpeed: Math.round(current.wind_speed_10m),
  windArrow: windArrow(current.wind_direction_10m),
  ...describe(current.weather_code),
  isDay: current.is_day === 1,
  updated: current.time.slice(11, 16),
  // The next three days, skipping today
  forecast: daily.time.slice(1, 4).map((date, index) => ({
    day: weekday(date),
    kind: describe(daily.weather_code[index + 1]).kind,
    max: Math.round(daily.temperature_2m_max[index + 1]),
  })),
});

// Cached on the server and refreshed every 15 minutes, matching how often
// Open-Meteo updates, so visitors never call the API themselves
export async function getWeather(): Promise<Weather | null> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 900, expire: 3600 });

  try {
    const res = await fetch(FORECAST_URL);
    if (!res.ok) {
      throw new Error(`Open-Meteo request failed ${res.status} ${res.statusText}`);
    }
    return toWeather(await res.json());
  } catch (error) {
    // The weather is decoration, so a failure shouldn't break the header
    console.error("Failed to load weather:", error);
    return null;
  }
}

"use client";

import { useSyncExternalStore } from "react";

type Visitor = [label: string, value: string][];

const browserName = (ua: string) =>
  /Firefox\//.test(ua)
    ? "firefox"
    : /Edg\//.test(ua)
      ? "edge"
      : /Chrome\//.test(ua)
        ? "chrome"
        : /Safari\//.test(ua)
          ? "safari"
          : "unknown";

const osName = (ua: string) =>
  /iPhone|iPad/.test(ua)
    ? "ios"
    : /Android/.test(ua)
      ? "android"
      : /Windows/.test(ua)
        ? "windows"
        : /Mac OS X/.test(ua)
          ? "macos"
          : /Linux/.test(ua)
            ? "linux"
            : "unknown";

// Read once in the browser. Nothing here leaves the visitor's device
let cached: Visitor | undefined;
const getVisitor = () =>
  (cached ??= [
    ["os", osName(navigator.userAgent)],
    ["browser", browserName(navigator.userAgent)],
    ["screen", `${screen.width}x${screen.height}`],
    ["tz", Intl.DateTimeFormat().resolvedOptions().timeZone],
    ["lang", navigator.language],
    [
      "scheme",
      window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    ],
  ]);

const subscribeNever = () => () => {};

const ART = [" .---. ", "| o o |", "|  ?  |", " '---' "];

// neofetch about whoever is reading the page
export default function VisitorWidget() {
  // Null on the server, which can't know the visitor's device
  const visitor = useSyncExternalStore(subscribeNever, getVisitor, () => null);

  return (
    <div className="flex gap-3">
      <pre aria-hidden="true" className="font-ubuntu-mono text-ui leading-snug text-accent">
        {ART.join("\n")}
      </pre>
      <pre className="min-w-0 font-ubuntu-mono text-ui leading-snug">
        <span className="text-accent">you</span>@
        <span className="text-accent">visitor</span>
        {"\n"}
        <span className="text-fg-muted">{"─".repeat(13)}</span>
        {"\n"}
        {visitor
          ? visitor.map(([label, value]) => (
              // whitespace-pre, not truncate: truncate collapses the padding
              <span
                key={label}
                className="block overflow-hidden text-ellipsis whitespace-pre"
              >
                <span className="text-accent">{label.padEnd(8)}</span>
                {value}
              </span>
            ))
          : "detecting…"}
      </pre>
    </div>
  );
}

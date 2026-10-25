"use client";
import { useEffect } from "react";
import { restoreAccent } from "@/lib/theme";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    useEffect(restoreAccent,[])
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

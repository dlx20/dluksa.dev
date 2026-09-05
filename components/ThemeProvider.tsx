'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useEffect, type ReactNode } from 'react'
import { restoreAccent } from '@/lib/accent'

const DEFAULT_THEME = 'void'

const ThemeProvider = ({ children }: { children: ReactNode }) => {
    // next-themes restores the theme class; the accent is a CSS variable and
    // has to be re-applied by hand.
    useEffect(restoreAccent, [])

    return (
        <NextThemesProvider
            attribute="class"
            themes={['palenight', 'void', 'cyberpunk', 'ashlight', 'cream']}
            defaultTheme={DEFAULT_THEME}
            enableSystem={false}
            disableTransitionOnChange
            storageKey="theme"
        >
            {children}
        </NextThemesProvider>
    )
}

export default ThemeProvider

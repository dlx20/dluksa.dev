'use client'

import { useTheme } from 'next-themes'
import { THEMES } from '@/lib/constants'
import { useMounted } from '@/lib/use-mounted'

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme()
    // next-themes cannot know the stored theme until it runs in the browser.
    const activeTheme = useMounted() ? theme : null

    return (
        // Two per row; a trailing odd button widens to fill the last row.
        <div className="grid grid-cols-2 gap-2">
            {THEMES.map(({ id, label }) => (
                <button
                    key={id}
                    type="button"
                    onClick={() => setTheme(id)}
                    aria-pressed={activeTheme === id}
                    className={`cursor-pointer rounded-card border px-2 py-1.5 font-display text-ui transition-colors last:odd:col-span-2 ${
                        activeTheme === id
                            ? 'border-accent/60 bg-accent/15 text-accent'
                            : 'border-accent/20 text-fg-muted hover:border-accent/40 hover:text-accent'
                    }`}
                >
                    {label}
                </button>
            ))}
        </div>
    )
}

export default ThemeSwitcher

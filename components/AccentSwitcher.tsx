'use client'

import { useSyncExternalStore } from 'react'
import { ACCENT_COLORS } from '@/lib/constants'
import { getAccent, getDefaultAccent, setAccent, subscribe } from '@/lib/accent'

type AccentSwitcherProps = {
    shape?: 'square' | 'circle'
}

const AccentSwitcher = ({ shape = 'circle' }: AccentSwitcherProps) => {
    const activeAccent = useSyncExternalStore(subscribe, getAccent, getDefaultAccent)

    return (
        <div className="flex flex-wrap justify-center gap-2">
            {ACCENT_COLORS.map((color) => (
                <button
                    key={color}
                    type="button"
                    onClick={() => setAccent(color)}
                    aria-label={`Use ${color.replace('-', ' ')} accent`}
                    aria-pressed={color === activeAccent}
                    className={`size-8 shrink-0 cursor-pointer transition-transform hover:scale-110 ${
                        shape === 'square' ? 'rounded-card' : 'rounded-full'
                    }`}
                    style={{
                        backgroundColor: `var(--color-${color})`,
                        boxShadow:
                            color === activeAccent
                                ? `0 0 0 2px var(--color-surface-base), 0 0 0 4px var(--color-${color})`
                                : 'none',
                    }}
                />
            ))}
        </div>
    )
}

export default AccentSwitcher

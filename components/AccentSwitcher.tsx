"use client"

import { ACCENT_COLORS } from "@/lib/constants"
import Button from "./ui/Button"
import { useState, useCallback, useEffect } from "react"

type AccentSwitcherProps = {
    shape?: "square" | "circle"
    size?: "sm" | "md" | "lg"
}

const AccentSwitcher = ({
    shape = "circle",
    size = "sm",
}: AccentSwitcherProps) => {
    const [activeColor, setActiveColor] = useState<string>("")

    useEffect(() => {
        const savedColor = localStorage.getItem("accent-color")

        if (savedColor) {
            setActiveColor(savedColor)

            document.documentElement.style.setProperty(
                "--color-accent",
                `var(--color-${savedColor})`
            )
        } else if (ACCENT_COLORS.length > 0) {
            const defaultColor = ACCENT_COLORS[0]

            setActiveColor(defaultColor)

            document.documentElement.style.setProperty(
                "--color-accent",
                `var(--color-${defaultColor})`
            )
        }
    }, [])

    const applyAccentColor = useCallback((color: string) => {
        document.documentElement.style.setProperty(
            "--color-accent",
            `var(--color-${color})`
        )

        setActiveColor(color)
        localStorage.setItem("accent-color", color)
    }, [])

    return (
        <div className="w-full">
            <div
                className="
                    grid w-full
                    grid-cols-6
                    gap-2
                    sm:flex sm:flex-wrap
                    sm:gap-2
                    justify-center
                "
            >
                {ACCENT_COLORS.map((color) => {
                    const isActive = color === activeColor

                    return (
                        <Button
                            key={color}
                            size={size}
                            aria-label={`Set accent color to ${color}`}
                            aria-pressed={isActive}
                            onClick={() => applyAccentColor(color)}
                            variant="default"
                            className={`
                                aspect-square
                                !h-8 !w-8
                                shrink-0
                                transition-all duration-200
                                hover:scale-110
                                ${shape === "square"
                                    ? "rounded-md"
                                    : "rounded-full"
                                }
                            `}
                            style={{
                                backgroundColor: `var(--color-${color})`,
                                boxShadow: isActive
                                    ? `
                                        0 0 0 2px var(--color-surface-base),
                                        0 0 0 4px var(--color-${color})
                                    `
                                    : "none",
                            }}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default AccentSwitcher
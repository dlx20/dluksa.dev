import { THEMES } from "@/lib/constants"
import Button from "./ui/Button"
import { useTheme } from "next-themes"
import { MdOutlinePalette } from 'react-icons/md'


const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme()
    return (
        <div className="flex flex-col justify-center">

            <div className="mb-5 flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                    <MdOutlinePalette
                        size={20}
                        className="fill-accent"
                    />
                </div>

                <div>
                    <h2 className="font-semibold text-accent">
                        Appearance
                    </h2>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 *:last:col-span-2">
                {THEMES.map(({ id, label }) => (
                    <Button
                        key={id}
                        buttonText={label}
                        isActive={theme === id}
                        variant="borderless"
                        size="xs"
                        onClick={() => setTheme(id)}
                    />
                ))}
            </div>
        </div>
    )
}

export default ThemeSwitcher


import Link from 'next/link'
import Button from './ui/Button'
import {
    FaGithub,
    FaLinkedin,
    FaChevronRight,
} from 'react-icons/fa'
import { MdOutlinePalette } from 'react-icons/md'
import { PiLinkSimpleLight } from 'react-icons/pi'
import { IoMail } from 'react-icons/io5'

import { links } from '@/lib/constants'
import ThemeSwitcher from './ThemeSwitcher'
import AccentSwitcher from './AccentSwitcher'

type SidebarProps = {
    onClose: () => void
}

const Sidebar = ({ onClose }: SidebarProps) => {
    return (
        <aside className="fixed inset-y-0 right-0 z-50 w-90 h-lvh border-l border-accent/10 bg-surface-elevated">
            <div className="flex h-full flex-col">

                {/* Header */}
                <header className="border-b border-accent/10 px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent/40">
                                Menu
                            </p>
                            <h1 className="text-xl font-bold tracking-tight text-accent">
                                Navigation
                            </h1>
                        </div>

                        <Button
                            size="sm"
                            onClick={onClose}
                            className="
                                flex h-9 w-9 items-center justify-center
                                border border-accent/10
                                bg-accent/5 text-accent
                                transition-all duration-200
                                hover:bg-accent hover:text-surface-base
                            "
                        >
                            <FaChevronRight size={13} />
                        </Button>
                    </div>
                </header>

                {/* Content */}
                <div className="flex flex-1 flex-col overflow-y-auto">

                    {/* Themes */}
                    <section className="border-b border-accent/10 px-6 py-6 ">
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
                                <p className="text-xs text-accent/50">
                                    Customize your experience
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6 rounded-xl border border-accent/10 bg-accent/[0.03] p-3 ">
                            <ThemeSwitcher />
                            <AccentSwitcher size="sm" />
                        </div>
                    </section>

                    {/* Links */}
                    <section className="px-6 py-6">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                                <PiLinkSimpleLight
                                    size={20}
                                    className="fill-accent"
                                />
                            </div>

                            <div>
                                <h2 className="font-semibold text-accent">
                                    Links
                                </h2>
                                <p className="text-xs text-accent/50">
                                    Explore the site
                                </p>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            {links.map(({ url, title }) => (
                                <Link
                                    key={url}
                                    href={url}
                                    onClick={onClose}
                                    className="
                                        group flex items-center justify-between
                                        rounded-lg px-4 py-3
                                        text-sm font-medium
                                        text-accent/70
                                        transition-all duration-200
                                        hover:bg-accent/10
                                        hover:pl-5
                                        hover:text-accent
                                    "
                                >
                                    <span>{title}</span>

                                    <FaChevronRight
                                        size={10}
                                        className="
                                            opacity-0 -translate-x-1
                                            transition-all duration-200
                                            group-hover:translate-x-0
                                            group-hover:opacity-100
                                        "
                                    />
                                </Link>
                            ))}
                        </nav>
                    </section>
                </div>

                {/* Footer */}
                <footer className="border-t border-accent/10 px-6 py-5">
                    <div className="mb-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent/40">
                            Connect
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <a
                            href="#"
                            aria-label="GitHub"
                            className="
                                flex h-10 w-10 items-center justify-center
                                rounded-lg border border-accent/10
                                bg-accent/5
                                text-accent/60
                                transition-all duration-200
                                hover:-translate-y-0.5
                                hover:bg-accent
                                hover:text-surface-base
                            "
                        >
                            <FaGithub size={18} />
                        </a>

                        <a
                            href="#"
                            aria-label="LinkedIn"
                            className="
                                flex h-10 w-10 items-center justify-center
                                rounded-lg border border-accent/10
                                bg-accent/5
                                text-accent/60
                                transition-all duration-200
                                hover:-translate-y-0.5
                                hover:bg-accent
                                hover:text-surface-base
                            "
                        >
                            <FaLinkedin size={18} />
                        </a>

                        <a
                            href="mailto:"
                            aria-label="Email"
                            className="
                                flex h-10 w-10 items-center justify-center
                                rounded-lg border border-accent/10
                                bg-accent/5
                                text-accent/60
                                transition-all duration-200
                                hover:-translate-y-0.5
                                hover:bg-accent
                                hover:text-surface-base
                            "
                        >
                            <IoMail size={19} />
                        </a>
                    </div>
                </footer>
            </div>
        </aside>
    )
}

export default Sidebar
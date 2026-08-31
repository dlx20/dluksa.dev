'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { FaBars } from "react-icons/fa"
import { links } from "@/lib/constants"
import Sidebar from "./Sidebar"
import TerminalHeader from "./TerminalHeader"

const Header = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const pathname = usePathname()

    return (
        <>
            <header className="site-header">
                <div className="w-full">
                    <TerminalHeader />

                    <div className="flex w-full items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
                        <div className="site-header__title">
                            <h2 className="truncate font-bold text-accent">
                                <span className="hidden sm:inline">ddev@dluksa.dev</span>
                                <span className="sm:hidden">ddev</span>
                                <span className="font-light text-fg-base">:</span>
                                <span className="font-light text-primary">~</span>
                                {pathname !== '/' && (
                                    <span className="font-light text-fg-base">{pathname}</span>
                                )}
                                <span className="font-medium text-accent">$</span>
                            </h2>

                            <span className="site-header__cursor" />
                        </div>

                        <nav className="site-header__nav">
                            {links.map(({ title, url }) => (
                                <Link
                                    key={title}
                                    href={url}
                                    className={`site-header__link ${
                                        pathname === url ? 'site-header__link--active' : ''
                                    }`}
                                >
                                    {title}
                                </Link>
                            ))}

                            <button
                                type="button"
                                onClick={() => setIsSidebarOpen(true)}
                                aria-label="Open menu"
                                aria-expanded={isSidebarOpen}
                                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-card border border-accent/25 bg-accent/5 text-accent transition-colors hover:bg-accent/15"
                            >
                                <FaBars size={14} />
                            </button>
                        </nav>
                    </div>
                </div>
            </header>

            {/*
             * Rendered outside the header: its backdrop blur creates a
             * containing block, which would trap the sidebar's fixed position.
             */}
            {isSidebarOpen && <Sidebar onClose={() => setIsSidebarOpen(false)} />}
        </>
    )
}

export default Header

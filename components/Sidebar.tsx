'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { FaChevronRight, FaTimes } from 'react-icons/fa'
import { PiLinkSimpleLight } from 'react-icons/pi'
import { links } from '@/lib/constants'
import AppearanceSettings from './AppearanceSettings'
import SocialTiles from './ui/SocialTiles'

const Sidebar = ({ onClose }: { onClose: () => void }) => {
    useEffect(() => {
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
        }

        document.addEventListener('keydown', closeOnEscape)
        // Prevent the page behind the drawer from scrolling on touch devices.
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', closeOnEscape)
            document.body.style.overflow = ''
        }
    }, [onClose])

    return (
        <>
            <div className="site-sidebar__backdrop" onClick={onClose} aria-hidden />

            <aside className="site-sidebar" aria-label="Site menu">
                <header className="site-sidebar__section flex items-center justify-between">
                    <div>
                        <p className="text-ui uppercase tracking-wide text-accent/50">Menu</p>
                        <h2 className="text-subheading font-bold text-accent">Navigation</h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close menu"
                        className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-card border border-accent/20 bg-accent/5 text-accent transition-colors hover:bg-accent hover:text-surface-base"
                    >
                        <FaTimes size={14} />
                    </button>
                </header>

                <div className="scrollbar flex-1 overflow-y-auto">
                    <section className="site-sidebar__section">
                        <AppearanceSettings />
                    </section>

                    <section className="site-sidebar__section border-b-0">
                        <div className="mb-4 flex items-center gap-3">
                            <span className="icon-tile">
                                <PiLinkSimpleLight size={20} className="fill-accent" />
                            </span>

                            <div>
                                <h3 className="font-semibold text-accent">Links</h3>
                                <p className="text-ui text-fg-muted">Explore the site</p>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            {links.map(({ url, title }) => (
                                <Link
                                    key={url}
                                    href={url}
                                    onClick={onClose}
                                    className="site-sidebar__link group"
                                >
                                    <span>{title}</span>

                                    <FaChevronRight
                                        size={10}
                                        className="-translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                                    />
                                </Link>
                            ))}
                        </nav>
                    </section>
                </div>

                <footer className="border-t border-accent/10 px-5 py-5 sm:px-6">
                    <p className="mb-4 text-ui uppercase tracking-wide text-accent/50">Connect</p>

                    <SocialTiles />
                </footer>
            </aside>
        </>
    )
}

export default Sidebar

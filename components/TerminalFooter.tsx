'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SOCIALS } from '@/lib/constants';
import { runCommand, type CommandProject } from '@/lib/terminal';

type Entry = { input: string; lines: string[] };

/** Cap the scrollback so a long session cannot grow the footer forever. */
const MAX_ENTRIES = 12;

/**
 * Focusing the prompt — or a mobile keyboard opening — can scroll the page on
 * its own. Scrolls this soon after revealing the output are not the user
 * scrolling away, so they must not collapse it again.
 */
const REVEAL_GRACE_MS = 500;

/**
 * Terminal prompt pinned to the bottom of the viewport. Sticky rather than
 * fixed so it never overlaps the end of a page. Accepts the small command set
 * defined in `lib/terminal.ts` — `help` lists them.
 */
const TerminalFooter = ({ projects }: { projects: CommandProject[] }) => {
    const router = useRouter();
    const footerRef = useRef<HTMLElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);

    const [input, setInput] = useState('');
    const [entries, setEntries] = useState<Entry[]>([]);
    // The scrollback is kept when collapsed, so it can be reopened intact.
    const [open, setOpen] = useState(false);
    // Index into `submitted` for arrow-key recall; null means "typing fresh".
    const [submitted, setSubmitted] = useState<string[]>([]);
    const [recall, setRecall] = useState<number | null>(null);

    const revealedAt = useRef(0);

    const showOutput = open && entries.length > 0;

    const reveal = () => {
        revealedAt.current = Date.now();
        setOpen(true);
    };

    // Keep the newest output in view, including right after reopening.
    useEffect(() => {
        outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight });
    }, [entries, showOutput]);

    // Reading the page should not be obstructed: scrolling, or pressing the page
    // outside the footer, folds the output away. Focusing the prompt reopens it.
    useEffect(() => {
        if (!open) return;

        const collapseOnScroll = () => {
            if (Date.now() - revealedAt.current > REVEAL_GRACE_MS) setOpen(false);
        };

        const collapseFromOutside = (event: PointerEvent) => {
            if (!footerRef.current?.contains(event.target as Node)) setOpen(false);
        };

        // Element scroll events do not bubble, so this only sees the page moving.
        window.addEventListener('scroll', collapseOnScroll, { passive: true });
        document.addEventListener('pointerdown', collapseFromOutside);

        return () => {
            window.removeEventListener('scroll', collapseOnScroll);
            document.removeEventListener('pointerdown', collapseFromOutside);
        };
    }, [open]);

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        const trimmed = input.trim();
        setInput('');
        setRecall(null);
        if (!trimmed) return;

        setSubmitted((previous) => [...previous, trimmed]);

        const { lines, navigateTo, clear } = runCommand(trimmed, projects);

        setEntries((previous) =>
            clear ? [] : [...previous, { input: trimmed, lines }].slice(-MAX_ENTRIES)
        );
        reveal();

        if (navigateTo) router.push(navigateTo);
    };

    // Up/down cycles through previously entered commands.
    const recallHistory = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (submitted.length === 0) return;

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            const next = Math.max(0, (recall ?? submitted.length) - 1);
            setRecall(next);
            setInput(submitted[next]);
            return;
        }

        // Down arrow walks back out of the history, and never into it.
        if (event.key === 'ArrowDown' && recall !== null) {
            event.preventDefault();
            const next = recall + 1;
            setRecall(next < submitted.length ? next : null);
            setInput(next < submitted.length ? submitted[next] : '');
        }
    };

    return (
        <footer
            ref={footerRef}
            className="sticky bottom-0 z-20 shrink-0 border-t border-accent/20 bg-surface-elevated/95 backdrop-blur-sm"
        >
            {/* The gap sits outside the scroll area so text never rides up
                against the footer's top border. */}
            {showOutput && (
                <div className="border-b border-accent/10 pt-3">
                    <div
                        ref={outputRef}
                        className="scrollbar max-h-44 overflow-y-auto overscroll-contain pb-3 sm:max-h-56"
                    >
                        <div className="mx-auto w-full max-w-7xl space-y-2 px-4 sm:px-6 lg:px-10">
                            {entries.map((entry, index) => (
                                <div key={`${entry.input}-${index}`}>
                                    <p className="flex gap-2 font-display text-body">
                                        <span className="text-accent">➜</span>
                                        <span className="text-fg-base">{entry.input}</span>
                                    </p>

                                    {entry.lines.length > 0 && (
                                        <pre className="mt-1 whitespace-pre-wrap break-words font-display text-body text-fg-muted">
                                            {entry.lines.join('\n')}
                                        </pre>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div
                onClick={() => inputRef.current?.focus()}
                className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-10"
            >
                <form onSubmit={submit} className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="flex shrink-0 items-center gap-2 font-display text-base sm:text-body">
                        <span className="text-accent">➜</span>
                        <span className="text-accent/80">~</span>
                    </span>

                    <input
                        ref={inputRef}
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={recallHistory}
                        onFocus={reveal}
                        aria-label="Terminal command input"
                        placeholder="type 'help'"
                        autoComplete="off"
                        spellCheck={false}
                        className="min-w-0 flex-1 bg-transparent font-display text-base text-fg-base caret-accent outline-none placeholder:text-fg-muted/50 sm:text-body"
                    />
                </form>

                <div className="flex shrink-0 items-center gap-3 font-display text-ui uppercase tracking-wide">
                    {entries.length > 0 && (
                        <>
                            <button
                                type="button"
                                onClick={() => (showOutput ? setEntries([]) : reveal())}
                                className="cursor-pointer text-fg-muted transition-colors hover:text-accent"
                            >
                                {showOutput ? 'clear' : `output (${entries.length})`}
                            </button>

                            <span className="hidden text-accent/20 sm:inline">|</span>
                        </>
                    )}

                    <div className="hidden items-center gap-2 sm:flex">
                        {SOCIALS.map(({ title, icon: Icon, url }) => (
                            <a
                                key={title}
                                href={url}
                                aria-label={title}
                                target={url.startsWith('http') ? '_blank' : undefined}
                                rel="noopener noreferrer"
                                className="text-accent/50 transition-colors hover:text-accent"
                            >
                                <Icon size={15} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default TerminalFooter;

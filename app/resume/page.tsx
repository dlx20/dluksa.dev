import type { Metadata } from 'next';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import TerminalSection from '@/components/TerminalSection';
import SkillBadges from '@/components/SkillBadges';
import SocialTiles from '@/components/ui/SocialTiles';
import { EMAIL, LOCATION, RESUME, SKILLS } from '@/lib/constants';

export const metadata: Metadata = {
    title: 'Resume — ddev',
    description:
        "Dovydas Luksa — MSc Robotics, AI & Autonomous Systems. Machine learning in Python, " +
        'web applications in TypeScript, React and Next.js. Based in London.',
};

const ResumePage = () => (
    <div className="site-page">
        <div className="site-page__inner">

            <TerminalSection label="usr" title="profile">
                <p className="text-body leading-7 text-fg-base sm:text-base sm:leading-8">
                    {RESUME.summary}
                </p>

                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-ui text-fg-muted">
                    <span>{LOCATION}</span>
                    <a href={`mailto:${EMAIL}`} className="transition-colors hover:text-accent">
                        {EMAIL}
                    </a>
                </div>

                <div className="mt-8">
                    <SocialTiles />
                </div>
            </TerminalSection>

            <TerminalSection label="log" title="experience">
                <ol className="space-y-4">
                    {RESUME.experience.map((role) => (
                        <li key={`${role.company}-${role.period}`} className="card">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                <h3 className="text-base font-bold text-fg-base">
                                    {role.role}
                                    <span className="text-accent"> @ {role.company}</span>
                                </h3>

                                <span className="text-ui text-fg-muted">{role.period}</span>
                            </div>

                            <p className="mt-1 text-ui text-fg-muted">{role.location}</p>

                            <ul className="mt-4 space-y-2">
                                {role.highlights.map((highlight) => (
                                    <li
                                        key={highlight}
                                        className="flex gap-3 text-body leading-6 text-fg-base"
                                    >
                                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent/60" />
                                        {highlight}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ol>
            </TerminalSection>

            <TerminalSection label="edu" title="education">
                <ol className="space-y-4">
                    {RESUME.education.map((entry) => (
                        <li key={entry.qualification} className="card">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                <h3 className="text-base font-bold text-fg-base">
                                    {entry.qualification}
                                    <span className="text-accent"> @ {entry.institution}</span>
                                </h3>

                                <span className="text-ui text-fg-muted">{entry.period}</span>
                            </div>

                            <p className="mt-1 text-ui text-accent/80">{entry.grade}</p>

                            <p className="mt-3 text-body leading-6 text-fg-muted">{entry.detail}</p>
                        </li>
                    ))}
                </ol>
            </TerminalSection>

            <TerminalSection label="crt" title="certifications">
                <ul className="grid gap-4 lg:grid-cols-2">
                    {RESUME.certifications.map((entry) => (
                        <li key={entry.title} className="card">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                <h3 className="text-base font-bold text-fg-base">{entry.title}</h3>
                                <span className="text-ui text-fg-muted">{entry.date}</span>
                            </div>

                            <p className="mt-1 text-ui text-accent/80">{entry.issuer}</p>

                            <p className="mt-3 text-body leading-6 text-fg-muted">{entry.detail}</p>
                        </li>
                    ))}
                </ul>
            </TerminalSection>

            <TerminalSection label="sys" title="skills">
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {SKILLS.map(({ section, technologies }) => (
                        <SkillBadges key={section} title={section} technologies={technologies} />
                    ))}
                </div>
            </TerminalSection>

            <TerminalSection label="exe" title="selected work">
                <p className="mb-5 max-w-2xl text-body text-fg-muted">
                    Everything I have shipped publicly is pulled live from GitHub, including the
                    spacecraft pose-estimation work from my MSc.
                </p>

                <Link href="/projects" className="btn-outline group">
                    Browse projects
                    <FaArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </Link>
            </TerminalSection>
        </div>
    </div>
);

export default ResumePage;

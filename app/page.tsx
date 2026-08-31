import Link from 'next/link';
import { FaArrowRight, FaGithub, FaRegClock, FaRegFolder, FaRegStar } from 'react-icons/fa';
import TerminalSection from '@/components/TerminalSection';
import AppearanceSettings from '@/components/AppearanceSettings';
import ProjectGrid from '@/components/ProjectGrid';
import SkillBadges from '@/components/SkillBadges';
import EmailForm from '@/components/EmailForm';
import Socials from '@/components/ui/Socials';
import MiniMap from '@/components/MiniMap';
import { SKILLS } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { getProjects } from '@/lib/github';

const FEATURED_COUNT = 3;

const Page = async () => {
    const projects = await getProjects();
    const featured = projects.slice(0, FEATURED_COUNT);

    const stats = [
        {
            label: 'Public repos',
            value: String(projects.length),
            icon: FaRegFolder,
        },
        {
            label: 'Total stars',
            value: String(projects.reduce((total, project) => total + project.stars, 0)),
            icon: FaRegStar,
        },
        {
            label: 'Last push',
            value: projects[0] ? formatDate(projects[0].updatedAt) : '—',
            icon: FaRegClock,
        },
    ];

    return (
        <div className="site-page pb-16">
            <div className="site-page__inner">

                {/* 01 — Intro */}
                <TerminalSection label="usr" title="who am i">
                    <p className="text-subheading leading-8 tracking-wide sm:leading-9">
                        MSc graduate in{' '}
                        <span className="text-accent underline underline-offset-4">
                            Robotics &amp; AI
                        </span>
                        , now building for the web. I train and deploy models in{' '}
                        <span className="text-accent underline underline-offset-4">Python</span> with
                        PyTorch and TensorFlow, then wrap them in{' '}
                        <span className="text-accent underline underline-offset-4">Next.js</span>{' '}
                        interfaces people can actually use. Always learning, always shipping.
                    </p>

                    <Socials />
                </TerminalSection>

                {/* 02 — Stack */}
                <TerminalSection label="sys" title="core stack">
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {SKILLS.map(({ section, technologies }) => (
                            <SkillBadges key={section} title={section} technologies={technologies} />
                        ))}
                    </div>
                </TerminalSection>

                {/* 03 — Projects */}
                <TerminalSection label="exe" title="active projects">
                    <ProjectGrid projects={featured} />

                    {projects.length > FEATURED_COUNT && (
                        <Link
                            href="/projects"
                            className="btn-outline group mt-6"
                        >
                            All {projects.length} projects
                            <FaArrowRight className="transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    )}
                </TerminalSection>

                {/* 04 — Settings */}
                <TerminalSection label="bin" title="system settings">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                        {/* Appearance */}
                        <div className="card">
                            <AppearanceSettings shape="square" />
                        </div>

                        {/* GitHub activity */}
                        <div className="card flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <span className="icon-tile">
                                    <FaGithub size={18} className="text-accent" />
                                </span>
                                <h3 className="font-semibold text-accent">GitHub activity</h3>
                            </div>

                            <dl className="space-y-3">
                                {stats.map(({ label, value, icon: Icon }) => (
                                    <div
                                        key={label}
                                        className="flex items-center justify-between gap-4 text-ui"
                                    >
                                        <dt className="flex items-center gap-2 text-fg-muted">
                                            <Icon className="shrink-0 text-accent/60" />
                                            {label}
                                        </dt>
                                        <dd className="font-bold text-accent/80">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        {/* Location */}
                        <div className="card overflow-hidden p-0 md:col-span-2 xl:col-span-1">
                            <div className="h-48 w-full xl:h-full xl:min-h-56">
                                <MiniMap />
                            </div>
                        </div>
                    </div>
                </TerminalSection>

                {/* 05 — Contact */}
                <TerminalSection label="etc" title="say hello">
                    <EmailForm />
                </TerminalSection>
            </div>
        </div>
    );
};

export default Page;

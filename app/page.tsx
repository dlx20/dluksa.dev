import Link from 'next/link';
import { FaArrowRight, FaGithub, FaRegClock, FaRegFolder, FaRegStar } from 'react-icons/fa';
import TerminalSection from '@/components/TerminalSection';
import AppearanceSettings from '@/components/AppearanceSettings';
import ProjectGrid from '@/components/ProjectGrid';
import SkillBadges from '@/components/SkillBadges';
import EmailForm from '@/components/EmailForm';
import SocialTiles from '@/components/ui/SocialTiles';
import MiniMap from '@/components/MiniMap';
import { SKILLS } from '@/lib/constants';
import { COLOPHON, FAQ, LAB, NOW, PROCESS, TIMELINE } from '@/lib/home';
import { formatDate } from '@/lib/format';
import ContributionGraph from '@/components/ContributionGraph';
import { getContributions, getContributionYears, getProjects } from '@/lib/github';
import TechBadgeList from '@/components/TechBadgeList';

const FEATURED_COUNT = 3;

const Page = async () => {
    const currentYear = new Date().getUTCFullYear();
    const [projects, contributions, contributionYears] = await Promise.all([
        getProjects(),
        getContributions(currentYear),
        getContributionYears(),
    ]);
    const featured = projects.slice(0, FEATURED_COUNT);
    const labProject = projects.find((project) =>
        /pose|spacecraft|vision/i.test(`${project.slug} ${project.excerpt}`)
    );
    const labHref = labProject ? `/projects/${labProject.slug}` : '/projects';

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
        <div className="site-page">
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

                    <div className="mt-8">
                        <SocialTiles />
                    </div>
                </TerminalSection>

                {/* 02 — Now */}
                <TerminalSection id="now" label="now" title="now status">
                    <dl className="grid gap-4 sm:grid-cols-2">
                        {NOW.map(({ label, value }) => (
                            <div key={label} className="card">
                                <dt className="card__kicker">{label}</dt>
                                <dd className="mt-2 text-body leading-6 text-fg-base">{value}</dd>
                            </div>
                        ))}
                    </dl>
                </TerminalSection>

                {/* 03 — How I work */}
                <TerminalSection id="log" label="log" title="how i work">
                    <ol className="grid gap-4 md:grid-cols-3">
                        {PROCESS.map(({ step, title, body }) => (
                            <li key={step} className="card">
                                <p className="card__kicker">{step}</p>
                                <h3 className="mt-2 text-base font-bold text-accent">{title}</h3>
                                <p className="mt-3 text-body leading-6 text-fg-muted">{body}</p>
                            </li>
                        ))}
                    </ol>
                </TerminalSection>

                {/* 04 — Stack */}
                <TerminalSection label="sys" title="core stack">
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {SKILLS.map(({ section, technologies }) => (
                            <SkillBadges key={section} title={section} technologies={technologies} />
                        ))}
                    </div>
                </TerminalSection>

                {/* 05 — Lab */}
                <TerminalSection id="lab" label="lab" title="lab notes">
                    <article className="card">
                        <p className="card__kicker">{LAB.kicker}</p>
                        <h3 className="mt-2 text-base font-bold text-fg-base">{LAB.title}</h3>

                        <dl className="mt-6 grid gap-5 md:grid-cols-3">
                            <div>
                                <dt className="card__kicker">Problem</dt>
                                <dd className="mt-2 text-body leading-6 text-fg-muted">{LAB.problem}</dd>
                            </div>
                            <div>
                                <dt className="card__kicker">Built</dt>
                                <dd className="mt-2 text-body leading-6 text-fg-muted">{LAB.built}</dd>
                            </div>
                            <div>
                                <dt className="card__kicker">Result</dt>
                                <dd className="mt-2 text-body leading-6 text-fg-muted">{LAB.result}</dd>
                            </div>
                        </dl>

                        <div className="mt-6">
                            <TechBadgeList technologies={[...LAB.technologies]} />
                        </div>

                        <Link href={labHref} className="btn-outline group mt-6">
                            {labProject ? labProject.name : 'Browse projects'}
                            <FaArrowRight className="transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </article>
                </TerminalSection>

                {/* 06 — Projects */}
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

                {/* 07 — Timeline */}
                <TerminalSection id="hist" label="hist" title="brief history">
                    <ol className="home-timeline card">
                        {TIMELINE.map(({ year, title, place }) => (
                            <li key={`${year}-${title}`} className="home-timeline__row">
                                <span className="home-timeline__year">{year}</span>
                                <div>
                                    <h3 className="text-body font-bold text-fg-base">{title}</h3>
                                    <p className="mt-1 text-ui text-fg-muted">{place}</p>
                                </div>
                            </li>
                        ))}
                    </ol>

                    <Link href="/resume" className="btn-outline group mt-6">
                        Full resume
                        <FaArrowRight className="transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </TerminalSection>

                {/* 08 — Settings */}
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

                    <div className="mt-4">
                        <ContributionGraph
                            calendar={contributions}
                            years={contributionYears}
                            initialYear={currentYear}
                        />
                    </div>
                </TerminalSection>

                {/* 09 — Colophon */}
                <TerminalSection id="man" label="man" title="site manual">
                    <ul className="grid gap-4 sm:grid-cols-2">
                        {COLOPHON.map(({ title, body }) => (
                            <li key={title} className="card">
                                <h3 className="text-base font-bold text-accent">{title}</h3>
                                <p className="mt-3 text-body leading-6 text-fg-muted">{body}</p>
                            </li>
                        ))}
                    </ul>
                </TerminalSection>

                {/* 10 — FAQ */}
                <TerminalSection id="ask" label="ask" title="common questions">
                    <dl className="grid gap-4 lg:grid-cols-2">
                        {FAQ.map(({ question, answer }) => (
                            <div key={question} className="card">
                                <dt className="text-body font-bold text-fg-base">{question}</dt>
                                <dd className="mt-3 text-body leading-6 text-fg-muted">{answer}</dd>
                            </div>
                        ))}
                    </dl>
                </TerminalSection>

                {/* 11 — Contact */}
                <TerminalSection label="etc" title="say hello">
                    <EmailForm />
                </TerminalSection>
            </div>
        </div>
    );
};

export default Page;

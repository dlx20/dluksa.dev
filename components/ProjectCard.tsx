import { SKILLS } from '@/lib/projects';
import SkillBadges from './SkillBadges';
import { FaFolderOpen, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import Link from 'next/link';
import type { Project } from '@/lib/github';

const ProjectCard = ({
  slug,
  name,
  technologies,
  status,
  description,
  githubUrl,
  liveUrl,
}: Project) => {
  const matchedTitles = new Set(
    SKILLS.flatMap(({ skills }) => skills.map((skill) => skill.title)).filter((title) =>
      technologies.includes(title)
    )
  );
  const extraTech = technologies.filter((item) => !matchedTitles.has(item));

  return (
    <div className="relative h-full container-elevated p-6 hover:bg-surface-elevated hover:border-accent transition-all duration-500">
      <div className="z-10 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl gradient flex items-center justify-center">
              <span className="text-accent/60 text-ui">
                <FaFolderOpen size={18} />
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-text/95 font-mono tracking-tight">
                {name}
              </h3>

              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    status === 'LIVE'
                      ? 'bg-green-400 animate-pulse'
                      : status === 'MAINTENANCE'
                        ? 'bg-yellow-400'
                        : 'bg-red-400'
                  }`}
                />

                <span className="text-ui uppercase tracking-default text-text/50 font-display">
                  {status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-fg-base leading-relaxed">
          {description || 'No description available.'}
        </p>

        <div className="h-px bg-linear-to-r from-transparent via-accent/15 to-transparent" />

        <div className="flex flex-wrap gap-2">
          {SKILLS.map(({ skills }) => (
            <SkillBadges
              key={skills[0]?.title}
              filter={true}
              skills={skills}
              skillsArray={technologies}
            />
          ))}
          {extraTech.map((item) => (
            <span
              key={item}
              className="px-2.5 py-1 container-elevated text-ui uppercase text-fg-base"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-2">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-text/60 hover:text-accent transition-colors"
          >
            <FaGithub />
            GitHub
          </a>

          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-text/60 hover:text-accent transition-colors"
            >
              <FaExternalLinkAlt size={12} />
              Live
            </a>
          )}

          <Link
            href={`/projects/${slug}`}
            className="ml-auto text-sm text-text/60 hover:text-accent transition-colors font-mono"
          >
            Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

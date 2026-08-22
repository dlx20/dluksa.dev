import { SKILLS } from '@/lib/projects';
import SkillBadges from './SkillBadges';
import { FaFolderOpen } from "react-icons/fa";


type ProjectCardProps = {
  name: string;
  tech: string[];
  status: string;
  desc: string;
}

const ProjectCard = ({ name, tech, status, desc }: ProjectCardProps) => {
  return (
    <div className="relative h-full container-elevated p-6 cursor-pointer hover:bg-surface-elevated hover:border-accent transition-all duration-500">  
      {/* Content */}
      <div className="z-10 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl gradient flex items-center justify-center">
              <span className="text-accent/60 text-ui">
                <FaFolderOpen size={18}/>
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-text/95 font-mono tracking-tight">
                {name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  status === 'LIVE' ? 'bg-green-400  animate-pulse' : 
                  status === 'MAINTENANCE' ? 'bg-yellow-400' :
                  'bg-red-400'
                }`} />
                <span className="text-ui uppercase tracking-default text-text/50 font-display">
                  {status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-fg-base leading-relaxed">
          {desc}
        </p>
        <div className="h-px bg-linear-to-r from-transparent via-accent/15 to-transparent" />

        {/* Tech badges */}
        <div className="flex">
          {SKILLS.map(({ skills }) => (
            <SkillBadges
              key={skills[0]?.title}
              filter={true}
              skills={skills}
              skillsArray={tech}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
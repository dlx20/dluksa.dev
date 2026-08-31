import TechBadgeList from './TechBadgeList';

type SkillBadgesProps = {
    title: string;
    technologies: string[];
};

const SkillBadges = ({ title, technologies }: SkillBadgesProps) => (
    <div className="space-y-3">
        <div className="flex items-center gap-2">
            <span className="size-1.5 shrink-0 rounded-full bg-accent/60 shadow-accent-sm" />
            <h3 className="text-capitalized">{title}</h3>
        </div>

        <TechBadgeList technologies={technologies} size="md" />
    </div>
);

export default SkillBadges;

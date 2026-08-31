import TechBadge from './TechBadge';

type TechBadgeListProps = {
    technologies: string[];
    /** Show at most this many badges, summarising the rest as `+n`. */
    limit?: number;
    size?: 'sm' | 'md';
};

const TechBadgeList = ({ technologies, limit, size = 'sm' }: TechBadgeListProps) => {
    if (technologies.length === 0) return null;

    const visible = limit ? technologies.slice(0, limit) : technologies;
    const hiddenCount = technologies.length - visible.length;

    return (
        <ul className="flex flex-wrap items-center gap-1.5">
            {visible.map((technology) => (
                <li key={technology}>
                    <TechBadge name={technology} size={size} />
                </li>
            ))}

            {hiddenCount > 0 && (
                <li className="font-display text-ui text-fg-muted">+{hiddenCount}</li>
            )}
        </ul>
    );
};

export default TechBadgeList;

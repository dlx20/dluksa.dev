import type { CSSProperties } from 'react';
import { getTech } from '@/lib/tech';

type TechBadgeProps = {
    name: string;
    size?: 'sm' | 'md';
};

/**
 * A single technology rendered as a brand-tinted chip.
 * The brand colour is handed to CSS as `--tech` so `globals.css` owns the look.
 */
const TechBadge = ({ name, size = 'sm' }: TechBadgeProps) => {
    const { label, icon: Icon, color } = getTech(name);

    return (
        <span
            className={size === 'sm' ? 'tech-badge' : 'tech-badge tech-badge--md'}
            style={{ '--tech': color } as CSSProperties}
        >
            <Icon className="tech-badge__icon" aria-hidden />
            {label}
        </span>
    );
};

export default TechBadge;

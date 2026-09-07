'use client';

import Link from 'next/link';
import type { IconType } from 'react-icons';

type SocialLinkProps = {
    title: string;
    url: string;
    icon: IconType;
    size?: number;
    className: string;
    onNavigate?: () => void;
};

/**
 * In-site links (email → /contact) stay in this tab. External socials open in a
 * new one.
 */
const SocialLink = ({
    title,
    url,
    icon: Icon,
    size = 18,
    className,
    onNavigate,
}: SocialLinkProps) => {
    if (url.startsWith('http')) {
        return (
            <a
                href={url}
                aria-label={title}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                onClick={onNavigate}
            >
                <Icon size={size} />
            </a>
        );
    }

    return (
        <Link href={url} aria-label={title} className={className} onClick={onNavigate}>
            <Icon size={size} />
        </Link>
    );
};

export default SocialLink;

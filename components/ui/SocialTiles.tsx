'use client';

import { SOCIALS } from '@/lib/constants';
import SocialLink from './SocialLink';

/**
 * Icon-only social links as square tiles. Shared by the sidebar footer and the
 * intro on the home page so both clusters stay identical.
 */
const SocialTiles = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex gap-2">
        {SOCIALS.map((social) => (
            <SocialLink
                key={social.title}
                {...social}
                className="social-tile"
                onNavigate={onNavigate}
            />
        ))}
    </div>
);

export default SocialTiles;

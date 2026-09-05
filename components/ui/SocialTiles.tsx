import { SOCIALS } from '@/lib/constants';

/**
 * Icon-only social links as square tiles. Shared by the sidebar footer and the
 * intro on the home page so both clusters stay identical.
 */
const SocialTiles = () => (
    <div className="flex gap-2">
        {SOCIALS.map(({ title, icon: Icon, url }) => (
            <a
                key={title}
                href={url}
                aria-label={title}
                target={url.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="social-tile"
            >
                <Icon size={18} />
            </a>
        ))}
    </div>
);

export default SocialTiles;

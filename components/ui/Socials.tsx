import { SOCIALS } from "@/lib/constants"

const Socials = () => (
    <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        {SOCIALS.map(({ title, icon: Icon, url }) => (
            <a
                key={title}
                href={url}
                target={url.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-ui text-fg-muted transition-colors hover:text-accent"
            >
                <Icon size={20} className="text-accent" />
                {title}
            </a>
        ))}
    </div>
)

export default Socials

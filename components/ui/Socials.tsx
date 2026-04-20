import { SOCIALS } from "@/lib/constants"
import Link from "next/link"

const Socials = () => {
    return (
        <div className='flex flex-wrap mt-10 gap-8 items-center '>
            {
                SOCIALS.map(({ title, icon: Icon, url }) => (
                    <Link key={title} href={url} className='flex items-center gap-2'>
                        <Icon size={25} style={{ fill: 'none', color: 'var(--color-accent)' }} />
                        <p className='text-ui'>{title}</p>
                    </Link>

                ))
            }
        </div>
    )
}

export default Socials

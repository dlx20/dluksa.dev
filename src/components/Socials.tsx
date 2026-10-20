'use client'
import { FiGithub } from 'react-icons/fi';
import { TbBrandLinkedin } from 'react-icons/tb';
import { HiOutlineMail } from 'react-icons/hi';
import { SocialLinks } from '@/lib/constants';
import Link from 'next/link';

const socialIcons = [

]

const Socials = () => {

    return (
        <div className='flex gap-2'>
            {
                SocialLinks.map((social) => (
                    <Link key={social.title} href={social.url} 
                    className='flex size-10 items-center justify-center border rounded-card border-accent/15 bg-accent/5 text-accent/60 transition-colors hover:bg-accent hover:text-surface-base'
                    >
                        <social.icon />
                    </Link>
                ))
            }
        </div>
    )
}

export default Socials;
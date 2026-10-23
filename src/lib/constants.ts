import { FiGithub } from 'react-icons/fi';
import { TbBrandLinkedin } from 'react-icons/tb';
import { HiOutlineMail } from 'react-icons/hi';
import { IconType } from 'react-icons';

// Site navigation
export const navLinks = [
    { title: 'Home', url: '/' },
    { title: 'Projects', url: '/projects' },
    { title: 'Notes', url: '/notes' },
    { title: 'Resume', url: '/resume' },
    { title: 'Contact', url: '/contact' },
];

// Socials

export const SocialLinks: {title: string; icon: IconType; url: string}[] = [
    {
        title: 'LinkedIn',
        icon: TbBrandLinkedin,
        url: 'https://www.linkedin.com/in/dovydas-luk/'
    },
    {
        title: 'GitHub',
        icon: FiGithub,
        url: 'https://github.com/dlx20'
    },
    {
        title: 'Mail',
        icon: HiOutlineMail,
        url: '/contact'
    }
]


// Status

export const NowStatus = [
    {
        title: 'Status',
        description: 'Open to full-stack and machine learning roles, particularly opportunities that combine Next.js, modern web technologies, and AI/ML.',
    },
    {
        title: 'Focus',
        description: 'Full-stack Next.js and machine learning.',
    },
    {
        title: 'Base',
        description: 'London, UK',
    },
    {
        title: 'Learning',
        description: 'Advanced Next.js and full-stack engineering.',
    },
] 



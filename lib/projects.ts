import { RiNextjsFill, RiTailwindCssFill, RiReactjsFill } from "react-icons/ri";
import { SiTypescript, SiNodedotjs, SiDjango,SiPython, SiPostgresql, SiSupabase, SiDocker, SiVercel, SiGithub } from "react-icons/si";
import { BiLogoPostgresql } from "react-icons/bi";
import { IconType } from "react-icons";

export const SKILLS: {
    section: string;
    skills: { title: string; icon: IconType }[];
}[] = [
    {
        section: 'Frontend',
        skills: [
            {
                title: 'React',
                icon: RiReactjsFill,
            },
            {
                title: 'Next.js',
                icon: RiNextjsFill,
            },
            {
                title: 'Tailwindcss',
                icon: RiTailwindCssFill,
            }
        ]
    },
    {
        section: 'Backend',
        skills: [
            {
                title: 'Node.js',
                icon: SiNodedotjs,
            },
            {
                title: 'TypeScript',
                icon: SiTypescript,
            },
            {
                title: 'Django',
                icon: SiDjango,
            },
            {
                title: 'Python',
                icon: SiPython,
            },
            {
                title: 'PostgreSQL',
                icon: BiLogoPostgresql,
            },
            {
                title: 'Supabase',
                icon: SiSupabase,
            }
        ]
    },
    {
        section: 'Infrastructure',
        skills: [
            {
                title: 'Docker',
                icon: SiDocker
            }, 
            {
                title: 'Vercel',
                icon: SiVercel
            },
            {
                title: 'GitHub',
                icon: SiGithub
            }
        ]
    }
    
];
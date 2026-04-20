import { FiGithub } from "react-icons/fi";
import { TbBrandLinkedin } from "react-icons/tb";
import { HiOutlineMail } from "react-icons/hi";
import { IconType } from "react-icons";


// Site links
export const links = [
    {
        title: "Home",
        url: '/',
    },
    {
        title: "Projects",
        url: "/projects"
    },
    {
        title: "Resume",
        url: "/resume"
    }
]

// Theme specific accents
export const ACCENT_COLORS = [
    'coral-rose',
    'sage-green',
    'amber-glow',
    'glacier-blue',
    'orchid-purple',
    'sky-blue',
    'steel-grey',
];

// Theme labels
export const THEMES = [
    { id: "palenight", label: "Palenight" },
    { id: "void", label: "Void" },
    { id: "ashlight", label: "Ashlight" },
]

// Project card data
export const PROJECT_DATA : {
    id: string;
    name: string;
    status: string;
    description: string;
    technologies: string[];
}[] = [
    {
        id: "2026 - 1",
        name: "AETHER_ENGINE",
        status: "LIVE",
        description: "A distributed task processing engine built to handle millions of websocket events in real-time.",
        technologies: ['Tailwindcss', 'Django', 'Next.js'],
    },
    {
        id: "2026 - 2",
        name: "VOID_OS",
        status: "LIVE",
        description: "A browser-based terminal operating system with a custom file system and command-line parser.",
        technologies: ['TypeScript', 'Tailwind', 'Zustand'],
    },
    {
        id: "2026 - 3",
        name: "SPECTER_API",
        status: "OFFLINE",
        description: "High-performance GraphQL gateway for aggregating disparate microservice data sources.",
        technologies: ['Apollo', 'Node.js', 'Postgres'],
    },
    {
        id: "2026 - 4",
        name: "NEBULA_DASH",
        status: "LIVE",
        description: "Financial analytics dashboard with real-time SVG charting and predictive trend analysis.",
        technologies: ['D3.js', 'React', 'FastAPI'],
    },
]


import { RiNextjsFill, RiTailwindCssFill, RiReactjsFill } from "react-icons/ri";
import { SiTypescript, SiNodedotjs, SiDjango,SiPython, SiPostgresql, SiSupabase, SiDocker, SiVercel, SiGithub } from "react-icons/si";
import { BiLogoPostgresql } from "react-icons/bi";


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

export const SOCIALS: {
    title: string;
    icon: IconType;
    url: string;
}[] = [
        {
            title: 'LinkedIn',
            icon: TbBrandLinkedin,
            url: 'https://www.linkedin.com/in/dovydas-luk/',
        },
        {
            title: 'GitHub',
            icon: FiGithub,
            url: 'https://github.com/dluksa20',
        },
        {
            title: 'Email',
            icon: HiOutlineMail,
            url: '',
        }
    ]


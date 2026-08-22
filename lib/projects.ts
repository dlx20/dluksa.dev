import { RiNextjsFill, RiTailwindCssFill, RiReactjsFill } from "react-icons/ri";
import { SiTypescript, SiNodedotjs, SiDjango,SiPython, SiPostgresql, SiSupabase, SiDocker, SiVercel, SiGithub } from "react-icons/si";
import { BiLogoPostgresql } from "react-icons/bi";
import { IconType } from "react-icons";


// Project card data
export const PROJECT_DATA: {
  id: string;
  slug: string;
  name: string;
  status: string;
  description: string;
  technologies: string[];
}[] = [
  {
    id: "2026 - 1",
    slug: "aether-engine",
    name: "AETHER_ENGINE",
    status: "LIVE",
    description:
      "A distributed task processing engine built to handle millions of websocket events in real-time.",
    technologies: ["Tailwindcss", "Django", "Next.js"],
  },
  {
    id: "2026 - 2",
    slug: "void-os",
    name: "VOID_OS",
    status: "LIVE",
    description:
      "A browser-based terminal operating system with a custom file system and command-line parser.",
    technologies: ["TypeScript", "Tailwind", "Zustand"],
  },
  {
    id: "2026 - 3",
    slug: "specter-api",
    name: "SPECTER_API",
    status: "OFFLINE",
    description:
      "High-performance GraphQL gateway for aggregating disparate microservice data sources.",
    technologies: ["Apollo", "Node.js", "Postgres"],
  },
  {
    id: "2026 - 4",
    slug: "nebula-dash",
    name: "NEBULA_DASH",
    status: "LIVE",
    description:
      "Financial analytics dashboard with real-time SVG charting and predictive trend analysis.",
    technologies: ["D3.js", "React", "FastAPI"],
  },
];


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
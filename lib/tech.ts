import type { IconType } from 'react-icons';
import { FiCode } from 'react-icons/fi';
import { FaJava } from 'react-icons/fa';
import {
    SiC,
    SiCplusplus,
    SiCss3,
    SiDjango,
    SiDocker,
    SiExpress,
    SiFastapi,
    SiFirebase,
    SiFlask,
    SiGithub,
    SiGnubash,
    SiGo,
    SiGooglecloud,
    SiHtml5,
    SiInternetcomputer,
    SiJavascript,
    SiJupyter,
    SiKubernetes,
    SiMongodb,
    SiNextdotjs,
    SiNodedotjs,
    SiNumpy,
    SiOpencv,
    SiPandas,
    SiPhp,
    SiPostgresql,
    SiPrisma,
    SiPython,
    SiPytorch,
    SiReact,
    SiRedis,
    SiRuby,
    SiRust,
    SiSass,
    SiScikitlearn,
    SiShell,
    SiSolidity,
    SiSupabase,
    SiTailwindcss,
    SiTensorflow,
    SiTypescript,
    SiVercel,
    SiVite,
} from 'react-icons/si';

export type Tech = {
    label: string;
    icon: IconType;
    /** Brand colour, used to tint the badge icon, border and background. */
    color: string;
};

/**
 * Every technology the site knows how to render, keyed by a lowercase alias.
 * GitHub language names and repository topics are both looked up here, so a
 * single entry covers `TypeScript`, `typescript` and the `typescript` topic.
 */
const TECH: Record<string, Tech> = {
    // Languages
    typescript: { label: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
    javascript: { label: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
    python: { label: 'Python', icon: SiPython, color: '#3776AB' },
    html: { label: 'HTML', icon: SiHtml5, color: '#E34F26' },
    css: { label: 'CSS', icon: SiCss3, color: '#1572B6' },
    scss: { label: 'SCSS', icon: SiSass, color: '#CC6699' },
    go: { label: 'Go', icon: SiGo, color: '#00ADD8' },
    rust: { label: 'Rust', icon: SiRust, color: '#DEA584' },
    java: { label: 'Java', icon: FaJava, color: '#E76F00' },
    php: { label: 'PHP', icon: SiPhp, color: '#777BB4' },
    ruby: { label: 'Ruby', icon: SiRuby, color: '#CC342D' },
    c: { label: 'C', icon: SiC, color: '#A8B9CC' },
    'c++': { label: 'C++', icon: SiCplusplus, color: '#00599C' },
    shell: { label: 'Shell', icon: SiShell, color: '#89E051' },
    'jupyter notebook': { label: 'Jupyter', icon: SiJupyter, color: '#F37626' },
    solidity: { label: 'Solidity', icon: SiSolidity, color: '#AA6746' },
    motoko: { label: 'Motoko', icon: SiInternetcomputer, color: '#8B5CF6' },

    // Frontend
    react: { label: 'React', icon: SiReact, color: '#61DAFB' },
    // Brands whose logo is pure black or white get a neutral grey so the badge
    // stays legible in both the dark and light themes.
    'next.js': { label: 'Next.js', icon: SiNextdotjs, color: '#A1A1AA' },
    nextjs: { label: 'Next.js', icon: SiNextdotjs, color: '#A1A1AA' },
    tailwindcss: { label: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
    tailwind: { label: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
    vite: { label: 'Vite', icon: SiVite, color: '#646CFF' },

    // Backend
    'node.js': { label: 'Node.js', icon: SiNodedotjs, color: '#5FA04E' },
    nodejs: { label: 'Node.js', icon: SiNodedotjs, color: '#5FA04E' },
    express: { label: 'Express', icon: SiExpress, color: '#94A3B8' },
    django: { label: 'Django', icon: SiDjango, color: '#44B78B' },
    flask: { label: 'Flask', icon: SiFlask, color: '#94A3B8' },
    fastapi: { label: 'FastAPI', icon: SiFastapi, color: '#009688' },
    prisma: { label: 'Prisma', icon: SiPrisma, color: '#5A67D8' },

    // Data
    postgresql: { label: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
    postgres: { label: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
    mongodb: { label: 'MongoDB', icon: SiMongodb, color: '#47A248' },
    redis: { label: 'Redis', icon: SiRedis, color: '#FF4438' },
    supabase: { label: 'Supabase', icon: SiSupabase, color: '#3FCF8E' },
    firebase: { label: 'Firebase', icon: SiFirebase, color: '#FFCA28' },

    // Machine learning
    pytorch: { label: 'PyTorch', icon: SiPytorch, color: '#EE4C2C' },
    tensorflow: { label: 'TensorFlow', icon: SiTensorflow, color: '#FF6F00' },
    opencv: { label: 'OpenCV', icon: SiOpencv, color: '#5C3EE8' },
    numpy: { label: 'NumPy', icon: SiNumpy, color: '#4DABCF' },
    pandas: { label: 'pandas', icon: SiPandas, color: '#E70488' },
    'scikit-learn': { label: 'scikit-learn', icon: SiScikitlearn, color: '#F7931E' },

    // Infrastructure
    docker: { label: 'Docker', icon: SiDocker, color: '#2496ED' },
    kubernetes: { label: 'Kubernetes', icon: SiKubernetes, color: '#326CE5' },
    vercel: { label: 'Vercel', icon: SiVercel, color: '#A1A1AA' },
    'google-cloud': { label: 'Google Cloud', icon: SiGooglecloud, color: '#4285F4' },
    gcp: { label: 'Google Cloud', icon: SiGooglecloud, color: '#4285F4' },
    bash: { label: 'Bash', icon: SiGnubash, color: '#4EAA25' },
    github: { label: 'GitHub', icon: SiGithub, color: '#94A3B8' },
};

const FALLBACK_COLOR = '#94A3B8';

/** Turn a topic slug like `pose-estimation` into `Pose Estimation`. */
function humanize(name: string): string {
    return name
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

/**
 * Resolve any GitHub language name or topic into something renderable.
 * Unknown entries still get a badge, just with a generic icon.
 */
export function getTech(name: string): Tech {
    return (
        TECH[name.toLowerCase()] ?? {
            label: humanize(name),
            icon: FiCode,
            color: FALLBACK_COLOR,
        }
    );
}

import type { IconType } from 'react-icons';
import { FiGithub } from 'react-icons/fi';
import { TbBrandLinkedin } from 'react-icons/tb';
import { HiOutlineMail } from 'react-icons/hi';

export const EMAIL = 'ddev@dluksa.dev';
export const LOCATION = 'London, England';

// Site navigation
export const links = [
    { title: 'Home', url: '/' },
    { title: 'Projects', url: '/projects' },
    { title: 'Resume', url: '/resume' },
];

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
    { id: 'palenight', label: 'Palenight' },
    { id: 'void', label: 'Void' },
    { id: 'ashlight', label: 'Ashlight' },
];

/**
 * Skill groups reference technologies by name only. Icons and brand colours
 * come from the shared registry in `lib/tech.ts`, the same one that renders
 * technology badges on project cards.
 */
export const SKILLS: { section: string; technologies: string[] }[] = [
    {
        section: 'Frontend',
        technologies: ['TypeScript', 'React', 'Next.js', 'Tailwindcss', 'HTML', 'CSS'],
    },
    {
        section: 'Backend',
        technologies: ['Python', 'Django', 'Node.js', 'PostgreSQL', 'Supabase'],
    },
    {
        section: 'Machine learning',
        technologies: ['PyTorch', 'TensorFlow', 'OpenCV', 'scikit-learn', 'NumPy', 'C++'],
    },
    {
        section: 'Infrastructure',
        technologies: ['Docker', 'Vercel', 'GitHub', 'Google-Cloud'],
    },
];

export const SOCIALS: { title: string; icon: IconType; url: string }[] = [
    {
        title: 'LinkedIn',
        icon: TbBrandLinkedin,
        url: 'https://www.linkedin.com/in/dovydas-luk/',
    },
    {
        title: 'GitHub',
        icon: FiGithub,
        url: 'https://github.com/dlx20',
    },
    {
        title: 'Email',
        icon: HiOutlineMail,
        url: `mailto:${EMAIL}`,
    },
];

/** Resume content, rendered as-is by `/resume`. */
export const RESUME = {
    summary:
        "Master's graduate in Robotics, AI and Autonomous Systems, now building for the web. " +
        'I have designed, trained and deployed machine learning models in Python with ' +
        'TensorFlow and PyTorch, and I build the interfaces around them with TypeScript, ' +
        'React and Next.js. The part I care about is the handover: taking work that only ' +
        'runs in a notebook and turning it into something people can actually use.',

    experience: [
        {
            role: 'Manager',
            company: 'Poppies Fish and Chips',
            period: 'January 2022 — Present',
            location: 'London, UK',
            highlights: [
                'Oversee daily operations of a high-volume restaurant, holding service and quality standards.',
                'Manage scheduling, training and performance for a team of 15+.',
                'Introduced inventory control that cut food waste by 5%.',
                'Maintain health and safety compliance: HACCP, Food Hygiene Rating 5.',
                'Handle customer escalations, improving satisfaction scores by 12%.',
                'Optimise labour costs through shift planning without compromising service.',
            ],
        },
        {
            role: 'Project Engineer',
            company: 'ILT Baltic',
            period: 'March 2020 — February 2021',
            location: 'Vilnius, Lithuania',
            highlights: [
                'Produced ISO-compliant technical documentation: drawings, manuals and specifications.',
                'Ran projects end to end in Zoho Projects, covering timelines, budgets and resourcing.',
                'Owned client communication and proposals through Zoho CRM.',
                'Coordinated international teams over MS Teams and SharePoint.',
            ],
        },
    ],

    education: [
        {
            qualification: 'MSc Robotics, AI & Autonomous Systems',
            institution: 'City, University of London',
            period: 'September 2022 — November 2023',
            grade: 'First class honours',
            detail:
                'Machine learning, deep learning, computer vision and reinforcement learning, ' +
                'in Python and C++ with TensorFlow, PyTorch and scikit-learn.',
        },
        {
            qualification: 'BEng (Hons) Mechanical Engineering (Top-up)',
            institution: 'London South Bank University',
            period: 'September 2021 — July 2022',
            grade: 'First class honours',
            detail:
                'Manufacturing systems, thermofluids and engineering projects, with SolidWorks ' +
                'and AutoCAD.',
        },
        {
            qualification: 'BEng Robotics & Automation Engineering',
            institution: 'Vilnius Gediminas Technical University',
            period: 'September 2018 — January 2021',
            grade: 'Grade 8.3/10 · 150 ECTS',
            detail:
                'Mechatronics, CAD/CAM, C and C++ programming, and electrical engineering.',
        },
    ],

    certifications: [
        {
            title: 'Meta Front-End Developer Professional Certificate',
            issuer: 'Coursera',
            date: 'May 2025',
            detail: 'JavaScript, React, HTML and CSS, responsive layout and UI/UX design.',
        },
        {
            title: 'Google IT Automation with Python',
            issuer: 'Coursera',
            date: 'October 2024',
            detail: 'Python and Bash scripting, Git, Google Cloud Platform, Puppet configuration.',
        },
        {
            title: 'PyTorch Deep Learning Bootcamp',
            issuer: 'Udemy',
            date: 'July 2024',
            detail: 'CNN development, vision transformers, transfer learning, Hugging Face deployment.',
        },
    ],
};

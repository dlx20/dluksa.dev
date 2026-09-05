import { LOCATION } from './constants';

/** Home-only copy. Edit here rather than in the page markup. */

export const NOW = [
    {
        label: 'Status',
        value: 'Open to web and ML-adjacent roles.',
    },
    {
        label: 'Focus',
        value: 'Shipping interfaces around models, not only the models.',
    },
    {
        label: 'Base',
        value: LOCATION,
    },
    {
        label: 'Learning',
        value: 'Next.js in production, after the Meta front-end certificate.',
    },
] as const;

export const PROCESS = [
    {
        step: '01',
        title: 'Train',
        body: 'Design and train models in Python with PyTorch and TensorFlow, then evaluate them until the numbers hold.',
    },
    {
        step: '02',
        title: 'Wrap',
        body: 'Put a TypeScript, React and Next.js interface around the work so someone other than me can run it.',
    },
    {
        step: '03',
        title: 'Ship',
        body: 'Deploy it — Docker, Cloud Run, a public URL — and keep the handover as small as the first click.',
    },
] as const;

export const LAB = {
    title: 'Spacecraft pose estimation',
    kicker: 'MSc · City, University of London · 2022–2023',
    problem:
        'A chaser craft needs to know another spacecraft’s position and orientation from camera images. The useful answer is a pose, not a notebook full of plots.',
    built:
        'Trained and compared vision models in Python — CNNs and related architectures — with the usual computer-vision stack, then measured how well they recovered pose.',
    result:
        'First-class MSc. The public write-up and code sit on GitHub with the rest of the project list.',
    technologies: ['Python', 'PyTorch', 'TensorFlow', 'OpenCV', 'scikit-learn', 'NumPy', 'C++'],
} as const;

export const TIMELINE = [
    {
        year: '2018',
        title: 'BEng Robotics & Automation',
        place: 'Vilnius Gediminas Technical University',
    },
    {
        year: '2020',
        title: 'Project Engineer',
        place: 'ILT Baltic, Vilnius',
    },
    {
        year: '2021',
        title: 'BEng Mechanical Engineering',
        place: 'London South Bank University',
    },
    {
        year: '2022',
        title: 'MSc Robotics, AI & Autonomous Systems',
        place: 'City, University of London · Poppies, London',
    },
    {
        year: '2024',
        title: 'ML and automation certificates',
        place: 'PyTorch bootcamp · Google IT Automation',
    },
    {
        year: '2025',
        title: 'Front-end, then this site',
        place: 'Meta certificate · Next.js, live from GitHub',
    },
] as const;

export const FAQ = [
    {
        question: 'Why web after robotics?',
        answer:
            'A model that only runs in a notebook is unfinished. I trained the robotics and vision work; the part I want next is the interface people actually use.',
    },
    {
        question: 'What are you looking for?',
        answer:
            'Web roles in London — TypeScript, React, Next.js — where an ML background is a plus rather than the whole job.',
    },
    {
        question: 'London or remote?',
        answer:
            'Based in London. Happy with hybrid or UK remote; I would rather be in the same city as the team.',
    },
    {
        question: 'Machine learning or frontend?',
        answer:
            'Both, in that order of a product: train it, then wrap it. I do not want to pick a side and stop at the .ipynb.',
    },
] as const;

export const COLOPHON = [
    {
        title: 'Live GitHub',
        body: 'The project list, languages, commit pulse and contribution graph are fetched from GitHub on the server. Nothing on the cards is hardcoded.',
    },
    {
        title: 'Themes',
        body: 'Palenight, Void, Cyberpunk, Ashlight and Cream, plus seven accent colours — all CSS variables, no restyle per page.',
    },
    {
        title: 'Hosted on Cloud Run',
        body: 'Next.js standalone output, built in Cloud Build, served from Google Cloud. Same stack I use for everything else I ship.',
    },
    {
        title: 'Footer terminal',
        body: 'help, info, stats, ls, find, open, cd. It talks to the same project list as the cards.',
    },
] as const;

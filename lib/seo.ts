import type { Metadata } from 'next';
import { EMAIL, SOCIALS } from '@/lib/constants';
import type { ProjectSummary } from '@/lib/github';

export const SITE_NAME = 'ddev';
export const AUTHOR_NAME = 'Dovydas Luksa';
export const SITE_TITLE = 'ddev — Dovydas Luksa';
export const SITE_DESCRIPTION =
    'Dovydas Luksa (ddev) — MSc in Robotics, AI and Autonomous Systems. Next.js full-stack and AI/ML developer based in London.';

export const PAGE_COPY = {
    projects: {
        title: 'Projects — ddev',
        description:
            'Public GitHub projects by Dovydas Luksa — Next.js, TypeScript, Python, and machine learning work from ddev.',
    },
    resume: {
        title: 'Resume — ddev',
        description:
            'Dovydas Luksa — MSc Robotics, AI & Autonomous Systems. Machine learning in Python, web applications in TypeScript, React and Next.js. Based in London.',
    },
    contact: {
        title: 'Contact — ddev',
        description:
            'Get in touch with Dovydas Luksa — Next.js full-stack and machine learning, based in London. Attach a CV or project files.',
    },
} as const;

export function siteUrl(): string {
    return process.env.NEXT_PUBLIC_APP_URL ?? 'https://dluksa.dev';
}

/** Absolute URL for a site path (`/` → origin, `/projects` → origin/projects). */
export function canonicalUrl(path = '/'): string {
    const origin = siteUrl().replace(/\/$/, '');
    if (path === '/') return origin;
    return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

export function ogImageUrl(): string {
    return canonicalUrl('/opengraph-image');
}

type PageMetaExtras = {
    type?: 'website' | 'profile' | 'article';
    modifiedTime?: string;
};

export function pageMetadata(
    path: string,
    title: string,
    description: string,
    extras: PageMetaExtras = {}
): Metadata {
    const url = canonicalUrl(path);
    const image = {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: title,
    };

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            siteName: SITE_NAME,
            locale: 'en_GB',
            type: extras.type ?? 'website',
            images: [image],
            ...(extras.modifiedTime ? { modifiedTime: extras.modifiedTime } : {}),
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
    };
}

export function siteVerification(): Metadata['verification'] {
    const google = process.env.GOOGLE_SITE_VERIFICATION;
    const bing = process.env.BING_SITE_VERIFICATION;

    if (!google && !bing) return undefined;

    return {
        ...(google ? { google } : {}),
        ...(bing ? { other: { 'msvalidate.01': bing } } : {}),
    };
}

function personId() {
    return `${canonicalUrl()}/#person`;
}

function websiteId() {
    return `${canonicalUrl()}/#website`;
}

function organizationId() {
    return `${canonicalUrl()}/#organization`;
}

export function siteJsonLd() {
    const origin = canonicalUrl();
    const icon = `${origin}/icon`;

    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': organizationId(),
                name: SITE_NAME,
                url: origin,
                logo: {
                    '@type': 'ImageObject',
                    url: icon,
                    width: 512,
                    height: 512,
                },
            },
            {
                '@type': 'WebSite',
                '@id': websiteId(),
                url: origin,
                name: SITE_NAME,
                alternateName: AUTHOR_NAME,
                description: SITE_DESCRIPTION,
                inLanguage: 'en-GB',
                publisher: { '@id': organizationId() },
                author: { '@id': personId() },
            },
            {
                '@type': 'Person',
                '@id': personId(),
                name: AUTHOR_NAME,
                givenName: 'Dovydas',
                familyName: 'Luksa',
                alternateName: [SITE_NAME, 'dlx20'],
                url: origin,
                image: icon,
                description: SITE_DESCRIPTION,
                jobTitle: 'Next.js full-stack and AI/ML developer',
                email: EMAIL,
                knowsAbout: [
                    'Next.js',
                    'TypeScript',
                    'React',
                    'Python',
                    'PyTorch',
                    'TensorFlow',
                    'Machine learning',
                ],
                alumniOf: {
                    '@type': 'CollegeOrUniversity',
                    name: 'City, University of London',
                },
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'London',
                    addressCountry: 'GB',
                },
                sameAs: SOCIALS.filter((social) => social.url.startsWith('http')).map(
                    (social) => social.url
                ),
            },
        ],
    };
}

export function webPageJsonLd(
    path: string,
    title: string,
    description: string,
    type: 'WebPage' | 'ProfilePage' | 'CollectionPage' | 'ContactPage' = 'WebPage'
) {
    const url = canonicalUrl(path);

    return {
        '@context': 'https://schema.org',
        '@type': type,
        '@id': `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: 'en-GB',
        isPartOf: { '@id': websiteId() },
        about: { '@id': personId() },
        author: { '@id': personId() },
    };
}

export function projectsJsonLd(projects: ProjectSummary[]) {
    const page = webPageJsonLd(
        '/projects',
        PAGE_COPY.projects.title,
        PAGE_COPY.projects.description,
        'CollectionPage'
    );

    return {
        ...page,
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: projects.length,
            itemListElement: projects.map((project, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: project.name,
                url: canonicalUrl(`/projects/${project.slug}`),
            })),
        },
    };
}

export function projectJsonLd(project: ProjectSummary) {
    const path = `/projects/${project.slug}`;
    const url = canonicalUrl(path);
    const description =
        project.excerpt || `${project.name} — a project by ${AUTHOR_NAME} on ddev.`;

    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: canonicalUrl(),
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Projects',
                        item: canonicalUrl('/projects'),
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: project.name,
                        item: url,
                    },
                ],
            },
            {
                '@type': 'SoftwareSourceCode',
                name: project.name,
                description,
                url,
                codeRepository: project.githubUrl,
                programmingLanguage: project.language ?? undefined,
                dateModified: project.updatedAt,
                author: { '@id': personId() },
            },
        ],
    };
}

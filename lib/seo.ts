import type { Metadata } from 'next';

export const SITE_NAME = 'ddev';
export const SITE_TITLE = 'ddev — Dovydas Luksa';
export const SITE_DESCRIPTION =
    'Dovydas Luksa (ddev) — MSc in Robotics, AI and Autonomous Systems. Next.js full-stack and AI/ML developer based in London.';

export function siteUrl(): string {
    return process.env.NEXT_PUBLIC_APP_URL ?? 'https://dluksa.dev';
}

/** Absolute URL for a site path (`/` → origin, `/projects` → origin/projects). */
export function canonicalUrl(path = '/'): string {
    const origin = siteUrl().replace(/\/$/, '');
    if (path === '/') return origin;
    return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

export function pageMetadata(
    path: string,
    title: string,
    description: string
): Metadata {
    const url = canonicalUrl(path);

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            type: 'website',
        },
        twitter: {
            title,
            description,
        },
    };
}

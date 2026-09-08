export const SITE_NAME = 'ddev';
export const SITE_TITLE = 'ddev — Dovydas Luksa';
export const SITE_DESCRIPTION =
    'Dovydas Luksa (ddev) — MSc in Robotics, AI and Autonomous Systems. Next.js full-stack and AI/ML developer based in London.';

export function siteUrl(): string {
    return process.env.NEXT_PUBLIC_APP_URL ?? 'https://dluksa.dev';
}

import type { MetadataRoute } from 'next';
import { getProjects } from '@/lib/github';
import { siteUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const base = siteUrl();
    const now = new Date();
    const projects = await getProjects();

    const pages: MetadataRoute.Sitemap = ['', '/projects', '/resume', '/contact'].map(
        (path) => ({
            url: `${base}${path}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: path === '' ? 1 : 0.8,
        })
    );

    return [
        ...pages,
        ...projects.map((project) => ({
            url: `${base}/projects/${project.slug}`,
            lastModified: new Date(project.updatedAt),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        })),
    ];
}

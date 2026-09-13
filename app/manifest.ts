import type { MetadataRoute } from 'next';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: SITE_TITLE,
        short_name: SITE_NAME,
        description: SITE_DESCRIPTION,
        start_url: '/',
        display: 'standalone',
        background_color: '#1c1c1c',
        theme_color: '#1c1c1c',
        icons: [
            {
                src: '/icon',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/favicon.ico',
                sizes: '48x48',
                type: 'image/x-icon',
            },
        ],
    };
}

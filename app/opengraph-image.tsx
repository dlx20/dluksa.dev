import { ImageResponse } from 'next/og';
import { SITE_DESCRIPTION, SITE_TITLE } from '@/lib/seo';

export const alt = SITE_TITLE;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    background: '#1c1c1c',
                    padding: 80,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 120,
                        height: 120,
                        borderRadius: 28,
                        background: '#2a2a2a',
                        color: '#C3E88D',
                        fontSize: 48,
                        fontWeight: 700,
                        marginBottom: 40,
                    }}
                >
                    $d
                </div>
                <div
                    style={{
                        display: 'flex',
                        fontSize: 52,
                        fontWeight: 700,
                        color: '#C3E88D',
                    }}
                >
                    {SITE_TITLE}
                </div>
                <div
                    style={{
                        display: 'flex',
                        marginTop: 24,
                        fontSize: 28,
                        color: '#a8a8a8',
                        maxWidth: 960,
                        lineHeight: 1.4,
                    }}
                >
                    {SITE_DESCRIPTION}
                </div>
            </div>
        ),
        size
    );
}

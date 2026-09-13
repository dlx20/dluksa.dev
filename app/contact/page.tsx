import type { Metadata } from 'next';
import TerminalSection from '@/components/TerminalSection';
import EmailForm from '@/components/EmailForm';
import JsonLd from '@/components/JsonLd';
import { PAGE_COPY, pageMetadata, webPageJsonLd } from '@/lib/seo';

export const metadata: Metadata = pageMetadata(
    '/contact',
    PAGE_COPY.contact.title,
    PAGE_COPY.contact.description
);

const ContactPage = () => (
    <div className="site-page">
        <JsonLd
            id="ld-contact"
            data={webPageJsonLd(
                '/contact',
                PAGE_COPY.contact.title,
                PAGE_COPY.contact.description,
                'ContactPage'
            )}
        />
        <div className="site-page__inner">
            <TerminalSection label="etc" title="contact me">
                <EmailForm />
            </TerminalSection>
        </div>
    </div>
);

export default ContactPage;

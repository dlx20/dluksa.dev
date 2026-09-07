import type { Metadata } from 'next';
import TerminalSection from '@/components/TerminalSection';
import EmailForm from '@/components/EmailForm';

export const metadata: Metadata = {
    title: 'Contact — ddev',
    description:
        'Get in touch with Dovydas Luksa — Next.js full-stack and machine learning, based in London. Attach a CV or project files.',
};

const ContactPage = () => (
    <div className="site-page">
        <div className="site-page__inner">
            <TerminalSection label="etc" title="contact me">
                <EmailForm />
            </TerminalSection>
        </div>
    </div>
);

export default ContactPage;

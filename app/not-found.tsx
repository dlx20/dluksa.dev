import Link from 'next/link';
import TerminalSection from '@/components/TerminalSection';

const NotFound = () => (
    <div className="site-page">
        <div className="site-page__inner">
            <TerminalSection label="err" title="not found">
                <p className="mb-6 text-body leading-7 text-fg-muted">
                    That path is not on this machine. Head back to the home page, or type{' '}
                    <span className="text-fg-base">cd home</span> in the footer.
                </p>

                <Link href="/" className="btn-outline">
                    Back to home
                </Link>
            </TerminalSection>
        </div>
    </div>
);

export default NotFound;

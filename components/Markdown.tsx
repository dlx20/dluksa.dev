import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

type MarkdownProps = {
    content: string;
    /** Root used to resolve relative image and link paths from the README. */
    baseUrl: string;
};

const ABSOLUTE_URL = /^(https?:\/\/|mailto:|#)/i;

function resolveUrl(url: string, baseUrl: string): string {
    if (!url) return '';
    if (ABSOLUTE_URL.test(url)) return url;
    // Anything else carrying a scheme (javascript:, data:, …) is dropped.
    if (url.includes(':')) return '';
    return `${baseUrl}/${url.replace(/^\.?\//, '')}`;
}

/**
 * READMEs commonly wrap logos in raw HTML such as `<p align="center"><img …>`.
 * `urlTransform` only sees markdown-native links, so relative paths inside raw
 * HTML attributes are rewritten here before parsing.
 */
function resolveHtmlUrls(markdown: string, baseUrl: string): string {
    return markdown.replace(
        /(<[^>]+\s(?:src|href)=")([^"]+)(")/gi,
        (_match, before, url, after) => `${before}${resolveUrl(url, baseUrl)}${after}`
    );
}

const Markdown = ({ content, baseUrl }: MarkdownProps) => (
    <div className="markdown">
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            // Raw HTML from a README is untrusted, so it is always sanitised.
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            urlTransform={(url) => resolveUrl(url, baseUrl)}
            components={{
                a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer">
                        {children}
                    </a>
                ),
            }}
        >
            {resolveHtmlUrls(content, baseUrl)}
        </ReactMarkdown>
    </div>
);

export default Markdown;

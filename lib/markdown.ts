/**
 * Markdown constructs that carry no meaning once flattened to plain text.
 * Line-anchored rules match `[ \t]` rather than `\s` so that indentation is
 * consumed but the surrounding newlines — which mark paragraph breaks — are not.
 */
const PLAIN_TEXT_RULES: [RegExp, string][] = [
    [/```[\s\S]*?```/g, ''], // fenced code blocks
    [/<!--[\s\S]*?-->/g, ''], // HTML comments
    [/<[^>]*>/g, ''], // inline HTML, including shield badges
    [/!\[[^\]]*]\([^)]*\)/g, ''], // images
    [/\[([^\]]*)]\([^)]*\)/g, '$1'], // links, keeping their text
    [/^[ \t]{0,3}#{1,6}[ \t]+.*$/gm, ''], // headings
    [/^[ \t]{0,3}>[ \t]?/gm, ''], // block quotes
    [/^[ \t]{0,3}[-*+][ \t]+/gm, ''], // list bullets
    [/[*_`~]/g, ''], // emphasis and inline code markers
];

/**
 * Flatten the opening of a README into a short card summary. Headings, badges
 * and images are stripped first so the first remaining paragraphs — the
 * description at the top of the file — are what the card shows.
 */
export function toExcerpt(markdown: string, maxLength = 320): string {
    if (!markdown.trim()) return '';

    const plainText = PLAIN_TEXT_RULES.reduce(
        (text, [pattern, replacement]) => text.replace(pattern, replacement),
        markdown
    );

    const summary = plainText
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .join(' ');

    if (!summary) return '';
    if (summary.length <= maxLength) return summary;

    const clipped = summary.slice(0, maxLength);
    const lastSpace = clipped.lastIndexOf(' ');

    return `${clipped.slice(0, lastSpace > 0 ? lastSpace : maxLength).trimEnd()}…`;
}

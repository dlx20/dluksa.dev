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

const MIN_LENGTH = 40;

/** Above this length a paragraph is taken to be prose whatever its punctuation. */
const SUBSTANTIAL_LENGTH = 80;

/**
 * Distinguishes a description from the tagline that often sits directly under a
 * README title. Taglines are short and unpunctuated; real prose either runs long
 * or ends in a full stop.
 */
function isDescription(paragraph: string): boolean {
    if (paragraph.length >= SUBSTANTIAL_LENGTH) return true;
    return paragraph.length >= MIN_LENGTH && /[.!?]$/.test(paragraph);
}

/**
 * Flatten markdown into a single-line summary suitable for a project card.
 * Picks the first substantial paragraph so that a README opening with a title,
 * a row of badges or a table of contents still yields a useful sentence.
 */
export function toExcerpt(markdown: string, maxLength = 180): string {
    if (!markdown.trim()) return '';

    const plainText = PLAIN_TEXT_RULES.reduce(
        (text, [pattern, replacement]) => text.replace(pattern, replacement),
        markdown
    );

    const paragraphs = plainText
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
        .filter(Boolean);

    const summary = paragraphs.find(isDescription) ?? paragraphs[0];
    if (!summary) return '';
    if (summary.length <= maxLength) return summary;

    const clipped = summary.slice(0, maxLength);
    const lastSpace = clipped.lastIndexOf(' ');

    return `${clipped.slice(0, lastSpace > 0 ? lastSpace : maxLength).trimEnd()}…`;
}

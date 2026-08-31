/**
 * Fixed locale so server and client render the same string and React does not
 * report a hydration mismatch.
 */
const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
});

export function formatDate(isoDate: string): string {
    return DATE_FORMAT.format(new Date(isoDate));
}

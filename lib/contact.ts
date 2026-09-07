/** Shared limits for the contact form — enforced on the client and the API. */

export const CONTACT_MAX_FILES = 4;
export const CONTACT_MAX_FILE_BYTES = 4 * 1024 * 1024;
export const CONTACT_MAX_TOTAL_BYTES = 8 * 1024 * 1024;

export const CONTACT_ACCEPT = '.pdf,.png,.jpg,.jpeg,.webp,.txt,.doc,.docx,.zip';

const ALLOWED_EXTENSIONS = new Set([
    'pdf',
    'png',
    'jpg',
    'jpeg',
    'webp',
    'txt',
    'doc',
    'docx',
    'zip',
]);

export function fileExtension(name: string): string {
    const dot = name.lastIndexOf('.');
    return dot >= 0 ? name.slice(dot + 1).toLowerCase() : '';
}

export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function safeFilename(name: string): string {
    const base = name.replace(/^.*[/\\]/, '').replace(/[^\w.\- ()]/g, '_');
    return (base || 'attachment').slice(0, 120);
}

/** Returns an error message, or null if the file is allowed. */
export function fileError(
    file: { name: string; size: number },
    currentTotal: number,
    currentCount: number
): string | null {
    if (currentCount >= CONTACT_MAX_FILES) {
        return `At most ${CONTACT_MAX_FILES} files.`;
    }
    if (!ALLOWED_EXTENSIONS.has(fileExtension(file.name))) {
        return `${file.name} is not an allowed type.`;
    }
    if (file.size <= 0) {
        return `${file.name} is empty.`;
    }
    if (file.size > CONTACT_MAX_FILE_BYTES) {
        return `${file.name} is over ${formatFileSize(CONTACT_MAX_FILE_BYTES)}.`;
    }
    if (currentTotal + file.size > CONTACT_MAX_TOTAL_BYTES) {
        return `Attachments cannot exceed ${formatFileSize(CONTACT_MAX_TOTAL_BYTES)} in total.`;
    }
    return null;
}

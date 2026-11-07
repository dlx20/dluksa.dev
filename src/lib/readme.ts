// Clean up raw GitHub READMEs so they display well on the site

// Fenced code blocks and inline code, which must be left exactly as written
const CODE = /^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?^ {0,3}\1[`~]*[ \t]*$|`[^`\n]+`/gm;

const BADGE_IMAGE =
  /!\[[^\]]*\]\([^)]*(?:shields\.io|badgen\.net|badge\.svg|\/badge\/)[^)]*\)/;
const LINKED_BADGE = new RegExp(`\\[${BADGE_IMAGE.source}\\]\\([^)]*\\)`, "g");

// Mermaid diagrams would display as raw code, so they go with any heading directly above them
const MERMAID_BLOCK =
  /(?:^#{1,6} [^\n]*\n\s*)?^ {0,3}(`{3,}|~{3,})mermaid[^\n]*\n[\s\S]*?^ {0,3}\1[`~]*[ \t]*$/gm;

// Already a full URL (https:, mailto:, //host) or a link within the page
const isAbsolute = (url: string) => /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(url);

// Run a transform on everything except code
const outsideCode = (markdown: string, transform: (text: string) => string) => {
  let result = "";
  let position = 0;

  for (const match of markdown.matchAll(CODE)) {
    result += transform(markdown.slice(position, match.index)) + match[0];
    position = match.index + match[0].length;
  }

  return result + transform(markdown.slice(position));
};

// Convert a raw README into cleaned-up markdown for the project page
export const formatReadme = (
  raw: string,
  fullName: string,
  branch: string,
): string => {
  const resolve = (url: string, base: string) =>
    isAbsolute(url) ? url : new URL(url.replace(/^\/+/, ""), base).href;

  // Images need the raw file, links open the file's page on GitHub
  const imageBase = `https://raw.githubusercontent.com/${fullName}/${branch}/`;
  const linkBase = `https://github.com/${fullName}/blob/${branch}/`;

  const source = raw.replace(/\r\n/g, "\n").replace(MERMAID_BLOCK, "");

  const formatted = outsideCode(source, (text) =>
    text
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(LINKED_BADGE, "")
      .replace(new RegExp(BADGE_IMAGE.source, "g"), "")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(
        /(!\[[^\]]*\]\()\s*([^)\s]+)/g,
        (_, start: string, url: string) => start + resolve(url, imageBase),
      )
      .replace(
        /(\]\()\s*([^)\s]+)/g,
        (_, start: string, url: string) => start + resolve(url, linkBase),
      ),
  );

  return formatted
    .trimStart()
    .replace(/^# [^\n]*\n?/, "") // The page already shows the project name
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

// Get the first paragraph of a formatted README for use on project cards
export const getReadmeSummary = (formatted: string): string => {
  const paragraph = formatted
    .replace(CODE, (code) => (code.startsWith("`") && !code.includes("\n") ? code : ""))
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find(
      (block) =>
        block && !/^(?:#{1,6}\s|!\[|\[!\[|>|[-*+]\s|\d+\.\s|\||<)/.test(block),
    );

  return paragraph?.replace(/\s*\n\s*/g, " ") ?? "";
};

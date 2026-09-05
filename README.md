# ddev — dluksa.dev

Personal portfolio built with Next.js 16 (App Router), React 19 and Tailwind CSS 4.
Projects are not hardcoded: the site reads them live from the GitHub REST API.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment variables

Create `.env.local`:

| Variable | Required | Purpose |
| --- | --- | --- |
| `GITHUB_USERNAME` | yes | Account whose public repositories are listed. Defaults to `dluksa20`. |
| `GITHUB_TOKEN` | recommended | Classic PAT with **no scopes**. Raises the API rate limit from 60 to 5000 requests/hour. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | no | Renders the location map. Falls back to a text label when absent. |
| `EMAIL_USER`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN` | no | Gmail OAuth credentials for the contact form. |

Without `GITHUB_TOKEN` the site still works, but a full build plus a few page
loads can exhaust the 60 requests/hour anonymous limit, and project lists render
empty until the limit resets.

## How projects are built

`lib/github.ts` is the only place that talks to GitHub. For each public,
non-fork, non-archived repository it combines three endpoints:

- `/users/{user}/repos` — name, stars, homepage, last push
- `/repos/{user}/{repo}/languages` — technologies, with languages under 3% of the
  codebase dropped as noise
- `/repos/{user}/{repo}/readme` — the description
- GraphQL `contributionCalendar` — the home-page commit heatmap (falls back to
  the public profile contributions page if no token is set)

READMEs serve double duty. `lib/markdown.ts` flattens the markdown and picks the
first substantial paragraph as the card excerpt, skipping titles, shield badges
and tables of contents. The dedicated project page renders the whole README with
`react-markdown`.

Responses are cached for an hour (`revalidate: 3600`), so pages stay static
between refreshes.

### Improving how a project appears

Everything on a card comes from the repository itself, so no code changes are
needed:

- **Description** — write a README with a real opening paragraph.
- **Technologies** — add repository *topics*. They are appended to the detected
  languages, so `nextjs`, `docker` or `supabase` show up as badges.
- **Live badge and link** — set the repository *website* field.

## Footer terminal

The prompt pinned to the bottom of every page accepts a small command set,
defined in `lib/terminal.ts`:

| Command | Does |
| --- | --- |
| `help` | Lists everything below |
| `info` | Who the site belongs to and how to get in touch |
| `stats` (also `git stats`) | Repository count, total stars, last push, most-used technologies |
| `ls` | Every project with its main technologies |
| `find <text>` | Matches projects on name or technology |
| `open <project>` | Navigates to a project page |
| `cd <home\|projects\|resume>` | Navigates to a page |
| `clear` | Empties the scrollback |

Each command is a `{ name, usage, description, run }` object in one array, and
`help` is generated from that array — adding a command means appending one entry.
`run` returns lines to print plus an optional route to navigate to, so the
command logic stays free of React.

Output folds away when the page is scrolled or pressed, and unfolds again when
the prompt is focused — the scrollback is kept either way, so a session survives
being collapsed and survives navigation, since the footer lives in the layout.

Project data reaches the footer from the root layout, which passes a trimmed
list (slug, technologies, stars, date) rather than full `Project` objects so
READMEs never ship to the browser.

## Deploy

The production image is built by `cloudbuild.yaml` and served from Cloud Run.
Pass `GITHUB_TOKEN` as a Cloud Run secret if the unauthenticated GitHub limit
starts emptying the project list in production.

## Design system

`app/globals.css` holds all shared styling. Three themes (`palenight`, `void`,
`ashlight`) and seven accent colours are driven entirely by CSS variables:

- Colours: `surface-base`, `surface-elevated`, `surface-hovered`, `accent`,
  `fg-base`, `fg-muted`, plus `success` / `warning` / `danger`.
- Type scale: `text-ui` for labels and metadata, `text-body` for prose,
  `text-subheading` and `text-heading`.
- Rounding: the single `rounded-card` token.

Technology icons and brand colours live in one registry, `lib/tech.ts`. Both the
skill list on the home page and the badges on project cards read from it, so a
technology only has to be defined once.

## Scripts

```bash
npm run dev     # development server
npm run build   # production build
npm run start   # serve the production build on :8080
npm run lint    # eslint
```

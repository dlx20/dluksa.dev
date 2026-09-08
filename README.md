# ddev

Personal site of **Dovydas Luksa** — [dluksa.dev](https://dluksa.dev).

A terminal-styled portfolio for an MSc graduate in Robotics, AI and Autonomous Systems who now builds for the web. Machine learning work lives in Python (PyTorch, TensorFlow); product work lives in TypeScript, React and Next.js. The site is the handover in public: live GitHub data, a real contact form, and a command prompt at the bottom of every page.

## What it does

- **Home** — intro, current focus, featured lab work, live project cards with a GitHub-style commit pulse, stack, career timeline, FAQ, contribution heatmap, themes and accents.
- **Projects** — public repositories from GitHub, filterable by technology, grid or row layout. Each card links to a page that renders the repository README.
- **Resume** — education, experience and certifications.
- **Contact** — message form with optional file attachments (PDF, images, Word, zip), delivered by Gmail OAuth.

Projects are not hardcoded. The list, languages, topics, commit pulse and contribution calendar are fetched from GitHub and cached for an hour.

## Stack

| Layer | Choice |
| --- | --- |
| App | Next.js 16 (App Router), React 19, TypeScript |
| Style | Tailwind CSS 4, CSS variables for five themes and seven accents |
| Data | GitHub REST + public HTML fallbacks when the API is rate-limited |
| Mail | Nodemailer + Google OAuth |
| Hosting | Docker standalone output → Cloud Build → Cloud Run (`europe-west1`) |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build    # production build
npm run start    # serve the standalone build on :8080
npm run lint
```

## Environment

Create `.env.local`:

| Variable | Required | Purpose |
| --- | --- | --- |
| `GITHUB_USERNAME` | no | Public GitHub account to list. Defaults to `dlx20`. |
| `GITHUB_TOKEN` | recommended | Classic PAT with **no scopes**. Raises the REST limit from 60 to 5,000 requests/hour. |
| `NEXT_PUBLIC_APP_URL` | production | Canonical site URL (metadata and email links). Defaults to `https://dluksa.dev`. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | no | Location map on the home page. Falls back to a text label. |
| `EMAIL_USER` | contact form | Gmail address that sends and receives enquiries. |
| `GOOGLE_CLIENT_ID` | contact form | OAuth client for Gmail. |
| `GOOGLE_CLIENT_SECRET` | contact form | OAuth client secret. |
| `GOOGLE_REFRESH_TOKEN` | contact form | OAuth refresh token. |

Without `GITHUB_TOKEN` the site still runs. A production build plus a few page loads can burn the anonymous quota; the project grid then renders empty until the hour resets. Pass the token as a Cloud Run secret in production.

## GitHub data

`lib/github.ts` is the only module that talks to GitHub.

- **List** — `GET /users/{user}/repos`. If that 403s, the public repositories page is scraped instead.
- **Cards** — name, description, language, topics, stars, last push, plus a 52-week commit pulse from `/{user}/{repo}/graphs/participation` (not the REST stats endpoint, which is often rate-limited).
- **Project page** — README from the API, or `raw.githubusercontent.com` if the API is unavailable.
- **Heatmap** — GraphQL contribution calendar when a token is set; otherwise the public contributions HTML.

Forks, archived repos, private repos, and the profile repo named after the user are skipped. Card copy comes from the repository itself: a real opening paragraph in the README, topics for extra tech badges, and the website field for a live link.

## Footer terminal

The prompt at the bottom of every page is defined in `lib/terminal.ts`. `help` is generated from the same command list.

| Command | Action |
| --- | --- |
| `help` | List commands |
| `info` | About the author and the site |
| `now` | Current focus and availability |
| `faq` | Short answers hiring managers usually ask |
| `stats` | Repo count, stars, last push, top technologies |
| `ls` | Every project |
| `find <text>` | Search by name or technology |
| `open <project>` | Open a project page |
| `cd <home\|projects\|resume\|contact>` | Go to a route |
| `clear` | Empty the scrollback |

The footer lives in the root layout, so a session survives navigation. It receives a trimmed project list (slug, technologies, stars, date) so READMEs never ship to the browser.

## Design

Themes and accents are CSS variables in `app/globals.css`: Palenight, Void, Cyberpunk, Ashlight and Cream, plus coral, sage, amber, glacier, orchid, sky and steel. Technology icons and brand colours live in `lib/tech.ts` and are shared by the home stack, project badges and filters.

## Deploy

`output: 'standalone'`. `cloudbuild.yaml` builds the image, pushes it to Artifact Registry, and deploys service `dluksa-dev` on Cloud Run. Mail OAuth secrets and the Maps key are injected at deploy time; `GITHUB_TOKEN` should be added the same way if the public API limit is not enough.

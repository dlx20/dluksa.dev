import type { CSSProperties } from 'react';
import { FaGithub } from 'react-icons/fa';
import { GITHUB_USERNAME, type ContributionCalendar } from '@/lib/github';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

const DAY_TITLE = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
});

function monthLabels(weeks: ContributionCalendar['weeks']): (string | null)[] {
    return weeks.map((week, index) => {
        const first = week.days.find(Boolean);
        if (!first) return null;

        const month = new Date(`${first.date}T00:00:00`).getUTCMonth();
        const previous = weeks[index - 1]?.days.find(Boolean);
        const previousMonth = previous
            ? new Date(`${previous.date}T00:00:00`).getUTCMonth()
            : null;

        return previousMonth === month ? null : MONTHS[month];
    });
}

/**
 * GitHub-style contribution calendar. Cells stretch to fill the card so the
 * year reads as one band, and the grid scrolls sideways on narrow screens
 * instead of shrinking into unreadable dots.
 */
const ContributionGraph = ({ calendar }: { calendar: ContributionCalendar | null }) => {
    const labels = calendar ? monthLabels(calendar.weeks) : [];

    return (
        <div className="card">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="icon-tile">
                        <FaGithub size={18} className="text-accent" />
                    </span>

                    <div>
                        <h3 className="font-semibold text-accent">Commit history</h3>
                        <p className="text-ui text-fg-muted">
                            {calendar
                                ? `${calendar.total.toLocaleString('en-GB')} contributions in the last year`
                                : 'Last twelve months on GitHub'}
                        </p>
                    </div>
                </div>

                <a
                    href={`https://github.com/${GITHUB_USERNAME}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-subtle"
                >
                    @{GITHUB_USERNAME}
                </a>
            </div>

            {calendar ? (
                <div className="contrib-scroll">
                    <div
                        className="contrib-graph"
                        style={{ '--weeks': calendar.weeks.length } as CSSProperties}
                    >
                        <span className="contrib-corner" aria-hidden />

                        <div className="contrib-months">
                            {labels.map((label, index) => (
                                <span key={`month-${index}`} className="contrib-month">
                                    {label}
                                </span>
                            ))}
                        </div>

                        <div className="contrib-days" aria-hidden>
                            {DAY_LABELS.map((label, index) => (
                                <span key={`day-${index}`} className="contrib-day">
                                    {label}
                                </span>
                            ))}
                        </div>

                        <div className="contrib-weeks">
                            {calendar.weeks.map((week, weekIndex) => (
                                <div key={week.days.find(Boolean)?.date ?? weekIndex} className="contrib-week">
                                    {week.days.map((day, dayIndex) =>
                                        day ? (
                                            <div
                                                key={day.date}
                                                className="contrib-cell"
                                                data-level={day.level}
                                                title={`${day.count} contribution${day.count === 1 ? '' : 's'} on ${DAY_TITLE.format(new Date(`${day.date}T00:00:00`))}`}
                                            />
                                        ) : (
                                            <div
                                                key={`empty-${weekIndex}-${dayIndex}`}
                                                className="contrib-cell contrib-cell--empty"
                                            />
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-body text-fg-muted">
                    Contribution data is unavailable right now. GitHub may be rate
                    limiting requests.
                </p>
            )}

            {calendar && (
                <div className="mt-4 flex items-center justify-end gap-1.5 text-ui text-fg-muted">
                    <span>Less</span>
                    {[0, 1, 2, 3, 4].map((level) => (
                        <span key={level} className="contrib-cell contrib-cell--legend" data-level={level} />
                    ))}
                    <span>More</span>
                </div>
            )}
        </div>
    );
};

export default ContributionGraph;

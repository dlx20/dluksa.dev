'use client';

import { useState, type CSSProperties } from 'react';
import { FaGithub } from 'react-icons/fa';
import type { ContributionCalendar } from '@/lib/github';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

/** Skip a month label that would sit closer than this many weeks to the last one. */
const MONTH_GAP_WEEKS = 8;

const DAY_TITLE = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
});

function monthLabels(weeks: ContributionCalendar['weeks']): (string | null)[] {
    const starts = weeks.map((week, index) => {
        const first = week.days.find(Boolean);
        if (!first) return null;

        const month = new Date(`${first.date}T00:00:00`).getUTCMonth();
        const previous = weeks[index - 1]?.days.find(Boolean);
        const previousMonth = previous
            ? new Date(`${previous.date}T00:00:00`).getUTCMonth()
            : null;

        return previousMonth === month ? null : MONTHS[month];
    });

    let lastShown = -MONTH_GAP_WEEKS;
    return starts.map((label, index) => {
        if (!label || index - lastShown < MONTH_GAP_WEEKS) return null;
        lastShown = index;
        return label;
    });
}

const ContributionGraph = ({
    calendar: initialCalendar,
    years,
    initialYear,
}: {
    calendar: ContributionCalendar | null;
    years: number[];
    initialYear: number;
}) => {
    const [year, setYear] = useState(initialYear);
    const [calendar, setCalendar] = useState(initialCalendar);
    const [loading, setLoading] = useState(false);

    const selectYear = async (next: number) => {
        if (next === year) return;
        setYear(next);
        setLoading(true);

        try {
            const response = await fetch(`/api/contributions?year=${next}`);
            const payload = response.ok ? ((await response.json()) as ContributionCalendar | null) : null;
            setCalendar(payload);
        } finally {
            setLoading(false);
        }
    };

    const labels = calendar ? monthLabels(calendar.weeks) : [];

    return (
        <div className="card">
            <div className="mb-5 flex items-center gap-3">
                <span className="icon-tile">
                    <FaGithub size={18} className="text-accent" />
                </span>

                <div>
                    <h3 className="font-semibold text-accent">Commit history</h3>
                    <p className="text-ui text-fg-muted">
                        {calendar
                            ? `${calendar.total.toLocaleString('en-GB')} contributions in ${year}`
                            : `Contributions in ${year}`}
                    </p>
                </div>
            </div>

            <div className="flex items-start gap-4">
                <div className={`min-w-0 flex-1 ${loading ? 'opacity-50' : ''}`}>
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
                                        <div
                                            key={week.days.find(Boolean)?.date ?? weekIndex}
                                            className="contrib-week"
                                        >
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
                                <span
                                    key={level}
                                    className="contrib-cell contrib-cell--legend"
                                    data-level={level}
                                />
                            ))}
                            <span>More</span>
                        </div>
                    )}
                </div>

                {years.length > 0 && (
                    <div
                        role="group"
                        aria-label="Contribution year"
                        className="contrib-years"
                    >
                        {years.map((entry) => (
                            <button
                                key={entry}
                                type="button"
                                aria-pressed={entry === year}
                                onClick={() => selectYear(entry)}
                                className="contrib-year"
                            >
                                {entry}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContributionGraph;

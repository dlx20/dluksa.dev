const WIDTH = 156;
const HEIGHT = 28;
const WEEKS = 52;

/**
 * GitHub-style participation sparkline: a filled pulse of weekly commits
 * over the last year. Pure SVG, so it stays on the server-rendered card.
 */
const CommitPulse = ({ values }: { values: number[] }) => {
    const series = values.length >= 2 ? values : Array.from({ length: WEEKS }, () => 0);
    const max = Math.max(...series, 1);
    const step = WIDTH / (series.length - 1);
    const points = series.map((count, index) => {
        const x = index * step;
        const y = HEIGHT - (count / max) * (HEIGHT - 3) - 1.5;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
    });

    const line = `M${points.join(' L')}`;
    const area = `M0,${HEIGHT} L${points.join(' L')} L${WIDTH},${HEIGHT} Z`;
    const commits = series.reduce((total, count) => total + count, 0);

    return (
        <svg
            className="project-card__pulse"
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            preserveAspectRatio="none"
            role="img"
            aria-label={`${commits} commits in the last year`}
        >
            <title>{`${commits} commits in the last year`}</title>
            <path className="project-card__pulse-fill" d={area} />
            <path className="project-card__pulse-line" d={line} />
        </svg>
    );
};

export default CommitPulse;

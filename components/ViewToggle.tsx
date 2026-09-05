import { FaList, FaThLarge } from 'react-icons/fa';

export type ProjectView = 'grid' | 'rows';

const OPTIONS = [
    { id: 'grid' as const, label: 'Grid', icon: FaThLarge },
    { id: 'rows' as const, label: 'Rows', icon: FaList },
];

/**
 * Two-option sliding switch. The pill is a single element that translates,
 * so the highlight actually slides instead of two buttons swapping colours.
 */
const ViewToggle = ({
    value,
    onChange,
}: {
    value: ProjectView;
    onChange: (view: ProjectView) => void;
}) => (
    <div role="group" aria-label="Project layout" data-view={value} className="view-toggle">
        <span className="view-toggle__slider" aria-hidden />

        {OPTIONS.map(({ id, label, icon: Icon }) => (
            <button
                key={id}
                type="button"
                aria-label={label}
                aria-pressed={value === id}
                onClick={() => onChange(id)}
                className="view-toggle__option"
            >
                <Icon size={13} />
            </button>
        ))}
    </div>
);

export default ViewToggle;

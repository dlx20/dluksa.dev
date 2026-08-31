import { MdOutlinePalette } from 'react-icons/md';
import ThemeSwitcher from './ThemeSwitcher';
import AccentSwitcher from './AccentSwitcher';

type AppearanceSettingsProps = {
    /** Swatch shape: squares on the home page card, circles in the sidebar. */
    shape?: 'square' | 'circle';
};

/**
 * Theme and accent controls, shared by the home page settings card and the
 * sidebar so both stay identical.
 */
const AppearanceSettings = ({ shape = 'circle' }: AppearanceSettingsProps) => (
    <div className="space-y-5">
        <div className="flex items-center gap-3">
            <span className="icon-tile">
                <MdOutlinePalette size={20} className="fill-accent" />
            </span>

            <div>
                <h3 className="font-semibold text-accent">Appearance</h3>
                <p className="text-ui text-fg-muted">Theme and accent colour</p>
            </div>
        </div>

        <ThemeSwitcher />
        <AccentSwitcher shape={shape} />
    </div>
);

export default AppearanceSettings;

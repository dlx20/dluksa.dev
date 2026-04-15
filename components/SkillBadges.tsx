import { IconType } from 'react-icons';

type CardProps = {
    title?: string;
    skills: { title: string; icon: IconType }[];
    filter?: boolean;
    skillsArray?: string[];
};

const SkillBadges = ({ title, skills, skillsArray, filter = false }: CardProps) => {


    const filteredSkills = skills.filter((skill) => skillsArray?.includes(skill.title));
    if (filter && (!skillsArray?.length || filteredSkills.length === 0)) return null;

    return (
        <div className="flex font-display text-ui text-fg-base">
            {!filter ? (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <span className="flex size-1.5 rounded-full bg-accent/60 shadow-[0_0_6px] shadow-accent" />
                        <span className="text-base uppercase tracking-wide text-fg-base font-bold">
                            {title}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {skills.map(({ title: skillTitle, icon: Icon }) => (
                            <div
                                key={skillTitle}
                                className="container-elevated px-3 py-1.5"
                            >
                                <div className="flex items-center gap-2">
                                    <Icon size={18} className="fill-accent/70" />
                                    <span className="text-sm">{skillTitle}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>



            ) : (
                // Filter mode: compact list without sections
                <div className="flex flex-wrap gap-2 items-center">
                    {filteredSkills.map(({ title: skillTitle, icon: Icon }) => (
                        <div
                            key={skillTitle}
                            className="px-2.5 py-1 container-elevated"
                        >
                            <div className="flex items-center gap-1.5">
                                <Icon size={15} className="text-ui fill-accent/60" />
                                <span className="text-ui uppercase  text-fg-base">
                                    {skillTitle}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SkillBadges;
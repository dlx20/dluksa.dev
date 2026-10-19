import { log } from "console";
import { title } from "process";
import { ReactNode } from "react";

interface sectionProps {
  label: string;
  title: string[];
  id: string;
  children?: ReactNode;
}

const Section = ({ label, title, id, children }: sectionProps) => {
  const formatTitle = (title: string[]) =>
    title.map((word, index) => (
      <span
        key={index}
        className={index % 2 === 1 ? "text-accent" : "text-fg-base"}
      >
        {word.charAt(0).toUpperCase() + word.slice(1)}
      </span>
    ));

  return (
    <section
      id={id}
      className="relative scroll-mt-24 border-l border-fg-base/10 pb-12 pl-4 font-display last:pb-8 sm:pl-6 lg:pb-16 lg:last:pb-10 lg:pl-10"
    >
      <div className="absolute -left-px top-0 h-4 w-0.5 bg-accent"></div>
      <div>
        <div className="mb-2 flex items-center gap-4">
          <span className="text-ui font-light text-fg-muted">{label}</span>
          <span className="h-px flex-1 bg-accent/20" />
        </div>
        <h1>
          <span>{formatTitle(title)}</span>
        </h1>
      </div>
      {children}
    </section>
  );
};

export default Section;

import { log } from "console";
import { title } from "process";
import { ReactNode } from "react";

interface sectionProps {
  label: string;
  title: string[];
  id: string;
  children?: ReactNode;
}

const TerminalSection = ({ label, title, id, children }: sectionProps) => {
  const formatTitle = (title: string[]) =>
    title.map((word, index) => (
      <span
        key={index}
        className={index % 2 === 1 && word.length < 3 ? "text-accent" : "text-fg-base"}
      >
        {word.charAt(0).toUpperCase() + word.slice(1) + ' '}
      </span>
    ));

  return (
    <section
      id={id}
      className="relative border-l border-fg-base/10 pb-12 pl-4 sm:pl-6 lg:pl-10"
    >
      <div className="absolute -left-px top-0 h-4 w-0.5 bg-accent" />
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-ui font-light text-fg-muted">{label}</span>
          <span className="h-px flex-1 bg-accent/20" />
        </div>
        <h1 className="font-bold">
          <span>
            <span className="text-accent/60">$ </span>
            {formatTitle(title)}
            </span>
        </h1>
      {children}
      </div>
    </section>
  );
};

export default TerminalSection;

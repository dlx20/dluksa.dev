import { ReactNode } from "react";

type TerminalSectionProps = {
  label: string;
  title: string;
  children?: ReactNode;
};

/**
 * Highlights the section title: the middle word for three-word titles,
 * otherwise the first letter of every word after the first.
 */
const renderTitle = (title: string) => {
  const words = title
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

  const middleIndex = Math.floor(words.length / 2);

  return words.map((word, index) => (
    <span key={`${word}-${index}`}>
      {words.length === 3 ? (
        <span className={index === middleIndex ? "text-accent" : "text-fg-base"}>{word}</span>
      ) : index === 0 ? (
        <span className="text-fg-base">{word}</span>
      ) : (
        <>
          <span className="text-accent">{word[0]}</span>
          <span className="text-fg-base">{word.slice(1)}</span>
        </>
      )}{" "}
    </span>
  ));
};

const TerminalSection = ({ label, title, children }: TerminalSectionProps) => (
  <section className="relative border-l border-fg-base/10 pb-12 pl-4 font-display sm:pl-6 lg:pb-16 lg:pl-10">
    <span className="absolute -left-px top-0 h-4 w-0.5 bg-accent" />

    <div className="mb-6 lg:mb-8">
      <div className="mb-2 flex items-center gap-4">
        <span className="text-ui font-light text-fg-muted">{label}</span>
        <span className="h-px flex-1 bg-accent/20" />
      </div>

      <h1 className="font-bold">
        <span className="text-accent/60">$</span> {renderTitle(title)}
      </h1>
    </div>

    {children}
  </section>
);

export default TerminalSection;

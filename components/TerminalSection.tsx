import { ReactNode } from "react";

interface TerminalSectionProps {
  label: string;
  title: string;
  children?: ReactNode;
}

const TerminalSection = ({ label, title, children }: TerminalSectionProps) => {

  // Capitalize words
  const capitalize = (str: string): string[] => {
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  }

  // Generate title for section
  const generateTitle = (words: string[]) => {
    const middleIndex = Math.floor(words.length / 2);
    return words.map((word, index) => (
      <span key={index}>
        {words.length == 3 ? (
          index === middleIndex ? (
            <span className="text-accent">{word}</span>
          ) : (
            <span className="text-fg-base">{word}</span>
          )
        ) : index === 0 ? (
          <span className="text-fg-base">{word}</span>
        ) : (
          <>
            <span className="text-accent">{word[0]}</span>
            <span className="text-fg-base">{word.slice(1)}</span>
          </>
        )}
      </span>
    ));
  };


  return (
    <div className="font-display group relative border-l border-fg-base/10 px-4 pb-16 md:px-10">
      <div className='absolute -left-px top-0 h-4 w-0.5 bg-accent' />
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-ui text-fg-muted font-light">{label}</span>
          <div className="h-px flex-1 bg-accent/20" />
        </div>
        <div className="font-bold text-fg-base">
          {
            <h1> <span className="text-accent/60">$</span> {generateTitle(capitalize(title))}</h1>
          }
        </div>
      </div>
      {children}
    </div>
  );
};

export default TerminalSection;
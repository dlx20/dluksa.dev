import Section from "@/components/Section";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full font-display text-fg-base">
      <main className="mx-auto max-w-7xl pt-8 pb-4 sm:px-6 lg:pt-12">

        {/* About Section */}
        <Section id='usr' label="usr" title={['who', 'am', 'i']} >
          hello
        </Section>
      </main>
    </div>
  );
}

import Section from "@/components/Section";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full font-display text-fg-base">
      <main className="mx-auto max-w-7xl pt-8 pb-4 sm:px-6 lg:pt-12">
        {/* About Section */}
        <Section id="usr" label="usr" title={["who", "am", "i"]}>
          <p className="text-subheading leading-8 tracking-wide sm:leading-9">
            I have an MSc in Robotics, AI and Autonomous Systems, and I am
            looking for <span className="emphasize"> Next.js</span> full-stack or <span className="emphasize">AI/ML</span> roles in London. I train
            models in <span className="emphasize">Python</span> with <span className="emphasize">PyTorch</span> and <span className="emphasize">TensorFlow</span> , and I build web
            applications with <span className="emphasize">TypeScript</span> and <span className="emphasize">Next.js</span> .
          </p>
        </Section>

        {/* Now Status */}
        <Section id="now" label="now" title={["now", "status"]}></Section>
      </main>
    </div>
  );
}

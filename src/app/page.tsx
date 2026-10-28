import MiniMap from "@/components/MiniMap";
import ProjectCard from "@/components/ProjectCard";
import Socials from "@/components/Socials";
import StatusCard from "@/components/StatusCard";
import TechBadge from "@/components/TechBadge";
import TerminalSection from "@/components/TerminalSection";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { NowStatus, Skills } from "@/lib/constants";
import { fetchGithubRepos } from "@/lib/github";



export default async function Home() {

  const repos = await fetchGithubRepos();
  console.log(repos)
  return (
    <div className="w-full text-fg-base">
      <main className="mx-auto w-full max-w-7xl px-4 pt-8 pb-4 sm:px-6 lg:px-10 lg:pt-12">
        {/* About Section */}
        <TerminalSection id="usr" label="usr" title={["who", "am", "i"]}>
          <p className="text-subheading leading-8 tracking-wide sm:leading-9">
            I have an MSc in Robotics, AI and Autonomous Systems, and I am
            looking for <span className="emphasize"> Next.js</span> full-stack
            or <span className="emphasize">AI/ML</span> roles in London. I train
            models in <span className="emphasize">Python</span> with{" "}
            <span className="emphasize">PyTorch</span> and{" "}
            <span className="emphasize">TensorFlow</span> , and I build web
            applications with <span className="emphasize">TypeScript</span> and{" "}
            <span className="emphasize">Next.js</span> .
          </p>

          <div>
            <Socials />
          </div>
        </TerminalSection>

        {/* Now Status */}
        <TerminalSection id="now" label="now" title={["now", "status"]}>
          <StatusCard />
        </TerminalSection>

        <TerminalSection
          id="lab"
          label="lab"
          title={["lab", "notes"]}
        ></TerminalSection>

        <TerminalSection id="exe" label="exe" title={["active", "projects"]}>
          <div className="grid grid-cols-2 gap-2">
            <ProjectCard reposData={repos}/>

          </div>
        </TerminalSection>

        {/* Core Stack / Skills */}
        <TerminalSection id="sys" label="sys" title={["core", "stack"]}>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {Skills.map(({ section, technologies }) => (
              <div key={section} className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="size-1.5 shrink-0 rounded-full bg-accent/60 shadow-accent shadow-[0_0_6px]" />
                  <h3>{section}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((name) => (
                    <TechBadge name={name} size="md" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TerminalSection>

        <TerminalSection
          id="log"
          label="log"
          title={["how", "i", "work"]}
        ></TerminalSection>
        <TerminalSection
          id="hist"
          label="hist"
          title={["brief", "history"]}
        ></TerminalSection>
        <TerminalSection
          id="ask"
          label="ask"
          title={["common", "questions"]}
        ></TerminalSection>
        <TerminalSection
          id="etc"
          label="etc"
          title={["say", "hello"]}
        ></TerminalSection>

        {/* Page settings Themes etc ....  */}
        <TerminalSection id="bin" label="bin" title={["system", "settings"]}>
          <div className="grid md:grid-cols-2 gap-2">
            <div className="box">
              <MiniMap />
            </div>
            <div className="box p-4">
              <ThemeSwitcher />
            </div>
          </div>
        </TerminalSection>
        <TerminalSection
          id="man"
          label="man"
          title={["site", "manual"]}
        ></TerminalSection>
      </main>
    </div>
  );
}

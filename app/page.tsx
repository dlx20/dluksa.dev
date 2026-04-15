'use client'
import TerminalSection from '@/components/TerminalSection';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import AccentSwitcher from '@/components/AccentSwitcher';
import ProjectCard from '@/components/ProjectCard';
import { PROJECT_DATA, SKILLS, SOCIALS } from '@/lib/constants';
import Link from 'next/link';
import SkillBadges from '@/components/SkillBadges';
import EmailForm from '@/components/EmailForm';
import Initialize from '@/components/ui/Initialize';
import Socials from '@/components/ui/Socials';



const Page = () => {
  return (
    <div className="site-page__home">

      <div className="site-page__home-inner">

        {/* System.Terminal.Initialize() */}
        {/* <Initialize fileName='Readme.md' /> */}


          {/* SECTION 01: WHO_AM_I */}
          <TerminalSection
            label="usr"
            title="who am i"
          >
            <p className="text-subheading font-display leading-10 tracking-wide text-fg-base ">
              Junior <span className='text-accent underline underline-offset-5'>Full-Stack</span> Developer crafting performance-optimized web experiences.
              My current companions <span className='text-accent underline underline-offset-5'>Next.js</span> for responsive,
              SEO-friendly frontends and <span className='text-accent underline underline-offset-5'>Django</span> for scalable API architectures.
              Always learning, always shipping.
            </p>
            <Socials />
          </TerminalSection>



          {/* SECTION 02: CORE_STACK */}
          <TerminalSection
            label="sys"
            title="core stack"
          >
            <div className='flex flex-wrap justify-between'>
              {
                SKILLS.map(({ section, skills }) => (
                  <SkillBadges key={section} title={section} skills={skills} />
                ))
              }
            </div>
          </TerminalSection>



          {/* SECTION 03: ACTIVE_PROJECTS */}
          <TerminalSection
            label="exe"
            title="active projects"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {
                PROJECT_DATA.map(({ id, name, status, description, technologies }) => (
                  <ProjectCard
                    key={id}
                    name={name}
                    status={status}
                    desc={description}
                    tech={technologies}
                  />
                ))
              }
            </div>
          </TerminalSection>



          {/* SECTION 04: UI_SETTINGS */}

          <TerminalSection label='bin' title='system settings'>

            {/* Themes */}
            <div className='flex flex-wrap gap-2'>
              <div className='flex flex-col container-elevated justify-between flex gap-3 p-5'>
                <ThemeSwitcher />
                <AccentSwitcher shape='square' size='auto' />
              </div>

              {/* System Status */}
              <div className='flex border container-elevated p-5 '>
                <div className='space-y-3'>
                  <div className='text-[10px] uppercase tracking-wider text-accent/50 font-mono'>System Status</div>

                  <div className='space-y-2'>
                    <div className='flex items-center justify-between text-xs font-mono'>
                      <span className='text-text/60'>Services</span>
                      <div className='flex items-center gap-1.5'>
                        <span className='w-1.5 h-1.5 rounded-full bg-green-400'></span>
                        <span className='text-accent/70'>Online</span>
                      </div>
                    </div>

                    <div className='flex items-center justify-between text-xs font-mono'>
                      <span className='text-text/60'>Deploy</span>
                      <div className='flex items-center gap-1.5'>
                        <span className='w-1.5 h-1.5 rounded-full bg-green-400'></span>
                        <span className='text-accent/70'>Ready</span>
                      </div>
                    </div>

                    <div className='flex items-center justify-between text-xs font-mono'>
                      <span className='text-text/60'>Uptime</span>
                      <span className='text-accent/70'>99.8%</span>
                    </div>

                    <div className='h-px bg-accent/10 my-2'></div>

                    <div className='flex items-center justify-between text-xs font-mono'>
                      <span className='text-text/60'>Last Deploy</span>
                      <span className='text-accent/70'>2h ago</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex-1 container-elevated'>

              </div>
            </div>
          </TerminalSection>

          <TerminalSection label='etc' title='Helo World'>
            <EmailForm />

          </TerminalSection>


        System.Terminal.Initialize()
        <footer className="mt-10 flex border-t pt-5 justify-between items-center text-ui text-fg-base tracking-wide ">
          <Initialize endTransmission={true} />
          <Socials />
        </footer>
      </div>
    </div>
  );
};

export default Page;
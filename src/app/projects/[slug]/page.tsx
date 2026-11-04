import TerminalSection from '@/components/TerminalSection'
import { getProject } from '@/lib/github'
import { Suspense } from 'react'
import Markdown from 'react-markdown'

const page = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const projectData = await getProject(slug)
  return (
    <div>
      <TerminalSection id='pro' label='pro' title={['Project', 'info']}>
        <Suspense>

          <div>
            {
              projectData?.name
            }
          </div>
          <div>
            <Markdown>
              {
                projectData?.readme
              }
            </Markdown>
          </div>
        </Suspense>
      </TerminalSection>
    </div>
  )
}

export default page
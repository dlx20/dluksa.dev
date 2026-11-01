import TerminalSection from '@/components/TerminalSection'
import { getProject } from '@/lib/github'
import Markdown from 'react-markdown'

const page = async  ({params}: {params: {slug:string}}) => {
  const {slug} = await params
  const projectData = await getProject(slug)
  return (
    <div>
        <TerminalSection id='pro' label='pro' title={['Project', 'info']}>
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
        </TerminalSection>
    </div>
  )
}

export default page
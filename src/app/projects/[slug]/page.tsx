import TerminalSection from '@/components/TerminalSection'

const page = ({params}: {params: {slug:string}}) => {
  return (
    <div>
        <TerminalSection id='pro' label='pro' title={['Project', 'info']}>
            
        </TerminalSection>
    </div>
  )
}

export default page
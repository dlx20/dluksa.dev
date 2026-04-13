type IProps = {
    fileName?: string;
    endTransmission?: boolean;
}

const Initialize = ({ fileName, endTransmission }: IProps) => {
    return (
        <div className="mb-10 pl-2">
            <div className="text-ui text-fg-base mb-2 tracking-default uppercase">
                {`System.Terminal.${endTransmission ? 'End()' : 'Initialize()'}`}
            </div>
            {!endTransmission && (
                <h1 className="text-fg-muted text-ui">dluksa.dev/{fileName ?? ''}</h1>)}
        </div>
    )
}

export default Initialize

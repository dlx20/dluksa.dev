import Script from 'next/script';

type JsonLdProps = {
    id: string;
    data: unknown;
};

const JsonLd = ({ id, data }: JsonLdProps) => (
    <Script
        id={id}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
            __html: JSON.stringify(data).replace(/</g, '\\u003c'),
        }}
    />
);

export default JsonLd;

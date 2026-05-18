import Script from "next/script";

type JsonLdProps = {
    id: string;
    data: Record<string, unknown> | Array<Record<string, unknown>>;
};

export const JsonLd = ({ id, data }: JsonLdProps) => {
    return (
        <Script
            id={`jsonld-${id}`}
            type="application/ld+json"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(data).replace(/</g, "\\u003c"),
            }}
        />
    );
};

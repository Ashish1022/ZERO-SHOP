import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ZeroCart';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export type Props = {
  title?: string;
};

export default async function OpengraphImage(props?: Props): Promise<ImageResponse> {
  const { title } = {
    title: process.env.SITE_NAME || 'ZeroCart',
    ...props
  };

  const interBold = await fetch(
    new URL('../../public/fonts/Inter-Bold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

  const logoUrl = `${process.env.NEXT_PUBLIC_VERCEL_URL || 'https://zerocart.vercel.app'}/logo/logo.png`;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #404040',
            height: '160px',
            width: '160px',
            borderRadius: '24px',
            marginBottom: '48px',
          }}
        >
          <img
            src={logoUrl}
            alt="Logo"
            width="64"
            height="64"
            style={{ objectFit: 'contain' }}
          />
        </div>
        <p
          style={{
            fontSize: '60px',
            fontWeight: 700,
            color: 'white',
            textAlign: 'center',
            maxWidth: '1000px',
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {title}
        </p>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: interBold,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}
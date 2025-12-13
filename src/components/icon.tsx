import Image from 'next/image';

export default function LogoIcon(props: React.ComponentProps<'svg'>) {
  return (
    <Image
      src="/logo/logo.png"
      width={props.width ? Number(props.width) : 40}
      height={props.height ? Number(props.height) : 40}
      alt="logo"
    />
  );
}
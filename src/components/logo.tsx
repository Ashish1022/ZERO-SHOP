import Image from "next/image";

export default function LogoIcon(props: React.ComponentProps<"svg">) {
  return <Image src="/logo/logo.png" width={40} height={40} alt="logo" />;
}

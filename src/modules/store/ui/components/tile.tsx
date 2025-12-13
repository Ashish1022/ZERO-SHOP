import clsx from "clsx";
import Image from "next/image";
import { Label } from "./label";

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: "bottom" | "center";
  };
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={clsx(
        "group relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900",
        {
          "cursor-pointer": isInteractive,
        }
      )}
    >
      {props.src ? (
        <Image
          className={clsx(
            "aspect-square object-cover transition-transform duration-500",
            {
              "group-hover:scale-105": isInteractive,
            }
          )}
          {...props}
        />
      ) : null}

      {label ? (
        <Label
          title={label.title}
          amount={label.amount}
          currencyCode={label.currencyCode}
          position={label.position}
        />
      ) : null}
    </div>
  );
}

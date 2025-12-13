import clsx from "clsx";
import { CompactPrice } from "./price";

export const Label = ({
  title,
  amount,
  currencyCode,
  position = "bottom",
}: {
  title: string;
  amount: string;
  currencyCode: string;
  position?: "bottom" | "center";
}) => {
  return (
    <div className="absolute inset-x-0 bottom-0 p-2">
      <div className="flex items-center justify-between gap-2 rounded-lg bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 p-2 transition-all duration-300 group-hover:bg-white dark:group-hover:bg-neutral-900">
        <h3 className="line-clamp-1 text-sm font-medium leading-tight text-neutral-900 dark:text-white flex-1 min-w-0">
          {title}
        </h3>
        <div className="bg-blue-600 dark:bg-blue-500 rounded px-2 py-1">
          <CompactPrice
            className="text-sm font-semibold whitespace-nowrap text-white"
            amount={amount}
            currencyCode={currencyCode}
          />
        </div>
      </div>
    </div>
  );
};
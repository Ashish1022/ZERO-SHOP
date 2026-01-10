"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";

export const ThemeProvider = ({
  children,
  ...props
}: React.ComponentProps<typeof NextThemeProvider>) => {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
};

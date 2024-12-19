import { ReactNode } from "react";
import { Provider } from "@/components/ui/provider";

export const metadata = {
  title: "RandomBracket",
  description: "A 16-team random funny bracket generator",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}

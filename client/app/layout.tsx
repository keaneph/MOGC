import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "MOGC",
  description: "MSU-IIT Office of the Guidance and Counseling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

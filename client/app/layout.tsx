import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "@/styles/globals.css";

const inter = Inter({

  subsets: ['latin'],
  weight: ['400','500','600','700'], 
  variable: '--font-geist-inter',
  display: 'swap'
});

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
    <html lang="en" className={inter.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}

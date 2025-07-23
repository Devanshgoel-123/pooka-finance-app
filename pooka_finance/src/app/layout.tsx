import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./global.css";
import { AppKitProvider } from "@/components/AppProvider";



export const metadata:Metadata={
  title:"Pooka Finance | Cross Chain Perps",
  description:"Cross Chain Perps Exchange on Avalanche Network",
  icons:"/assets/pookaLogo.svg",
  colorScheme:'dark'
}

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display:"swap",
  weight:'500'
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.className} antialiased`}
      >
        <AppKitProvider>
        {children}
        </AppKitProvider>
      </body>
    </html>
  );
}

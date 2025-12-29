import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/context/web3-context";
import { AuthProvider } from "@/context/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TipJar Creator | Support Your Favorite Creators",
  description: "A decentralized platform for creators to share content and receive tips directly from their fans.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <Web3Provider>
          <AuthProvider>
            <div className="relative min-h-screen flex flex-col">
              {children}
            </div>
          </AuthProvider>
        </Web3Provider>
      </body>
    </html>
  );
}

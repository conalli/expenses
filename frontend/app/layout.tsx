import { Providers } from "@/components/providers";
import { NavLinks } from "@/components/ui/nav/NavLinks";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Expenses",
  description:
    "Manage your expenses efficiently by taking pictures of your receipts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <nav className="min-w-screen h-[80px] px-8 flex items-center justify-between border-b-2">
            <Link className="font-bold text-xl text-stone-700" href="/">
              Expenses.
            </Link>
            <NavLinks />
          </nav>
          {children}
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/widgets/header";
import "./globals.css";
import { Footer } from "@/widgets/footer";
import { QueryProvider } from "./providers/query-providers";
import { DEFAULT_OG_IMAGE, getSiteUrl, SITE_NAME } from "@/shared/config";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} — интернет-магазин комнатных и садовых растений`,
    template: "%s",
  },
  description:
    "Интернет-магазин живых комнатных и садовых растений «Зеленые усы». Подбор по уходу, размеру горшка и цене с бережной доставкой.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, alt: SITE_NAME }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen overflow-x-clip flex flex-col bg-cream pt-24 md:pt-28">
        <QueryProvider>
          <Header />
          <div className="flex-1 w-full pb-16 md:pb-24">
            <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
              {children}
            </div>
          </div>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
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

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className="min-h-full overflow-x-clip flex flex-col bg-cream pt-30 px-42  ">
        <QueryProvider>
          <Header />
          {children}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}

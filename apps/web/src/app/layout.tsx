import { Header } from "@/widgets/header/ui/header";
import "./globals.css";
import { Footer } from "@/widgets/footer/ui/footer";
import { QueryProvider } from "./providers/query-providers";

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

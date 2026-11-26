import { Hero } from "@/pages-flat/home";
import { Marquee } from "@/widgets/marquee";
import { FeaturedProd } from "@/widgets/featured-products";
import { Faq } from "@/widgets/faq";

export default function Home() {
  return (
    <main className="flex flex-col gap-16 md:gap-24">
      <Hero />
      <Marquee />
      <FeaturedProd />
      <Faq />
    </main>
  );
}

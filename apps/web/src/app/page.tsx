import { Hero } from "../pages-flat/home/ui/hero";
import { Marquee } from "@/widgets/marquee/ui/marquee";
import { FeaturedProducts } from "@/widgets/featured-products/featured-products";
import { Header } from "@/widgets/header/ui/header";
import { About } from "@/widgets/about/ui/about";
import { Footer } from "@/widgets/footer/ui/footer";
import { Blog } from "@/widgets/blog/blog";
import { Reviews } from "@/widgets/reviews/reviews";
import { Faq } from "@/widgets/faq/ui/faq";
import FeaturedProd from "@/widgets/featured-products/main";

export default function Home() {
  return (
    <main className="flex flex-col gap-12">
      <Hero />
      <Marquee />
      <FeaturedProd />
      <About />
      <Blog />
      <Reviews />
      <Faq />
    </main>
  );
}

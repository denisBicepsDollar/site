import { Hero } from "@/pages-flat/home";
import { Marquee } from "@/widgets/marquee";
import { FeaturedProd } from "@/widgets/featured-products";
import { About } from "@/widgets/about";
import { Blog } from "@/widgets/blog";
import { Reviews } from "@/widgets/reviews";
import { Faq } from "@/widgets/faq";

export default function Home() {
  return (
    <main className="flex flex-col gap-12">
      <Hero />
      <Marquee />
      <FeaturedProd />
      <About />
      {/*<Blog />*/}
      {/*<Reviews />*/}
      <Faq />
    </main>
  );
}

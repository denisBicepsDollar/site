import {Hero} from "../pages-flat/home/ui/hero.js";
import {Marquee} from "@/widgets/marquee/ui/marquee";
import {FeaturedProducts} from "@/widgets/featured-products/featured-products";
import {Header} from "@/widgets/header/ui/header";
import {About} from "@/widgets/about/ui/about";
import {Footer} from "@/widgets/footer/ui/footer";
import {Blog} from "@/widgets/blog/blog";
import {Reviews} from "@/widgets/reviews/reviews.js";
import {Faq} from "@/widgets/faq/ui/faq";

export default function Home() {
    return (
        <main>
            <Header/>
            <Hero/>
            <Marquee/>
            <FeaturedProducts/>
            <About/>
            <Blog/>
            <Reviews/>
            <Faq/>
            <Footer/>
        </main>
    );
}

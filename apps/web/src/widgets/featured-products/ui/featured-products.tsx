import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/entities/product";
import { Eyebrow, Reveal } from "@/shared/ui/reveal";
import { getProducts } from "@/shared/api";

export async function FeaturedProducts({}) {
  const { data: products } = await getProducts();

  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <Eyebrow>Выбор покупателей</Eyebrow>
            <h2 className="mt-4 font-display text-5xl font-medium leading-[1.02] tight text-forest md:text-6xl">
              Хиты <em className="font-light italic text-clay">недели</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/catalog"
              className="group flex items-center gap-2 rounded-full border border-forest/20 px-6 py-3.5 text-[12px] font-bold uppercase [0.14em] text-forest transition-colors duration-300 hover:border-forest hover:bg-forest hover:text-cream"
            >
              Весь каталог
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i * 0.05, 0.3)}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

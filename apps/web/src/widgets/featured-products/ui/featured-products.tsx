import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/entities/product";
import { Eyebrow, Reveal } from "@/shared/ui/reveal";

export function FeaturedProducts({
  products = [],
  isLoading = false,
}: {
  products?: any[];
  isLoading?: boolean;
}) {
  return (
    <section className="w-full">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Reveal>
          <Eyebrow>Выбор покупателей</Eyebrow>
          <h2 className="mt-4 font-display text-5xl font-medium leading-[1.02] tracking-tight text-forest md:text-6xl">
            Хиты <em className="font-light italic text-clay">недели</em>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <Link
            href="/products"
            className="group flex items-center gap-2 rounded-full border border-forest/20 px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-forest transition-colors duration-300 hover:border-forest hover:bg-forest hover:text-cream"
          >
            Весь каталог
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>

      {isLoading ? (
        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              aria-hidden="true"
              className="aspect-[4/5] w-full animate-pulse rounded-2xl bg-parchment"
            />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i * 0.05, 0.3)}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      ) : null}
    </section>
  );
}

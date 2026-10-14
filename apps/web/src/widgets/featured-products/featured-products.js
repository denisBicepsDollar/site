'use client'
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {productById} from '@/shared/data/products.js';
import {ProductCard} from '@/entities/product/ui/product-card/product-card.js';
import {Eyebrow, Reveal} from '../reveal/reveal.js';

const featured = [1, 2, 5, 3, 9, 11, 12, 13]
    .map((id) => productById(id))
    .filter(Boolean);

export function FeaturedProducts() {
    return (
        <section className="bg-cream py-24 md:py-32">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <Reveal>
                        <Eyebrow>Выбор покупателей</Eyebrow>
                        <h2 className="mt-4 font-display text-5xl font-medium leading-[1.02] tracking-tight text-forest md:text-6xl">
                            Хиты <em className="font-light italic text-clay">недели</em>
                        </h2>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <Link
                            href="/catalog"
                            className="group flex items-center gap-2 rounded-full border border-forest/20 px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-forest transition-colors duration-300 hover:border-forest hover:bg-forest hover:text-cream"
                        >
                            Весь каталог
                            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1"/>
                        </Link>
                    </Reveal>
                </div>

                <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
                    {featured.map((p, i) => (
                        <Reveal key={p.id} delay={Math.min(i * 0.05, 0.3)}>
                            <ProductCard product={p}/>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

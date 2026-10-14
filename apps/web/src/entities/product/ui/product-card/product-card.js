'use client'
import {useState} from 'react';
import Link from 'next/link';
import {Heart, ShoppingBag} from 'lucide-react';
import {formatPrice} from '@/shared/data/products.js';

const badgeStyle = {
    'Хит': 'bg-clay text-cream',
    'Новинка': 'bg-leaf text-cream',
    'Выгода': 'bg-forest text-cream',
};


export function ProductCard({product}) {
    const [liked, setLiked] = useState(false);

    return (
        <article className="group">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[22px] bg-parchment">
                <Link
                    href={`/product/${product.id}`}
                    aria-label={product.name}
                    className="block h-full w-full"
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                    />
                </Link>

                {product.badge && (
                    <span
                        className={`pointer-events-none absolute left-3.5 top-3.5 z-10 rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] ${badgeStyle[product.badge]}`}
                    >
            {product.badge}
          </span>
                )}

                <button
                    onClick={() => setLiked((v) => !v)}
                    aria-label="В избранное"
                    className={`absolute right-3.5 top-3.5 z-10 grid size-10 place-items-center rounded-full backdrop-blur transition-all duration-300 ${
                        liked
                            ? 'bg-clay text-cream'
                            : 'translate-y-1 bg-cream/85 text-forest opacity-0 hover:bg-cream group-hover:translate-y-0 group-hover:opacity-100 max-lg:translate-y-0 max-lg:opacity-100'
                    }`}
                >
                    <Heart className={`size-[17px] ${liked ? 'fill-current' : ''}`} strokeWidth={1.8}/>
                </button>

                <div
                    className="absolute inset-x-3.5 bottom-3.5 z-10 translate-y-[130%] opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 max-lg:translate-y-0 max-lg:opacity-100">
                    <button
                        onClick={() => add(product.id)}
                        className="flex w-full items-center justify-center gap-2.5 rounded-full bg-forest/95 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-cream backdrop-blur transition-colors duration-300 hover:bg-clay"
                    >
                        <ShoppingBag className="size-4" strokeWidth={2}/>
                        В корзину · {formatPrice(product.price)}
                    </button>
                </div>
            </div>

            <div className="mt-4 flex items-start justify-between gap-3 px-1">
                <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/40">
                        {product.latin}
                    </p>
                    <Link href={`/product/${product.id}`}>
                        <h3 className="mt-1 font-display text-[22px] font-semibold leading-tight text-forest transition-colors hover:text-clay">
                            {product.name}
                        </h3>
                    </Link>
                    <p className="mt-1 text-[11px] font-medium text-ink/45">
                        {product.level} · {product.water}
                    </p>
                </div>
                <div className="pt-5 text-right">
                    <p className="whitespace-nowrap text-[15px] font-bold text-forest">
                        {formatPrice(product.price)}
                    </p>
                    {product.oldPrice && (
                        <p className="text-[12px] font-medium text-ink/35 line-through">
                            {formatPrice(product.oldPrice)}
                        </p>
                    )}
                </div>
            </div>
        </article>
    );
}

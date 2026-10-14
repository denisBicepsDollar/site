import { AnimatePresence, motion } from 'framer-motion';
import { products, type Filter } from '../data/products';
import ProductCard from './ProductCard';
import { Eyebrow, Reveal } from './Reveal';

const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'Все растения' },
    { key: 'indoor', label: 'Комнатные' },
    { key: 'garden', label: 'Садовые' },
];

export default function Shop({
                                 filter,
                                 onFilter,
                             }: {
    filter: Filter;
    onFilter: (f: Filter) => void;
}) {
    const visible = products.filter((p) => filter === 'all' || p.category === filter);

    return (
        <section id="catalog" className="scroll-mt-24 bg-parchment/60 py-24 md:py-32">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="flex flex-wrap items-end justify-between gap-8">
                    <Reveal>
                        <Eyebrow>Каталог</Eyebrow>
                        <h2 className="mt-4 font-display text-5xl font-medium leading-[1.02] tracking-tight text-forest md:text-6xl">
                            Живая <em className="font-light italic text-clay">витрина</em>
                        </h2>
                    </Reveal>

                    <Reveal delay={0.1}>
                        <div className="flex flex-wrap gap-2 rounded-full border border-forest/10 bg-cream p-1.5">
                            {filters.map((f) => {
                                const active = filter === f.key;
                                const count =
                                    f.key === 'all'
                                        ? products.length
                                        : products.filter((p) => p.category === f.key).length;
                                return (
                                    <button
                                        key={f.key}
                                        onClick={() => onFilter(f.key)}
                                        className={`relative rounded-full px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.12em] transition-colors duration-300 ${
                                            active ? 'text-cream' : 'text-ink/55 hover:text-forest'
                                        }`}
                                    >
                                        {active && (
                                            <motion.span
                                                layoutId="filter-pill"
                                                transition={{ type: 'spring', stiffness: 350, damping: 32 }}
                                                className="absolute inset-0 rounded-full bg-forest"
                                            />
                                        )}
                                        <span className="relative">
                      {f.label} <sup className="text-[10px] opacity-70">{count}</sup>
                    </span>
                                    </button>
                                );
                            })}
                        </div>
                    </Reveal>
                </div>

                <motion.div layout className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
                    <AnimatePresence mode="popLayout">
                        {visible.map((p, i) => (
                            <motion.div
                                key={p.id}
                                layout
                                initial={{ opacity: 0, y: 26, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{
                                    duration: 0.45,
                                    delay: Math.min(i * 0.04, 0.3),
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                            >
                                <ProductCard product={p} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                <Reveal delay={0.1} className="mt-16">
                    <div className="flex flex-col items-center gap-4 rounded-[28px] border border-forest/10 bg-cream px-8 py-10 text-center">
                        <p className="font-display text-2xl font-medium text-forest md:text-3xl">
                            Не нашли растение мечты?
                        </p>
                        <p className="max-w-md text-sm leading-relaxed text-ink/60">
                            Привезём под заказ за 7–14 дней: редкие сорта, крупномеры и экзотику
                            из питомников Голландии и Италии.
                        </p>
                        <a
                            href="tel:+74951204567"
                            className="mt-2 rounded-full border border-forest/20 px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-forest transition-colors hover:border-forest hover:bg-forest hover:text-cream"
                        >
                            Заказать растение
                        </a>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

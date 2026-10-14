import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Filter } from '../data/products';
import { Eyebrow, Reveal } from './Reveal';

const cards: {
    key: Filter;
    title: string;
    desc: string;
    count: string;
    tags: string[];
    image: string;
}[] = [
    {
        key: 'indoor',
        title: 'Комнатные',
        desc: 'Зелёные соседи для квартиры, офиса и уютных подоконников — от неприхотливых до коллекционных.',
        count: '8 растений',
        tags: ['Монстера', 'Орхидея', 'Фикус'],
        image:
            'https://images.pexels.com/photos/7836571/pexels-photo-7836571.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    },
    {
        key: 'garden',
        title: 'Садовые',
        desc: 'Гортензии, пионы и другие многолетники для дачи и сада — адаптированы к средней полосе.',
        count: '8 растений',
        tags: ['Гортензия', 'Пион', 'Многолетники'],
        image:
            'https://images.pexels.com/photos/26744998/pexels-photo-26744998.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    },
];

export default function Categories({ onPick }: { onPick: (f: Filter) => void }) {
    return (
        <section id="collections" className="scroll-mt-24 bg-cream py-24 md:py-32">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <Reveal>
                        <Eyebrow>Коллекции</Eyebrow>
                        <h2 className="mt-4 max-w-xl font-display text-5xl font-medium leading-[1.02] tracking-tight text-forest md:text-6xl">
                            Два мира — <em className="font-light italic text-clay">один магазин</em>
                        </h2>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <p className="max-w-sm text-[15px] leading-relaxed text-ink/60">
                            Выбирайте растение под ваш свет, график полива и характер. Остальное мы
                            берём на себя: кашпо, грунт и памятку по уходу — в подарок.
                        </p>
                    </Reveal>
                </div>

                <div className="mt-14 grid gap-6 md:grid-cols-2">
                    {cards.map((c, i) => (
                        <Reveal key={c.key} delay={i * 0.12} className="h-full">
                            <motion.button
                                onClick={() => onPick(c.key)}
                                whileHover="hover"
                                initial="rest"
                                animate="rest"
                                className="group relative block h-[460px] w-full overflow-hidden rounded-[28px] text-left md:h-[560px]"
                            >
                                <motion.img
                                    src={c.image}
                                    alt={c.title}
                                    loading="lazy"
                                    variants={{ rest: { scale: 1 }, hover: { scale: 1.07 } }}
                                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/20 to-forest/5 transition-opacity duration-500" />

                                <span className="absolute left-5 top-5 rounded-full border border-cream/40 bg-forest/30 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-cream backdrop-blur">
                  {c.count}
                </span>

                                <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
                                    <div className="mb-4 flex flex-wrap gap-2">
                                        {c.tags.map((t) => (
                                            <span
                                                key={t}
                                                className="rounded-full bg-cream/15 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-cream/90 backdrop-blur-sm"
                                            >
                        {t}
                      </span>
                                        ))}
                                    </div>
                                    <div className="flex items-end justify-between gap-4">
                                        <div>
                                            <h3 className="font-display text-4xl font-medium text-cream md:text-5xl">
                                                {c.title}
                                            </h3>
                                            <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/75">
                                                {c.desc}
                                            </p>
                                        </div>
                                        <motion.span
                                            variants={{ rest: { rotate: 0 }, hover: { rotate: 45 } }}
                                            transition={{ duration: 0.4 }}
                                            className="grid size-14 shrink-0 place-items-center rounded-full bg-cream text-forest transition-colors duration-300 group-hover:bg-clay group-hover:text-cream"
                                        >
                                            <ArrowUpRight className="size-6" strokeWidth={1.8} />
                                        </motion.span>
                                    </div>
                                </div>
                            </motion.button>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

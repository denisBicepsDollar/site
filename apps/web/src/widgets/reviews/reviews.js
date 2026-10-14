'use client'

import {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {ArrowLeft, ArrowRight, Quote} from 'lucide-react';
import {Eyebrow} from '../reveal/reveal';

const reviewsContent = [
    {
        text: 'Монстера приехала через три часа после заказа — упакована как произведение искусства. За полгода выросла вдвое, а ботаник магазина до сих пор отвечает на мои вопросы в чате.',
        name: 'Марина К.',
        role: 'купила 7 комнатных растений',
    },
    {
        text: 'Брал шесть гортензий для дачи — честно предупредили, какая перезимует, а какую лучше укрыть. Все прижились, этим летом сад цвёл так, что соседи приходили фотографироваться.',
        name: 'Антон В.',
        role: 'садовод со стажем 2 года',
    },
    {
        text: 'Думала, что у меня «тяжёлая рука» и все растения обречены. В «Ботанике» подобрали неприхотливых соседей под мой тёмный коридор — и вот уже год всё живёт и даже цветёт.',
        name: 'Ольга Д.',
        role: 'начинающий плант-парент',
    },
];

export function Reviews() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const t = window.setInterval(() => setIndex((i) => (i + 1) % reviewsContent.length), 7000);
        return () => window.clearInterval(t);
    }, []);

    const go = (dir) =>
        setIndex((i) => (i + dir + reviewsContent.length) % reviewsContent.length);

    return (
        <section id="reviews"
                 className="relative scroll-mt-24 overflow-hidden bg-forest py-24 text-cream md:py-32">
            <Quote
                aria-hidden
                className="pointer-events-none absolute -top-10 left-1/2 size-[300px] -translate-x-1/2 text-cream/[0.04]"
            />
            <span
                aria-hidden
                className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[18vw] font-semibold leading-none text-outline-cream"
            >
        отзывы
      </span>

            <div className="relative mx-auto max-w-4xl px-5 text-center md:px-10">
                <div className="flex justify-center">
                    <Eyebrow light>Говорят клиенты</Eyebrow>
                </div>

                <div className="mt-12 min-h-[240px] md:min-h-[220px]">
                    <AnimatePresence mode="wait">
                        <motion.blockquote
                            key={index}
                            initial={{opacity: 0, y: 24, filter: 'blur(6px)'}}
                            animate={{opacity: 1, y: 0, filter: 'blur(0px)'}}
                            exit={{opacity: 0, y: -24, filter: 'blur(6px)'}}
                            transition={{duration: 0.55, ease: [0.22, 1, 0.36, 1]}}
                        >
                            <p className="font-display text-[26px] font-light italic leading-snug md:text-[38px]">
                                «{reviewsContent[index].text}»
                            </p>
                            <footer className="mt-8">
                                <p className="text-sm font-bold uppercase tracking-[0.18em] text-sage">
                                    {reviewsContent[index].name}
                                </p>
                                <p className="mt-1 text-[12px] font-medium uppercase tracking-[0.14em] text-cream/40">
                                    {reviewsContent[index].role}
                                </p>
                            </footer>
                        </motion.blockquote>
                    </AnimatePresence>
                </div>

                <div className="mt-12 flex items-center justify-center gap-6">
                    <button
                        onClick={() => go(-1)}
                        aria-label="Предыдущий отзыв"
                        className="grid size-12 place-items-center rounded-full border border-cream/20 transition-colors hover:bg-cream hover:text-forest"
                    >
                        <ArrowLeft className="size-5" strokeWidth={1.7}/>
                    </button>
                    <div className="flex gap-2.5">
                        {reviewsContent.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                aria-label={`Отзыв ${i + 1}`}
                                className={`h-1.5 rounded-full transition-all duration-400 ${
                                    i === index ? 'w-8 bg-clay' : 'w-2.5 bg-cream/25 hover:bg-cream/50'
                                }`}
                            />
                        ))}
                    </div>
                    <button
                        onClick={() => go(1)}
                        aria-label="Следующий отзыв"
                        className="grid size-12 place-items-center rounded-full border border-cream/20 transition-colors hover:bg-cream hover:text-forest"
                    >
                        <ArrowRight className="size-5" strokeWidth={1.7}/>
                    </button>
                </div>
            </div>
        </section>
    );
}

'use client'

import {useRef} from 'react';
import Link from 'next/link';
import {motion, useScroll, useTransform} from 'framer-motion';
import {ArrowDown, ArrowUpRight, Sprout} from 'lucide-react';
import {Header} from "@/widgets/header/ui/header";

const HERO_IMG = '/default-image.png'

export function Hero() {
    const ref = useRef(null);
    const {scrollYProgress} = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });
    const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
    const bgWordY = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);

    return (
        <section
            ref={ref}
            id="top"
            className="relative overflow-hidden bg-cream pt-[120px] md:pt-[140px]"
        >
            {/* водяной знак */}
            <motion.span
                style={{y: bgWordY}}
                aria-hidden
                className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[22vw] font-semibold leading-none text-outline"
            >
                Zelenye usy
            </motion.span>

            <div
                className="relative mx-auto grid max-w-[1400px] items-center gap-14 px-5 pb-20 md:px-10 lg:grid-cols-12 lg:gap-8 lg:pb-28">
                {/* текст */}
                <div className="lg:col-span-7">
                    <motion.div
                        initial={{opacity: 0, y: 16}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.7, delay: 0.05}}
                        className="flex items-center gap-3"
                    >
                        <span className="h-px w-12 bg-clay"/>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-leaf">
                          Магазин комнатных и садовых растений
                        </span>
                    </motion.div>

                    <h1 className="mt-7 font-display text-[clamp(3.4rem,9.5vw,8rem)] font-medium leading-[0.92] tracking-tight text-forest">
                        {['Подарок,', 'знакомства'].map((t, i) => (
                            <span key={t} className="block overflow-hidden pb-1">
                <motion.span
                    className="block"
                    initial={{y: '110%'}}
                    animate={{y: 0}}
                    transition={{duration: 0.9, delay: 0.15 + i * 0.13, ease: [0.22, 1, 0.36, 1]}}
                >
                  {t}
                </motion.span>
              </span>
                        ))}
                        <span className="block overflow-hidden pb-2">
              <motion.span
                  className="block"
                  initial={{y: '110%'}}
                  animate={{y: 0}}
                  transition={{duration: 0.9, delay: 0.41, ease: [0.22, 1, 0.36, 1]}}
              >
                — <em className="font-light italic text-clay">низкая цена</em>
              </motion.span>
            </span>
                    </h1>

                    <motion.p
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8, delay: 0.6}}
                        className="mt-7 max-w-md text-[15px] leading-relaxed text-ink/65 md:text-base"
                    >
                        Комнатные растения, садовые культуры и всё для ухода. Поможем выбрать,
                        привезём за три часа и научим заботиться — бесплатно и навсегда.
                    </motion.p>

                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8, delay: 0.72}}
                        className="mt-9 flex flex-wrap items-center gap-4"
                    >
                        <Link
                            href="/catalog"
                            className="group flex items-center gap-3 rounded-full bg-forest py-4 pl-7 pr-3 text-sm font-semibold uppercase tracking-[0.12em] text-cream transition-colors duration-300 hover:bg-clay"
                        >
                            Смотреть каталог
                            <span
                                className="grid size-9 place-items-center rounded-full bg-cream/15 transition-transform duration-300 group-hover:translate-y-1">
                <ArrowDown className="size-4"/>
              </span>
                        </Link>
                        <Link
                            href="/#about"
                            className="group flex items-center gap-2 rounded-full border border-forest/20 px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-forest transition-colors duration-300 hover:border-forest hover:bg-forest hover:text-cream"
                        >
                            О магазине
                            <ArrowUpRight
                                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 1, delay: 0.9}}
                        className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-forest/10 pt-7"
                    >
                        {
                            [
                                ['500+', 'видов в наличии'],
                                ['12 лет', 'выращиваем сами'],
                                ['98%', 'довольных клиентов'],
                            ].map(([n, l]) => (
                                <div key={l}>
                                    <p className="font-display text-3xl font-semibold text-forest md:text-4xl">{n}</p>
                                    <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-ink/45">
                                        {l}
                                    </p>
                                </div>
                            ))
                        }
                    </motion.div>
                </div>

                {/* изображение */}
                <div className="relative lg:col-span-5">
                    <motion.div
                        initial={{opacity: 0, y: 40, scale: 0.97}}
                        animate={{opacity: 1, y: 0, scale: 1}}
                        transition={{duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1]}}
                        className="relative mx-auto aspect-[3/4] w-full max-w-[440px] overflow-hidden rounded-b-[28px] rounded-t-[999px] shadow-[0_60px_80px_-50px_rgba(20,38,27,0.55)]"
                    >
                        <motion.img
                            src={HERO_IMG}
                            alt="Гостиная с монстерами в кашпо"
                            style={{y: imgY, scale: 1.18}}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    </motion.div>

                    {/* вращающаяся печать */}
                    <motion.div
                        initial={{opacity: 0, scale: 0.5}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 0.7, delay: 1, type: 'spring', stiffness: 120}}
                        className="absolute -bottom-7 left-2 grid size-32 place-items-center rounded-full bg-clay text-cream shadow-xl md:left-6 lg:-left-8"
                    >
                        <svg viewBox="0 0 100 100" className="absolute inset-0 animate-rotate-slow">
                            <defs>
                                <path id="circlePath" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0"/>
                            </defs>
                            <text className="fill-cream text-[8.2px] font-semibold uppercase"
                                  style={{letterSpacing: '2.6px'}}>
                                <textPath href="#circlePath">комнатные и садовые растения</textPath>
                            </text>
                        </svg>
                        <Sprout className="size-8" strokeWidth={1.6}/>
                    </motion.div>

                    {/* плавающая карточка */}
                    <Link href="/product/1" className="absolute right-0 top-10 z-10 hidden md:block lg:-right-4">
                        <motion.div
                            initial={{opacity: 0, x: 30}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 0.8, delay: 1.15}}
                            className="animate-float rounded-2xl border border-forest/10 bg-cream/90 px-5 py-4 shadow-lg backdrop-blur transition-colors duration-300 hover:border-clay/50"
                        >
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-leaf">Хит
                                недели</p>
                            <p className="mt-1 font-display text-xl font-semibold text-forest">Монстера · 3 490
                                ₽</p>
                        </motion.div>
                    </Link>
                </div>
            </div>

            {/* вертикальная подпись */}
            {/*      <span*/}
            {/*          className="vertical-rl absolute right-6 top-1/2 hidden -translate-y-1/2 text-[10px] font-semibold uppercase tracking-[0.4em] text-forest/35 xl:block">*/}
            {/*  с любовью к зелени — эст. 2013*/}
            {/*</span>*/}
        </section>
    );
}

'use client'
import {useEffect, useRef, useState} from 'react';
import {animate, useInView} from 'framer-motion';
import {MessageCircleHeart, ShieldCheck, Sprout, Truck} from 'lucide-react';
import {Eyebrow, Reveal} from '../../reveal/reveal';

function Counter({to, suffix = ''}) {
    const ref = useRef(null);
    const inView = useInView(ref, {once: true, margin: '-60px'});
    const [val, setVal] = useState(0);

    useEffect(() => {
        if (!inView) return;
        const controls = animate(0, to, {
            duration: 1.8,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (v) => setVal(Math.round(v)),
        });
        return () => controls.stop();
    }, [inView, to]);

    return (
        <span ref={ref}>
      {new Intl.NumberFormat('ru-RU').format(val)}
            {suffix}
    </span>
    );
}

const benefits = [
    {
        icon: Truck,
        title: 'Доставка за 3 часа',
        text: 'По Москве — в день заказа, в аккуратной эко-упаковке с утеплением зимой.',
    },
    {
        icon: ShieldCheck,
        title: 'Гарантия 30 дней',
        text: 'Если растение не прижилось — заменим или вернём деньги. Без вопросов.',
    },
    {
        icon: MessageCircleHeart,
        title: 'Ботаник на связи',
        text: 'Консультируем по уходу бессрочно: пришлите фото листа — скажем, что делать.',
    },
    {
        icon: Sprout,
        title: 'Своя оранжерея',
        text: 'Большинство растений выращиваем сами, поэтому они здоровы и адаптированы.',
    },
];

export function About() {
    return (
        <section id="about" className="scroll-mt-24 overflow-hidden bg-cream py-24 md:py-32">
            <div className="mx-auto grid max-w-[1400px] items-center gap-16 px-5 md:px-10 lg:grid-cols-2">
                {/* коллаж */}
                <div className="relative">
                    <Reveal className="relative z-10 w-[72%]">
                        <div className="overflow-hidden rounded-[28px] shadow-[0_50px_70px_-45px_rgba(20,38,27,0.5)]">
                            <img
                                src="https://images.pexels.com/photos/13105318/pexels-photo-13105318.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                                alt="Уютный интерьер с комнатными растениями"
                                loading="lazy"
                                className="aspect-[3/4] w-full object-cover"
                            />
                        </div>
                    </Reveal>
                    <Reveal delay={0.2} className="absolute -bottom-14 right-0 z-20 w-[52%]">
                        <div
                            className="overflow-hidden rounded-[28px] border-[6px] border-cream shadow-[0_40px_60px_-40px_rgba(20,38,27,0.5)]">
                            <img
                                src="https://images.pexels.com/photos/18286233/pexels-photo-18286233.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                                alt="Фиолетовая гортензия крупным планом"
                                loading="lazy"
                                className="aspect-[4/5] w-full object-cover"
                            />
                        </div>
                    </Reveal>
                    <div
                        className="absolute -top-8 right-8 z-0 grid size-36 animate-float place-items-center rounded-full bg-forest text-cream">
                        <div className="text-center">
                            <p className="font-display text-4xl font-semibold leading-none">12</p>
                            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-cream/70">
                                лет
                                <br/>
                                с вами
                            </p>
                        </div>
                    </div>
                </div>

                {/* текст */}
                <div className="pt-10 lg:pt-0">
                    <Reveal>
                        <Eyebrow>О магазине</Eyebrow>
                        <h2 className="mt-4 font-display text-5xl font-medium leading-[1.04] tracking-tight text-forest md:text-6xl">
                            Больше, чем просто{' '}
                            <em className="font-light italic text-clay">магазин растений</em>
                        </h2>
                        <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink/65">
                            «Ботаника» началась с маленькой оранжереи на крыше дома на Лесной.
                            Сегодня у нас 500+ видов растений, собственный питомник и команда
                            ботаников, которая лечит, пересаживает и подбирает зелень под ваш
                            свет и ритм жизни.
                        </p>
                    </Reveal>

                    <div className="mt-10 grid gap-3 sm:grid-cols-2">
                        {benefits.map((b, i) => (
                            <Reveal key={b.title} delay={0.08 * i}>
                                <div
                                    className="group h-full rounded-2xl border border-forest/10 bg-parchment/50 p-5 transition-colors duration-300 hover:border-forest/20 hover:bg-parchment">
                  <span
                      className="grid size-11 place-items-center rounded-xl bg-forest text-cream transition-colors duration-300 group-hover:bg-clay">
                    <b.icon className="size-5" strokeWidth={1.7}/>
                  </span>
                                    <h3 className="mt-4 font-display text-[21px] font-semibold text-forest">
                                        {b.title}
                                    </h3>
                                    <p className="mt-1.5 text-[13px] leading-relaxed text-ink/60">{b.text}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    <Reveal delay={0.2}>
                        <div className="mt-10 grid grid-cols-3 gap-6 border-t border-forest/10 pt-8">
                            {[
                                {to: 500, suffix: '+', label: 'видов растений'},
                                {to: 38, suffix: ' тыс.', label: 'растений нашли дом'},
                                {to: 260, suffix: '+', label: 'сортов под заказ'},
                            ].map((s) => (
                                <div key={s.label}>
                                    <p className="font-display text-3xl font-semibold text-forest md:text-[40px]">
                                        <Counter to={s.to} suffix={s.suffix}/>
                                    </p>
                                    <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-ink/45">
                                        {s.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

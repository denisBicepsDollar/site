'use client'

import {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Plus} from 'lucide-react';
import {Eyebrow, Reveal} from '../reveal/reveal.js';

const items = [
    {
        title: 'Полив',
        chips: ['Летом чаще', 'Отстоянная вода'],
        text: 'Главное правило — лучше недолить, чем перелить. Проверяйте грунт пальцем на 2–3 см: если сухо, пора поливать. Суккуленты и сансевиерии пьют пару раз в месяц, гортензии — почти каждый день в жару.',
    },
    {
        title: 'Освещение',
        chips: ['Восточные окна', 'Рассеянный свет'],
        text: 'Большинству комнатных растений идеален яркий рассеянный свет. Прямое полуденное солнце оставляет ожоги на листьях монстеры и орхидей, а вот пионы и гортензии в саду любят солнечное утро.',
    },
    {
        title: 'Пересадка',
        chips: ['Весна', '+2 см к горшку'],
        text: 'Пересаживайте молодые растения раз в год, взрослые — раз в 2–3 года. Новый горшок должен быть всего на пару сантиметров шире. В нашем магазине пересадим бесплатно при покупке кашпо и грунта.',
    },
    {
        title: 'Подкормка',
        chips: ['Март — октябрь', '2 раза в месяц'],
        text: 'В сезон роста подкармливайте растения дважды в месяц, зимой давайте отдых. Для цветущих садовых — удобрения с калием, для декоративно-лиственных — с азотом. Подробную схему соберёт наш ботаник.',
    },
];

export function Blog() {
    const [open, setOpen] = useState(0);

    return (
        <section id="care" className="scroll-mt-24 bg-parchment/60 py-24 md:py-32">
            <div className="mx-auto grid max-w-[1400px] gap-14 px-5 md:px-10 lg:grid-cols-2 lg:gap-20">
                <div className="lg:sticky lg:top-28 lg:self-start">
                    <Reveal>
                        <Eyebrow>Уход за растениями</Eyebrow>
                        <h2 className="mt-4 font-display text-5xl font-medium leading-[1.04] tracking-tight text-forest md:text-6xl">
                            Заботиться <em className="font-light italic text-clay">проще</em>, чем
                            кажется
                        </h2>
                        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/65">
                            Собрали четыре базовых правила, которые отвечают на 90% вопросов.
                            Остальные 10% — к нам в чат, там работают живые ботаники.
                        </p>
                    </Reveal>
                    <Reveal delay={0.15} className="mt-10">
                        <div className="relative overflow-hidden rounded-[28px]">
                            <img
                                src="https://images.pexels.com/photos/13732118/pexels-photo-13732118.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                                alt="Полка с зелёными комнатными растениями"
                                loading="lazy"
                                className="aspect-[16/10] w-full object-cover"
                            />
                            <div
                                className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-forest/80 to-transparent p-6">
                                <p className="font-display text-2xl font-medium text-cream">
                                    Памятка по уходу — в подарок к каждому растению
                                </p>
                            </div>
                        </div>
                    </Reveal>
                </div>

                <div>
                    {items.map((it, i) => {
                        const isOpen = open === i;
                        return (
                            <Reveal key={it.title} delay={i * 0.06}>
                                <div
                                    className={`border-b border-forest/10 ${i === 0 ? 'border-t' : ''}`}
                                >
                                    <button
                                        onClick={() => setOpen(isOpen ? -1 : i)}
                                        className="group flex w-full items-center gap-6 py-7 text-left"
                                    >
                    <span
                        className={`font-display text-lg font-medium transition-colors duration-300 ${
                            isOpen ? 'text-clay' : 'text-ink/30'
                        }`}
                    >
                      0{i + 1}
                    </span>
                                        <span
                                            className={`flex-1 font-display text-3xl font-medium transition-colors duration-300 md:text-4xl ${
                                                isOpen ? 'text-forest' : 'text-ink/55 group-hover:text-forest'
                                            }`}
                                        >
                      {it.title}
                    </span>
                                        <motion.span
                                            animate={{rotate: isOpen ? 45 : 0}}
                                            transition={{duration: 0.35}}
                                            className={`grid size-11 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                                                isOpen
                                                    ? 'border-clay bg-clay text-cream'
                                                    : 'border-forest/15 text-forest group-hover:border-forest'
                                            }`}
                                        >
                                            <Plus className="size-5" strokeWidth={1.8}/>
                                        </motion.span>
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{height: 0, opacity: 0}}
                                                animate={{height: 'auto', opacity: 1}}
                                                exit={{height: 0, opacity: 0}}
                                                transition={{duration: 0.45, ease: [0.22, 1, 0.36, 1]}}
                                                className="overflow-hidden"
                                            >
                                                <div className="pb-8 pl-14 pr-4 md:pl-16">
                                                    <p className="max-w-xl text-[15px] leading-relaxed text-ink/65">
                                                        {it.text}
                                                    </p>
                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                        {it.chips.map((c) => (
                                                            <span
                                                                key={c}
                                                                className="rounded-full bg-leaf/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-leaf"
                                                            >
                                {c}
                              </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

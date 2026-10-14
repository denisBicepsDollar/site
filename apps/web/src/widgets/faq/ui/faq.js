/* ───────────────────── FAQ ───────────────────── */
'use client'
import {Reveal} from "@/widgets/reveal/reveal";
import {useState} from "react";
import {Eyebrow} from "../../reveal/reveal";
import {AnimatePresence, motion} from "framer-motion";
import {ChevronDown} from "lucide-react";
import {cn} from "../../../shared/lib/utils";


const FAQ = [
    {
        q: "Пришлёте фото букета перед доставкой?",
        a: "Да, всегда. Флорист собирает букет, фотографирует его при дневном свете и отправляет вам в WhatsApp. Если что-то не нравится — скорректируем бесплатно.",
    },
    {
        q: "Можно ли отправить букет анонимно?",
        a: "Конечно. Просто отметьте это при оформлении: получатель узнает о букете только от курьера, а ваше имя останется тайной. Открытку подпишем так, как вы попросите.",
    },
    {
        q: "Что будет, если цветы быстро завянут?",
        a: "Даём гарантию свежести 7 дней. Если букет потеряет вид раньше — пришлите фото, и мы заменим его на новый или вернём деньги в день обращения.",
    },
    {
        q: "Вы доставляете за МКАД?",
        a: "Да, до 25 км от МКАД — от 600 ₽, время доставки 2–3 часа. Позвоните или напишите нам, и менеджер рассчитает точную стоимость для вашего адреса.",
    },
];

export function Faq() {
    const [open, setOpen] = useState(0);
    return (
        <section className="mx-auto max-w-4xl px-5 pb-24 lg:px-8">
            <Reveal className="text-center">
                <Eyebrow>Вопросы</Eyebrow>
                <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] md:text-5xl">
                    Всё, что спрашивают <em className="italic text-clay">чаще всего</em>
                </h2>
            </Reveal>

            <div className="mt-12">
                {FAQ.map((f, i) => {
                    const isOpen = open === i;
                    return (
                        <Reveal key={f.q} delay={i * 0.05}>
                            <div className="border-b border-line">
                                <button
                                    onClick={() => setOpen(isOpen ? -1 : i)}
                                    className="flex w-full items-center justify-between gap-6 py-6 text-left cursor-pointer"
                                >
                  <span
                      className={cn("font-display text-xl font-medium transition-colors md:text-2xl", isOpen && "text-clay")}>
                    {f.q}
                  </span>
                                    <span
                                        className={cn(
                                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                                            isOpen ? "rotate-180 border-clay bg-clay text-cream" : "border-ink/15"
                                        )}
                                    >
                    <ChevronDown className="h-4 w-4"/>
                  </span>
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{height: 0, opacity: 0}}
                                            animate={{height: "auto", opacity: 1}}
                                            exit={{height: 0, opacity: 0}}
                                            transition={{duration: 0.45, ease: [0.22, 1, 0.36, 1]}}
                                            className="overflow-hidden"
                                        >
                                            <p className="max-w-2xl pb-7 text-[15px] leading-relaxed text-ink/60">{f.a}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}

/* ───────────────────── FAQ ───────────────────── */
"use client";
import { Eyebrow, Reveal } from "@/shared/ui/reveal";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/siteplane/system/utils/cn";

const FAQ = [
  {
    q: "Как вы упаковываете растения перед отправкой?",
    a: "Каждое комнатное и садовое растение фиксируем в плотной коробке: надёжно закрепляем горшок и корневую систему, а побеги и листья оборачиваем защитным материалом. В прохладное время года дополнительно утепляем посылку, чтобы растения спокойно перенесли дорогу.",
  },
  {
    q: "Пришлёте фото растения перед отправкой?",
    a: "Да, обязательно. Перед упаковкой мы фотографируем именно тот экземпляр, который отправится к вам, чтобы вы заранее оценили крону, листья и размер горшка.",
  },
  {
    q: "Как осуществляется доставка и есть ли самовывоз?",
    a: "Забрать заказ самостоятельно можно в городе Новозыбков (Брянская область). По всей России отправляем Почтой России (в отделение или курьером, обычным отправлением или 1 классом) и транспортной компанией СДЭК. Доступные варианты и расчёт доставки можно выбрать при оформлении заказа.",
  },
  {
    q: "Как и когда происходит оплата заказа?",
    a: "Оплата происходит после подтверждения заказа. После оформления мы проверим наличие растений, уточним детали доставки и отправим подтверждение и данные для оплаты на указанную электронную почту.",
  },
];

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="w-full scroll-mt-28">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>Вопросы</Eyebrow>
          <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] text-forest md:text-5xl">
            Всё, что спрашивают <em className="italic text-clay">чаще всего</em>
          </h2>
        </Reveal>

        <div className="lg:col-span-8">
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.05}>
                <div className="border-b border-forest/15">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left"
                  >
                    <span
                      className={cn(
                        "font-display text-xl font-medium transition-colors md:text-2xl",
                        isOpen && "text-clay",
                      )}
                    >
                      {f.q}
                    </span>
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                        isOpen
                          ? "rotate-180 border-clay bg-clay text-cream"
                          : "border-ink/15",
                      )}
                    >
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.45,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-7 text-[15px] leading-relaxed text-ink/60">
                          {f.a}
                        </p>
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

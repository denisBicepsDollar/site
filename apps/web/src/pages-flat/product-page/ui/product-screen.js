'use client';
import {useEffect, useState, ReactNode, use} from 'react';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {AnimatePresence, motion} from 'framer-motion';
import {
    ChevronRight,
    Droplets,
    Leaf,
    Minus,
    Plus,
    RotateCcw,
    ShieldCheck,
    ShoppingBag,
    Sprout,
    Sun,
    Truck,
} from 'lucide-react';
import {categoryLabel, formatPrice, productById, products} from '@/shared/data/products';
import {Eyebrow, Reveal} from '@/widgets/reveal/reveal';
import {ProductCard} from "@/entities/product/ui/product-card/product-card";
import {Reviews1} from "@/pages-flat/product-page/ui/reviews1";

function AccordionItem({
                           title,
                           defaultOpen = false,
                           children,
                       }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-forest/10 first:border-t">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
                <span className="font-display text-[26px] font-medium text-forest">{title}</span>
                <motion.span
                    animate={{rotate: open ? 45 : 0}}
                    transition={{duration: 0.3}}
                    className={`grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                        open ? 'border-clay bg-clay text-cream' : 'border-forest/15 text-forest'
                    }`}
                >
                    <Plus className="size-4" strokeWidth={2}/>
                </motion.span>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{height: 0, opacity: 0}}
                        animate={{height: 'auto', opacity: 1}}
                        exit={{height: 0, opacity: 0}}
                        transition={{duration: 0.4, ease: [0.22, 1, 0.36, 1]}}
                        className="overflow-hidden"
                    >
                        <div className="pb-6 pr-4">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function ProductScreen({paramsPromise}) {
    // Ждем разрешения Promise прямо здесь.
    // Название переменной внутри деструктуризации ('slug') должно строго
    // совпадать с названием вашей папки [slug]
    const {slug} = use(paramsPromise);

    // Теперь slug доступен, и код идет дальше без ошибок
    const product = productById(Number(slug));
    const [qty, setQty] = useState(1);

    if (!product) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 pt-28 text-center">
        <span className="grid size-20 place-items-center rounded-full bg-parchment text-leaf">
          <Leaf className="size-9" strokeWidth={1.5}/>
        </span>
                <h1 className="mt-6 font-display text-4xl font-semibold text-forest md:text-5xl">
                    Такого растения у нас нет
                </h1>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/60">
                    Возможно, его уже купили или оно ещё растёт в оранжерее. Загляните в каталог —
                    там много других красавцев.
                </p>
                <Link
                    href="/catalog"
                    className="mt-8 rounded-full bg-forest px-8 py-4 text-[12px] font-bold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-clay"
                >
                    В каталог
                </Link>
            </main>
        );
    }

    const related = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const attrs = [
        {icon: Sun, label: 'Свет', value: product.light},
        {icon: Droplets, label: 'Полив', value: product.water},
        {icon: Sprout, label: 'Сложность', value: product.level},
    ];

    return (
        <main className="bg-cream pb-24 pt-[120px] md:pt-[140px]">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <nav
                    className="flex flex-wrap items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/40">
                    <Link href="/" className="transition-colors hover:text-forest">
                        Главная
                    </Link>
                    <ChevronRight className="size-3.5"/>
                    <Link href="/catalog" className="transition-colors hover:text-forest">
                        Каталог
                    </Link>
                    <ChevronRight className="size-3.5"/>
                    <Link
                        href={`/catalog?cat=${product.category}`}
                        className="transition-colors hover:text-forest"
                    >
                        {categoryLabel[product.category]}
                    </Link>
                    <ChevronRight className="size-3.5"/>
                    <span className="text-forest">{product.name}</span>
                </nav>


                <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* фото */}
                    <Reveal className="lg:sticky lg:top-32 lg:self-start">
                        <div
                            className="relative overflow-hidden rounded-[28px] bg-parchment shadow-[0_60px_80px_-55px_rgba(20,38,27,0.5)]">
                            <motion.img
                                key={product.id}
                                src={product.image}
                                alt={product.name}
                                initial={{opacity: 0, scale: 1.04}}
                                animate={{opacity: 1, scale: 1}}
                                transition={{duration: 0.7, ease: [0.22, 1, 0.36, 1]}}
                                className="aspect-[3/4] w-full object-cover"
                            />
                            {product.badge && (
                                <span
                                    className="absolute left-5 top-5 rounded-full bg-clay px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-cream">
                  {product.badge}
                </span>
                            )}
                        </div>
                    </Reveal>

                    {/* описание */}
                    <motion.div
                        key={`info-${product.id}`}
                        initial={{opacity: 0, y: 24}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1]}}
                    >
                        <Eyebrow>{categoryLabel[product.category]} растения</Eyebrow>
                        <h1 className="mt-4 font-display text-5xl font-medium leading-[1.02] tracking-tight text-forest md:text-6xl">
                            {product.name}
                        </h1>
                        <p className="mt-3 font-display text-2xl font-light italic text-ink/40">
                            {product.latin}
                        </p>

                        <div className="mt-6 flex items-baseline gap-4">
              <span className="font-display text-4xl font-semibold text-forest">
                {formatPrice(product.price)}
              </span>
                            {product.oldPrice && (
                                <span className="text-lg font-medium text-ink/35 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
                            )}
                            <span
                                className="rounded-full bg-leaf/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-leaf">
                В наличии
              </span>
                        </div>

                        <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink/65">
                            {product.desc}
                        </p>

                        <div className="mt-8 grid grid-cols-3 gap-3">
                            {attrs.map((a) => (
                                <div
                                    key={a.label}
                                    className="rounded-2xl border border-forest/10 bg-parchment/60 p-4"
                                >
                                    <a.icon className="size-5 text-clay" strokeWidth={1.7}/>
                                    <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-ink/40">
                                        {a.label}
                                    </p>
                                    <p className="mt-1 text-[13px] font-semibold leading-snug text-forest">
                                        {a.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-9 flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-4 rounded-full border border-forest/15 px-3 py-3">
                                <button
                                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                                    aria-label="Меньше"
                                    className="grid size-7 place-items-center text-ink/60 transition-colors hover:text-forest"
                                >
                                    <Minus className="size-4" strokeWidth={2.2}/>
                                </button>
                                <span className="min-w-6 text-center text-base font-bold">{qty}</span>
                                <button
                                    onClick={() => setQty((q) => q + 1)}
                                    aria-label="Больше"
                                    className="grid size-7 place-items-center text-ink/60 transition-colors hover:text-forest"
                                >
                                    <Plus className="size-4" strokeWidth={2.2}/>
                                </button>
                            </div>
                            <button
                                onClick={() => add(product.id, qty)}
                                className="flex min-w-[240px] flex-1 items-center justify-center gap-2.5 rounded-full bg-forest py-4 text-[13px] font-bold uppercase tracking-[0.14em] text-cream transition-colors duration-300 hover:bg-clay"
                            >
                                <ShoppingBag className="size-4" strokeWidth={2}/>
                                В корзину · {formatPrice(product.price * qty)}
                            </button>
                        </div>
                        <button
                            onClick={() => {
                                add(product.id, qty);
                                openCart();
                            }}
                            className="mt-4 text-[12px] font-bold uppercase tracking-[0.14em] text-leaf underline-offset-4 transition-colors hover:text-clay hover:underline"
                        >
                            Купить в один клик
                        </button>

                        <div className="mt-10">
                            <AccordionItem title="Описание" defaultOpen>
                                <p className="text-[15px] leading-relaxed text-ink/65">{product.desc}</p>
                                <p className="mt-3 text-[15px] leading-relaxed text-ink/65">
                                    Растение приезжает в транспортировочном горшке со здоровой корневой
                                    системой. Кашпо, грунт и дренаж подберём под него бесплатно.
                                </p>
                            </AccordionItem>
                            <AccordionItem title="Уход">
                                <ul className="space-y-2.5 text-[15px] leading-relaxed text-ink/65">
                                    <li>· Свет: {product.light.toLowerCase()}</li>
                                    <li>· Вода: {product.water.toLowerCase()}</li>
                                    <li>· Уровень: {product.level.toLowerCase()}</li>
                                </ul>
                                <p className="mt-3 text-[15px] leading-relaxed text-ink/65">
                                    Памятка по уходу прилагается к каждому растению, а наш ботаник
                                    остаётся на связи после покупки — пришлите фото листа, подскажем.
                                </p>
                            </AccordionItem>
                            <AccordionItem title="Доставка и гарантия">
                                <ul className="space-y-4">
                                    {[
                                        {
                                            icon: Truck,
                                            text: 'Доставка по Москве за 3 часа, бесплатно при заказе от 3 000 ₽',
                                        },
                                        {
                                            icon: ShieldCheck,
                                            text: 'Гарантия приживаемости 30 дней на все растения',
                                        },
                                        {
                                            icon: RotateCcw,
                                            text: 'Вернём деньги или заменим растение, если что-то пошло не так',
                                        },
                                    ].map((r) => (
                                        <li key={r.text} className="flex items-start gap-3 text-[15px] text-ink/65">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-forest text-cream">
                        <r.icon className="size-4" strokeWidth={1.8}/>
                      </span>
                                            <span className="pt-1.5">{r.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </AccordionItem>
                        </div>
                    </motion.div>
                </div>

                <Reviews1/>
                {/* похожие */}
                <section className="mt-24 border-t border-forest/10 pt-16">
                    <Reveal>
                        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                            <h2 className="font-display text-4xl font-medium text-forest md:text-5xl">
                                Похожие <em className="font-light italic text-clay">растения</em>
                            </h2>
                            <Link
                                href={`/catalog?cat=${product.category}`}
                                className="text-[12px] font-bold uppercase tracking-[0.14em] text-leaf underline-offset-4 transition-colors hover:text-clay hover:underline"
                            >
                                Все {categoryLabel[product.category].toLowerCase()}
                            </Link>
                        </div>
                    </Reveal>
                    <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
                        {related.map((p, i) => (
                            <Reveal key={p.id} delay={i * 0.06}>
                                <ProductCard product={p}/>
                            </Reveal>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}

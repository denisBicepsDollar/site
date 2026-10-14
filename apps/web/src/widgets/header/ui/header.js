'use client'

import Link from 'next/link'
import {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Leaf, Menu, Phone, ShoppingBag, X} from 'lucide-react';
import {ShoppingCart1} from "../../../pages-flat/cart/shopping-cart1";

const nav = [
    {label: 'Главная', to: '/'},
    {label: 'Каталог', to: '/products'},
    {label: 'О магазине', to: '/about'},
    {label: 'Блог', to: '/blog'},
];

export function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    // ИСПРАВЛЕНИЕ 1: Флаг монтирования компонента на клиенте
    const [isMounted, setIsMounted] = useState(false);

    const pathname = '/';

    useEffect(() => {
        setIsMounted(true); // Компонент успешно загрузился в браузере
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    return (
        <>
            <header className="fixed inset-x-0 top-0 z-40">
                <div
                    className={`transition-all duration-500 ${
                        scrolled
                            ? 'border-b border-forest/10 bg-cream/90 shadow-[0_10px_40px_-20px_rgba(20,38,27,0.35)] backdrop-blur-xl'
                            : 'bg-transparent'
                    }`}
                >
                    <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 md:px-10">
                        <Link href="/" className="group flex items-center gap-2.5">
                            <span
                                className="grid size-10 place-items-center rounded-full bg-forest text-cream 
                                           transition-transform duration-500 group-hover:rotate-[20deg]">
                                <Leaf className="size-5" strokeWidth={1.8}/>
                            </span>
                            <span className="font-display text-[26px] font-semibold leading-none tracking-tight">
                                Зеленые усы
                            </span>
                        </Link>

                        <nav className="hidden items-center gap-8 lg:flex">
                            {nav.map((n) => {
                                const active = pathname === n.to;
                                return (
                                    <Link
                                        key={n.to}
                                        href={n.to}
                                        className={`group relative text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors hover:text-forest ${
                                            active ? 'text-forest' : 'text-ink/70'
                                        }`}
                                    >
                                        {n.label}
                                        <span
                                            className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-clay transition-transform duration-300 ${
                                                active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                            }`}
                                        />
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="flex items-center gap-3 md:gap-5">
                            <a
                                href="contact"
                                className="hidden items-center gap-2 text-[13px] font-semibold text-ink/70 transition-colors hover:text-forest xl:flex"
                            >
                                <Phone className="size-4 " strokeWidth={1.8}/>
                                Связаться
                                +7 (495) 120-45-67
                            </a>

                            {/* ИСПРАВЛЕНИЕ 3: Выпрямили строку className для ссылки корзины */}
                            <Link
                                href='/cart'
                                className="group relative flex items-center gap-2.5 rounded-full bg-forest px-4
               py-2.5 text-cream transition-colors duration-300 hover:bg-clay md:px-5"
                            >
                                <ShoppingBag className="size-[18px]" strokeWidth={1.8}/>
                                <span className="hidden text-[13px] font-semibold uppercase tracking-[0.12em] sm:block">
      Корзина
    </span>

                                {/* 1. Обёртка-контейнер для плавности и удержания hover */}
                                <div className="absolute top-full right-0 pt-3 z-50
                    opacity-0 pointer-events-none translate-y-2
                    transition-all duration-300 ease-out
                    group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0">

                                    {/* 2. Реальный блок с вашим контентом */}
                                    <div className="bg-white p-4 text-black shadow-lg rounded-lg min-w-[280px]">
                                        <ShoppingCart1/>
                                    </div>
                                </div>


                                {/* ИСПРАВЛЕНИЕ 4: Рендерим бейдж с числом 10 ТОЛЬКО после того, как клиент ожил,
                                    чтобы серверный пустой HTML не конфликтовал с браузерным стейтом */}
                                <AnimatePresence mode="popLayout">
                                    {isMounted && (
                                        <motion.span
                                            initial={{scale: 0.4, opacity: 0}}
                                            animate={{scale: 1, opacity: 1}}
                                            exit={{scale: 0.4, opacity: 0}}
                                            transition={{type: 'spring', stiffness: 500, damping: 22}}
                                            className="grid size-[22px] place-items-center rounded-full bg-clay text-[11px] font-bold transition-colors group-hover:bg-cream group-hover:text-forest"
                                        >
                                            10
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* mobile menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.35}}
                        className="fixed inset-0 z-[60] flex flex-col bg-forest text-cream"
                    >
                        <div className="flex h-[72px] items-center justify-between px-5 md:px-10">
                            <span className="font-display text-2xl font-semibold">Зеленые усы</span>
                            <button
                                onClick={() => setMenuOpen(false)}
                                className="grid size-11 place-items-center rounded-full border border-cream/25 transition-colors hover:bg-cream hover:text-forest"
                                aria-label="Закрыть меню"
                            >
                                <X className="size-5"/>
                            </button>
                        </div>
                        <nav className="flex flex-1 flex-col justify-center gap-1 px-8">
                            {nav.map((n, i) => (
                                <motion.div
                                    key={n.to}
                                    initial={{opacity: 0, x: -30}}
                                    animate={{opacity: 1, x: 0}}
                                    transition={{delay: 0.08 + i * 0.07, duration: 0.5}}
                                >
                                    <Link
                                        href={n.to}
                                        onClick={() => setMenuOpen(false)}
                                        className="block border-b border-cream/10 py-5 font-display text-4xl font-medium transition-colors hover:text-sage"
                                    >
                                        {n.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>
                        <div className="px-8 pb-10 text-sm text-cream/60">
                            <p>Москва, ул. Лесная, 12 · ежедневно 10:00–21:00</p>
                            <p className="mt-1">+7 (495) 120-45-67</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

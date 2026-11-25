import {AnimatePresence, motion} from "framer-motion";
import {X} from "lucide-react";
import {nav} from "@/widgets/header/config/const";
import Link from "next/link";

export function MobileMenu({open, onClose}) {
    return (
        <AnimatePresence>
            {open && (
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
                            onClick={onClose}
                            className="grid size-11 place-items-center rounded-full border border-cream/25 transition-colors hover:bg-cream hover:text-forest"
                            aria-label="Закрыть меню"
                        >
                            <X className="size-5"/>
                        </button>
                    </div>

                    <nav className="flex flex-1 flex-col justify-center gap-1 px-8">
                        {nav.map((item, i) => (
                            <motion.div
                                key={item.to}
                                initial={{opacity: 0, x: -30}}
                                animate={{opacity: 1, x: 0}}
                                transition={{delay: 0.08 + i * 0.07, duration: 0.5}}
                            >
                                <Link
                                    href={item.to}
                                    onClick={onClose}
                                    className="block border-b border-cream/10 py-5 font-display text-4xl font-medium transition-colors hover:text-sage"
                                >
                                    {item.label}
                                </Link>
                            </motion.div>
                        ))}
                    </nav>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
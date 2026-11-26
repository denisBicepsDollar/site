"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Leaf, Menu, Phone, ShoppingBag, X } from "lucide-react";
import { MobileMenu } from "./mobile-menu";
import { buttonVariants } from "@site/ui/button";
import { CardDropdown } from "@/features/cart-dropdown";
import { useCartStore } from "@/entities/cart";
import { NavLinks } from "./nav-links";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const cartItems = useCartStore((state) => state.cartItems);
  useEffect(() => {
    setIsMounted(true); // Компонент успешно загрузился в браузере
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40">
        <div
          className={`transition-all duration-500 border-b border-forest/10 bg-cream/90 shadow-[0_10px_40px_-20px_rgba(20,38,27,0.35)] backdrop-blur-xl`}
        >
          <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 md:px-10">
            <Link href="/" className="group flex items-center gap-2.5">
              <span
                className="grid size-10 place-items-center rounded-full bg-forest text-cream
                                           transition-transform duration-500 group-hover:rotate-[20deg]"
              >
                <Leaf className="size-5" strokeWidth={1.8} />
              </span>
              <span className="font-display text-[26px] font-semibold leading-none tracking-tight">
                Зеленые усы
              </span>
            </Link>

            <Suspense fallback={null}>
              <NavLinks />
            </Suspense>

            <div className="flex items-center gap-3 md:gap-5">
              <Link
                href="/contact"
                className="hidden items-center gap-2 text-[13px] font-semibold text-ink/70 transition-colors hover:text-forest xl:flex"
              >
                <Phone className="size-4" strokeWidth={1.8} />
                Связаться +7 (495) 120-45-67
              </Link>

              <div className="relative group">
                <Link
                  href="/cart"
                  className={`${buttonVariants({
                    scope: "client",
                    variant: "default",
                  })} relative overflow-visible`}
                >
                  <ShoppingBag className="size-[18px]" strokeWidth={1.8} />
                  <span className="hidden text-[13px] font-semibold uppercase tracking-[0.12em] sm:block">
                    Корзина
                  </span>

                  <AnimatePresence mode="popLayout">
                    {isMounted && cartItems.length && (
                      <motion.span
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 22,
                        }}
                        className="grid size-[22px] place-items-center rounded-full bg-clay text-[11px] font-bold transition-colors group-hover:bg-cream group-hover:text-forest"
                      >
                        {cartItems
                          .map((item) => item.cartQuantity)
                          .reduce((acc, currentVal) => acc + currentVal)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>

                <div
                  className="absolute right-0 top-full z-50 pt-3
                 opacity-0 translate-y-2 pointer-events-none
                 transition-all duration-300 ease-out
                 group-hover:opacity-100 group-hover:translate-y-0
                 group-hover:pointer-events-auto"
                >
                  <div className="rounded-lg bg-white p-4 text-black shadow-lg">
                    <CardDropdown />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* mobile menu */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

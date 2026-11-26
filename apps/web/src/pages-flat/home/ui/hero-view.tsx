"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Sprout } from "lucide-react";
import {
  extractHeroDataFromResponse,
  type HeroData,
  type HeroFeaturedProduct,
  type ProductsApiResponse,
} from "@/shared/api";
import { formatPrice } from "@/shared/lib";
import { Button } from "@/shared/ui/button";

const HERO_IMG = "/default-image.png";

export interface HeroViewProps {
  featuredProduct: HeroFeaturedProduct | null;
  totalCount: number | null;
  isPending?: boolean;
}

export function HeroView({
  featuredProduct,
  totalCount,
  isPending = false,
}: HeroViewProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  const [clientHero, setClientHero] = useState<HeroData | null>(null);
  const [hasLoadedFallback, setHasLoadedFallback] = useState(
    Boolean(featuredProduct),
  );

  useEffect(() => {
    if (featuredProduct) {
      setHasLoadedFallback(true);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    async function loadTopProduct() {
      try {
        const res = await fetch("/api/products?sort=sales", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) return;
        const body = (await res.json()) as ProductsApiResponse;
        if (!cancelled) {
          setClientHero(extractHeroDataFromResponse(body));
        }
      } catch {
        // Ignore network/abort errors in client fallback.
      } finally {
        if (!cancelled) {
          setHasLoadedFallback(true);
        }
      }
    }

    void loadTopProduct();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [featuredProduct]);

  const activeProduct = featuredProduct ?? clientHero?.product ?? null;
  const activeTotalCount = totalCount ?? clientHero?.totalCount ?? null;

  const productHref = activeProduct
    ? `/product/${encodeURIComponent(String(activeProduct.slug || activeProduct.id))}`
    : "/products";
  const heroImage = activeProduct?.previewImage || HERO_IMG;
  const heroImageAlt = activeProduct?.name || "Комнатные и садовые растения";
  const productsCountLabel =
    activeTotalCount !== null && activeTotalCount > 0
      ? String(activeTotalCount)
      : "500+";

  const showFloatingSkeleton = !activeProduct && (isPending || !hasLoadedFallback);

  const archImage = (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 1.1,
        delay: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative aspect-[4/5] w-full overflow-hidden rounded-b-[28px] rounded-t-[999px] bg-parchment shadow-[0_60px_80px_-50px_rgba(20,38,27,0.55)]"
    >
      <motion.img
        src={heroImage}
        alt={heroImageAlt}
        onError={(e) => {
          const img = e.currentTarget;
          if (!img.src.endsWith(HERO_IMG)) {
            img.src = HERO_IMG;
          }
        }}
        style={{ y: imgY, scale: 1.18 }}
        className="h-full w-full object-cover"
      />
    </motion.div>
  );

  return (
    <section ref={ref} id="top">
      <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-10">
        {/* текст */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="flex items-center gap-3"
          >
            <span className="h-px w-12 bg-clay" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-leaf">
              Магазин комнатных и садовых растений
            </span>
          </motion.div>

          <h1 className="mt-7 font-display text-[clamp(3.4rem,9.5vw,8rem)] font-medium leading-[0.92] tracking-tight text-forest">
            {["Подарок,", "знакомства"].map((t, i) => (
              <span key={t} className="block overflow-hidden pb-1">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.15 + i * 0.13,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {t}
                </motion.span>
              </span>
            ))}
            <span className="block overflow-hidden pb-2">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.41,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                — <em className="font-light italic text-clay">низкая цена</em>
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-7 max-w-md text-[15px] leading-relaxed text-ink/65 md:text-base"
          >
            Комнатные растения, садовые культуры и всё для ухода. Поможем
            выбрать, привезём за три часа и научим заботиться — бесплатно и
            навсегда.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.72 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Button
              variant="accent"
              shape="pill"
              size="xl"
              render={
                <Link href="/products">
                  Смотреть каталог <ArrowDown />
                </Link>
              }
            />

            <Button
              variant="default"
              shape="pill"
              size="xl"
              render={
                <Link href="/about">
                  О магазине
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              }
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-14 grid max-w-lg grid-cols-2 gap-6 border-t border-forest/10 pt-7"
          >
            {[
              [productsCountLabel, "видов в наличии"],
              ["12 лет", "выращиваем сами"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="font-display text-3xl font-semibold text-forest md:text-4xl">
                  {n}
                </p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-ink/45">
                  {l}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* изображение */}
        <div className="lg:col-span-5">
          <div className="relative mx-auto w-full max-w-[460px] lg:sticky lg:top-28 lg:ml-auto lg:mr-0">
            {activeProduct ? (
              <Link
                href={productHref}
                className="block"
                aria-label={heroImageAlt}
              >
                {archImage}
              </Link>
            ) : (
              <div className="block">{archImage}</div>
            )}

            {/* вращающаяся печать */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.7,
                delay: 1,
                type: "spring",
                stiffness: 120,
              }}
              className="pointer-events-none absolute -bottom-6 left-2 z-10 grid size-28 place-items-center rounded-full bg-clay text-cream shadow-xl sm:size-32 md:-left-6"
            >
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 animate-rotate-slow"
              >
                <defs>
                  <path
                    id="circlePath"
                    d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0"
                  />
                </defs>
                <text
                  className="fill-cream text-[8.2px] font-semibold uppercase"
                  style={{ letterSpacing: "2.6px" }}
                >
                  <textPath href="#circlePath">
                    комнатные и садовые растения
                  </textPath>
                </text>
              </svg>
              <Sprout className="size-8" strokeWidth={1.6} />
            </motion.div>

            {/* плавающая карточка */}
            {activeProduct ? (
              <Link
                href={productHref}
                className="absolute right-3 bottom-4 z-10 max-w-[230px] sm:max-w-[270px] md:bottom-auto md:right-3 md:top-8"
              >
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.15 }}
                  className="animate-float rounded-2xl border border-forest/10 bg-cream/90 px-5 py-4 shadow-lg backdrop-blur transition-colors duration-300 hover:border-clay/50"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-leaf">
                    Хит продаж
                  </p>
                  <p className="mt-1 font-display text-lg sm:text-xl font-semibold text-forest leading-snug">
                    {activeProduct.name} · {formatPrice(activeProduct.price)}
                  </p>
                </motion.div>
              </Link>
            ) : showFloatingSkeleton ? (
              <div
                aria-hidden="true"
                className="absolute right-3 bottom-4 z-10 w-[210px] sm:w-[240px] md:bottom-auto md:right-3 md:top-8"
              >
                <div className="rounded-2xl border border-forest/10 bg-cream/90 px-5 py-4 shadow-lg backdrop-blur">
                  <div className="h-2.5 w-20 animate-pulse rounded bg-forest/15" />
                  <div className="mt-2.5 h-5 w-full animate-pulse rounded bg-forest/10" />
                </div>
              </div>
            ) : (
              <Link
                href="/products"
                className="absolute right-3 bottom-4 z-10 max-w-[230px] sm:max-w-[270px] md:bottom-auto md:right-3 md:top-8"
              >
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.15 }}
                  className="animate-float rounded-2xl border border-forest/10 bg-cream/90 px-5 py-4 shadow-lg backdrop-blur transition-colors duration-300 hover:border-clay/50"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-leaf">
                    Каталог
                  </p>
                  <p className="mt-1 font-display text-lg sm:text-xl font-semibold text-forest leading-snug">
                    Смотреть все растения
                  </p>
                </motion.div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Check,
  ChevronRight,
  Droplets,
  Leaf,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sprout,
  Sun,
  Truck,
} from "lucide-react";
import { Eyebrow, Reveal } from "@/shared/ui/reveal";
import { ProductCard } from "@/entities/product";
import { useCartStore } from "@/entities/cart";
import { Reviews1 } from "./reviews";
import { formatPrice } from "../config/const";
import {
  getCategoryLabel,
  getSubcategoryLabel,
  type CatalogLabels,
} from "@/pages-flat/products/config/catalog-labels";
import {
  useVariants,
  type ProductDetail,
  type ProductVariant,
} from "../model/use-variants";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb";
import { Button, ButtonWithIcon } from "@/shared/ui/button";
import { Tag, TagGroup } from "@/shared/ui/tag-group";
import { Tabs, TabsList, TabsTab } from "@/shared/ui/tabs";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/shared/ui/number-field";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/shared/ui/accordion";

interface ProductScreenProps {
  product: ProductDetail | null;
  products?: any[];
  labels?: CatalogLabels;
  isError?: boolean;
}

const DEFAULT_IMAGE = "/default-image.png";

export default function ProductScreen({
  product,
  products = [],
  labels,
  isError = false,
}: ProductScreenProps) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const cartStorage = useCartStore((state) => state.cartStorage);

  const [qty, setQty] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const rawVariants = useMemo(
    () => (Array.isArray(product?.variants) ? product.variants : []),
    [product?.variants],
  );
  const { sortedVariants } = useVariants(rawVariants);

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    () => sortedVariants[0]?.id ?? "",
  );

  useEffect(() => {
    setSelectedVariantId(sortedVariants[0]?.id ?? "");
    setQty(1);
    setAddedFeedback(false);
    // Reset selection only when navigating to a different product
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const currentVariant: ProductVariant | undefined = useMemo(
    () =>
      sortedVariants.find((variant) => variant.id === selectedVariantId) ??
      sortedVariants[0],
    [sortedVariants, selectedVariantId],
  );

  const galleryImages = useMemo(() => {
    const candidates = [
      currentVariant?.previewImage,
      ...(currentVariant?.images ?? []),
      product?.previewImage,
      ...(product?.images ?? []),
    ];
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const raw of candidates) {
      const trimmed = raw?.trim();
      if (!trimmed || seen.has(trimmed)) continue;
      seen.add(trimmed);
      unique.push(trimmed);
    }
    if (unique.length > 1) {
      return unique.filter((src) => src !== DEFAULT_IMAGE);
    }
    return unique.length > 0 ? unique : [DEFAULT_IMAGE];
  }, [currentVariant, product?.images, product?.previewImage]);

  const [activeImage, setActiveImage] = useState<string>(
    () => galleryImages[0] ?? DEFAULT_IMAGE,
  );

  useEffect(() => {
    const preferred =
      currentVariant?.previewImage?.trim() ||
      currentVariant?.images?.[0]?.trim() ||
      galleryImages[0] ||
      DEFAULT_IMAGE;
    setActiveImage(preferred);
  }, [currentVariant?.id, currentVariant?.previewImage, currentVariant?.images, galleryImages]);

  useEffect(() => {
    if (!addedFeedback) return;
    const timer = setTimeout(() => setAddedFeedback(false), 2000);
    return () => clearTimeout(timer);
  }, [addedFeedback]);

  useEffect(() => {
    if (!copiedLink) return;
    const timer = setTimeout(() => setCopiedLink(false), 2000);
    return () => clearTimeout(timer);
  }, [copiedLink]);

  if (isError && !product) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
        <span className="grid size-20 place-items-center rounded-full bg-parchment text-clay">
          <Leaf className="size-9" strokeWidth={1.5} />
        </span>
        <h1 className="mt-6 font-display text-4xl font-semibold text-forest md:text-5xl">
          Не удалось загрузить товар
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/60">
          Произошла временная ошибка при получении данных. Попробуйте обновить
          страницу или перейдите в каталог.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="default"
            shape="pill"
            onClick={() => router.refresh()}
          >
            Обновить
          </Button>
          <Link
            href="/products"
            className="rounded-full border border-forest/20 px-6 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-forest transition-colors hover:border-forest hover:bg-forest hover:text-cream"
          >
            В каталог
          </Link>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
        <span className="grid size-20 place-items-center rounded-full bg-parchment text-leaf">
          <Leaf className="size-9" strokeWidth={1.5} />
        </span>
        <h1 className="mt-6 font-display text-4xl font-semibold text-forest md:text-5xl">
          Такого растения у нас нет
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/60">
          Возможно, его уже купили или оно ещё растёт в оранжерее. Загляните в
          каталог — там много других красавцев.
        </p>
        <Link
          href="/products"
          className="mt-8 rounded-full bg-forest px-8 py-4 text-[12px] font-bold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-clay"
        >
          В каталог
        </Link>
      </main>
    );
  }

  const availableStock = currentVariant
    ? Number(currentVariant.stock) || 0
    : Number(product.stock) || 0;
  const isInStock = Boolean(currentVariant?.id) && availableStock > 0;
  const maxQty = Math.max(1, availableStock);
  const safeQty = Math.min(Math.max(1, qty), maxQty);

  const activePrice = Number(currentVariant?.price ?? product.price ?? 0);
  const rawOldPrice = Number(currentVariant?.oldPrice ?? product.oldPrice ?? 0);
  const activeOldPrice =
    Number.isFinite(rawOldPrice) && rawOldPrice > activePrice
      ? rawOldPrice
      : null;

  const variantInCartQty = currentVariant?.id
    ? (cartStorage.find((item) => item.variantId === currentVariant.id)
        ?.cartQuantity ?? 0)
    : 0;

  const handleVariantChange = (selectedId: string) => {
    const selected = sortedVariants.find((v) => v.id === selectedId);
    if (!selected) return;
    setSelectedVariantId(selected.id);
    const nextMax = Math.max(1, Number(selected.stock) || 0);
    setQty((prev) => Math.min(Math.max(1, prev), nextMax));
    setAddedFeedback(false);
  };

  const handleAddToCart = () => {
    if (!currentVariant?.id || availableStock <= 0) return;
    addToCart({
      variantId: currentVariant.id,
      stock: availableStock,
      quantity: safeQty,
    });
    setAddedFeedback(true);
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url: shareUrl });
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
      }
    } catch {
      // Ignore cancelled share dialog
    }
  };

  const related = (products ?? [])
    .filter(
      (p) =>
        p &&
        p.id !== product.id &&
        (!product.category ||
          String(p.category ?? "").toLowerCase() ===
            product.category.toLowerCase()),
    )
    .slice(0, 4);

  const categoryLabel = product.category
    ? getCategoryLabel(product.category, labels)
    : "Каталог";
  const subcategoryLabel = product.subcategory
    ? getSubcategoryLabel(product.subcategory, labels)
    : undefined;

  const tags = Array.isArray(product.tags)
    ? product.tags.filter((tag) => Boolean(tag?.trim()))
    : [];

  const attrs = [
    { icon: Sun, label: "Свет", value: product.light?.trim() },
    { icon: Droplets, label: "Полив", value: product.water?.trim() },
    { icon: Sprout, label: "Сложность", value: product.level?.trim() },
  ].filter((attr) => Boolean(attr.value));

  const descriptionText = product.description?.trim()
    ? `${product.description.trim()} Растение приезжает в транспортировочном горшке со здоровой корневой системой. Кашпо, грунт и дренаж подберём под него бесплатно.`
    : "Растение приезжает в транспортировочном горшке со здоровой корневой системой. Кашпо, грунт и дренаж подберём под него бесплатно.";

  const careText = product.careInstructions?.trim()
    ? `${product.careInstructions.trim()} Памятка по уходу прилагается к каждому заказу, а наш ботаник остаётся на связи после покупки — пришлите фото листа, подскажем.`
    : "Памятка по уходу прилагается к каждому растению, а наш ботаник остаётся на связи после покупки — пришлите фото листа, подскажем.";

  return (
    <main className="bg-cream">
      <div className="mx-auto">
        <Breadcrumb>
          <BreadcrumbList className="flex-wrap">
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>Главная</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/products" />}>
                Каталог
              </BreadcrumbLink>
            </BreadcrumbItem>
            {product.category ? (
              <>
                <BreadcrumbSeparator>
                  <ChevronRight />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    render={
                      <Link
                        href={`/products/${encodeURIComponent(product.category)}`}
                      />
                    }
                  >
                    {categoryLabel}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            ) : null}
            {product.category && product.subcategory && subcategoryLabel ? (
              <>
                <BreadcrumbSeparator>
                  <ChevronRight />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    render={
                      <Link
                        href={`/products/${encodeURIComponent(product.category)}/${encodeURIComponent(product.subcategory)}`}
                      />
                    }
                  >
                    {subcategoryLabel}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            ) : null}
            <BreadcrumbSeparator>
              <ChevronRight />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Фото и миниатюры */}
          <Reveal className="lg:sticky lg:top-32 lg:self-start">
            <div className="relative overflow-hidden rounded-[28px] bg-parchment shadow-[0_60px_80px_-55px_rgba(20,38,27,0.5)]">
              <motion.img
                key={activeImage}
                src={activeImage || DEFAULT_IMAGE}
                alt={product.name}
                onError={(e) => {
                  const img = e.currentTarget;
                  if (!img.src.endsWith(DEFAULT_IMAGE)) {
                    img.src = DEFAULT_IMAGE;
                  }
                }}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="aspect-[3/4] w-full object-cover"
              />
              {product.badge && (
                <span className="absolute left-5 top-5 rounded-full bg-clay px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-cream">
                  {product.badge}
                </span>
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {galleryImages.map((imgUrl, index) => {
                  const isCurrent = activeImage === imgUrl;
                  return (
                    <button
                      key={`${imgUrl}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(imgUrl)}
                      aria-label={`Фото ${index + 1}`}
                      className={`size-16 overflow-hidden rounded-xl border-2 transition-all ${
                        isCurrent
                          ? "border-forest ring-2 ring-forest/20"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.name} — фото ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </Reveal>

          {/* Информация и покупка */}
          <motion.div
            key={`info-${product.id ?? product.slug ?? product.name}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Eyebrow>
              {subcategoryLabel
                ? `${categoryLabel} · ${subcategoryLabel}`
                : categoryLabel}
            </Eyebrow>

            {tags.length > 0 && (
              <TagGroup aria-label="Особенности растения" className="mt-3" size="xl">
                {tags.map((tag, index) => (
                  <Tag key={`${tag}-${index}`}>{tag}</Tag>
                ))}
              </TagGroup>
            )}

            <h1 className="mt-4 font-display text-5xl font-medium leading-[1.02] tracking-tight text-forest md:text-6xl">
              {product.name}
            </h1>

            {product.sku && (
              <p className="mt-2 text-xs uppercase tracking-[0.12em] text-ink/45">
                Артикул: {product.sku}
              </p>
            )}

            {product.latin && (
              <p className="mt-3 font-display text-2xl font-light italic text-ink/40">
                {product.latin}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="font-display text-4xl font-semibold text-forest">
                {formatPrice(activePrice)}
              </span>

              {activeOldPrice !== null && (
                <span className="text-lg font-medium text-ink/35 line-through">
                  {formatPrice(activeOldPrice)}
                </span>
              )}

              {isInStock ? (
                <span className="rounded-full bg-leaf/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-leaf">
                  В наличии · {availableStock} шт.
                </span>
              ) : (
                <span className="rounded-full bg-ink/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/55">
                  Нет в наличии
                </span>
              )}

              <Button
                type="button"
                variant="ghost"
                size="sm"
                shape="pill"
                onClick={handleShare}
                className="ml-auto text-ink/60 hover:text-forest"
              >
                {copiedLink ? (
                  <>
                    <Check className="size-4 text-leaf" />
                    Скопировано
                  </>
                ) : (
                  <>
                    <Share2 className="size-4" />
                    Поделиться
                  </>
                )}
              </Button>
            </div>

            <div className="mt-6 flex flex-col items-start gap-5">
              {product.shortDescription && (
                <p className="max-w-lg text-[15px] leading-relaxed text-ink/65">
                  {product.shortDescription}
                </p>
              )}

              {attrs.length > 0 && (
                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
                  {attrs.map((attr) => (
                    <div
                      key={attr.label}
                      className="rounded-2xl border border-forest/10 bg-parchment/60 p-4"
                    >
                      <attr.icon
                        className="size-5 text-clay"
                        strokeWidth={1.7}
                      />
                      <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-ink/40">
                        {attr.label}
                      </p>
                      <p className="mt-1 text-[13px] font-semibold leading-snug text-forest">
                        {attr.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {sortedVariants.length > 0 && (
                <div className="w-full space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/50">
                    Вариант / размер
                  </span>
                  <Tabs
                    size="sm"
                    value={currentVariant?.id ?? ""}
                    onValueChange={(value) => handleVariantChange(String(value))}
                  >
                    <TabsList
                      variant="pill"
                      className="bg-transparent shadow-none"
                      aria-label="Варианты товара"
                    >
                      {sortedVariants.map((variant) => {
                        const outOfStock = Number(variant.stock) <= 0;
                        return (
                          <TabsTab
                            key={variant.id}
                            value={variant.id}
                            size="lg"
                            className={outOfStock ? "opacity-55" : ""}
                          >
                            {variant.name}
                            {outOfStock ? " (нет)" : ""}
                          </TabsTab>
                        );
                      })}
                    </TabsList>
                  </Tabs>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <NumberField
                  width="fit"
                  min={1}
                  max={maxQty}
                  value={safeQty}
                  disabled={!isInStock}
                  onValueChange={(val) => {
                    if (typeof val === "number" && Number.isFinite(val)) {
                      setQty(Math.min(Math.max(1, Math.trunc(val)), maxQty));
                    }
                  }}
                >
                  <NumberFieldGroup>
                    <NumberFieldDecrement aria-label="Уменьшить количество" />
                    <NumberFieldInput aria-label="Количество" />
                    <NumberFieldIncrement aria-label="Увеличить количество" />
                  </NumberFieldGroup>
                </NumberField>

                <ButtonWithIcon
                  width="fit"
                  icon={
                    addedFeedback ? (
                      <Check aria-hidden="true" />
                    ) : (
                      <ShoppingBag aria-hidden="true" />
                    )
                  }
                  variant="accent"
                  shape="pill"
                  disabled={!isInStock}
                  onClick={handleAddToCart}
                >
                  {!isInStock
                    ? "Нет в наличии"
                    : addedFeedback
                      ? "Добавлено в корзину"
                      : `В корзину · ${formatPrice(activePrice * safeQty)}`}
                </ButtonWithIcon>

                {variantInCartQty > 0 && (
                  <Link
                    href="/cart"
                    className="text-xs font-semibold text-forest underline underline-offset-4 hover:text-clay"
                  >
                    В корзине: {variantInCartQty} шт. →
                  </Link>
                )}
              </div>

              <Accordion
                className="mt-4 w-full"
                defaultValue={["description"]}
                multiple
              >
                <AccordionItem value="description">
                  <AccordionTrigger>Описание</AccordionTrigger>
                  <AccordionPanel>
                    <p className="text-[15px] leading-relaxed text-ink/70">
                      {descriptionText}
                    </p>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem value="careInstructions">
                  <AccordionTrigger>Уход</AccordionTrigger>
                  <AccordionPanel>
                    <p className="text-[15px] leading-relaxed text-ink/70">
                      {careText}
                    </p>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem value="delivery">
                  <AccordionTrigger>Доставка и гарантия</AccordionTrigger>
                  <AccordionPanel>
                    <ul className="space-y-4 py-2">
                      {[
                        {
                          icon: Truck,
                          text: "Доставка по Москве за 3 часа, бесплатно при заказе от 3 000 ₽",
                        },
                        {
                          icon: ShieldCheck,
                          text: "Гарантия приживаемости 30 дней на все растения",
                        },
                        {
                          icon: RotateCcw,
                          text: "Вернём деньги или заменим растение, если что-то пошло не так",
                        },
                      ].map((row) => (
                        <li
                          key={row.text}
                          className="flex items-start gap-3 text-[15px] text-ink/65"
                        >
                          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-forest text-cream">
                            <row.icon className="size-4" strokeWidth={1.8} />
                          </span>
                          <span className="pt-1.5">{row.text}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </div>
          </motion.div>
        </div>

        <Reviews1 />

        {related.length > 0 && (
          <section className="mt-24 border-t border-forest/10 pt-16">
            <Reveal>
              <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                <h2 className="font-display text-4xl font-medium text-forest md:text-5xl">
                  Похожие{" "}
                  <em className="font-light italic text-clay">растения</em>
                </h2>
                {product.category && (
                  <Link
                    href={`/products/${encodeURIComponent(product.category)}`}
                    className="text-[12px] font-bold uppercase tracking-[0.14em] text-leaf underline-offset-4 transition-colors hover:text-clay hover:underline"
                  >
                    Все {categoryLabel.toLowerCase()}
                  </Link>
                )}
              </div>
            </Reveal>
            <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.06}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

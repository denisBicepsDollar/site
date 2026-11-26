"use client";
import { useEffect, useState, ReactNode, use } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
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
} from "lucide-react";
import { Eyebrow, Reveal } from "@/shared/ui/reveal";
import { ProductCard } from "@/entities/product";
import { Reviews1 } from "./reviews";
import { formatPrice } from "../config/const";
import {
  getCategoryLabel,
  getSubcategoryLabel,
} from "@/pages-flat/products/config/catalog-labels";
import { AddToCartButton } from "@/features/add-to-cart";
import { useVariants } from "../model/use-variants";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
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
  NumberFieldScrubArea,
} from "@/shared/ui/number-field";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/shared/ui/accordion";

export default function ProductScreen({ product, products, labels }) {
  const [qty, setQty] = useState(1);

  const { sortedVariants } = useVariants(product.variants);

  const [currentVariant, setCurrentVariant] = useState(sortedVariants[0]);

  const variantsHandler = (selectedVariantId) => {
    const selectedVariant = sortedVariants.find(
      (variant) => variant.id === selectedVariantId,
    );

    setCurrentVariant(selectedVariant);
  };

  if (!product) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-cream  text-center">
        <span className="grid size-20 place-items-center rounded-full bg-parchment text-leaf">
          <Leaf className="size-9" strokeWidth={1.5} />
        </span>
        <h1 className=" font-display text-4xl font-semibold text-forest md:text-5xl">
          Такого растения у нас нет
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/60">
          Возможно, его уже купили или оно ещё растёт в оранжерее. Загляните в
          каталог — там много других красавцев.
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
    { icon: Sun, label: "Свет", value: product.light },
    { icon: Droplets, label: "Полив", value: product.water },
    { icon: Sprout, label: "Сложность", value: product.level },
  ];

  const sections = [
    {
      content: `${product.description} Растение приезжает в транспортировочном горшке со здоровой корневой системой. Кашпо, грунт и дренаж подберём под него бесплатно.`,
      title: "Описание",
      value: "description",
    },
    {
      content: `
      Памятка по уходу прилагается к каждому растению, а наш ботаник
      остаётся на связи после покупки — пришлите фото листа,
      подскажем.
      ${product.careInstructions}
      `,
      title: "Уход",
      value: "careInstructions",
    },
    {
      content: `

      `,
      title: "Доставка и гарантия",
      value: "delivery",
    },
  ];

  //
  //   <ul className="space-y-2.5 text-[15px] leading-relaxed text-ink/65">
  //     <li>· Свет: {product.light?.toLowerCase()}</li>
  //     <li>· Вода: {product.water?.toLowerCase()}</li>
  //     <li>· Уровень: {product.level?.toLowerCase()}</li>
  //   </ul>

  return (
    <main className="bg-cream">
      <div className="mx-auto  ">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Главная</BreadcrumbLink>
              <BreadcrumbSeparator>
                <ChevronRight />
              </BreadcrumbSeparator>
              <BreadcrumbLink href="/products">Каталог</BreadcrumbLink>
              <BreadcrumbSeparator>
                <ChevronRight />
              </BreadcrumbSeparator>
              <BreadcrumbLink href={`/products/${encodeURIComponent(product.category ?? "")}`}>
                {getCategoryLabel(product.category ?? "", labels)}
              </BreadcrumbLink>
              <BreadcrumbSeparator>
                <ChevronRight />
              </BreadcrumbSeparator>
              <BreadcrumbLink
                href={`/products/${encodeURIComponent(product.category ?? "")}/${encodeURIComponent(product.subcategory ?? "")}`}
              >
                {getSubcategoryLabel(product.subcategory ?? "", labels)}
              </BreadcrumbLink>
              <BreadcrumbSeparator>
                <ChevronRight />
              </BreadcrumbSeparator>
              <BreadcrumbLink>{product.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16 ">
          {/* фото */}
          <Reveal className="lg:sticky lg:top-32 lg:self-start">
            <div className="relative overflow-hidden rounded-[28px] bg-parchment shadow-[0_60px_80px_-55px_rgba(20,38,27,0.5)]">
              <motion.img
                key={product.id}
                src={product.previewImage}
                alt={product.name}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="aspect-[3/4] w-full object-cover"
              />
              {product.badge && (
                <span className="absolute left-5 top-5 rounded-full bg-clay px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-cream">
                  {product.badge}
                </span>
              )}
            </div>
          </Reveal>

          {/* описание */}
          <motion.div
            key={`info-${product.id}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Eyebrow>{getCategoryLabel(product.category ?? "", labels)} растения</Eyebrow>
            <TagGroup size="xl">
              {product.tags.map((tag) => (
                <Tag>{tag}</Tag>
              ))}
            </TagGroup>

            <h1 className="mt-4 font-display text-5xl font-medium leading-[1.02] tracking-tight text-forest md:text-6xl">
              {product.name}
            </h1>
            <p className="text-[15px] leading-relaxed text-ink/65">
              {product.sku}
            </p>
            <p className="mt-3 font-display text-2xl font-light italic text-ink/40">
              {product.latin}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <span className="font-display text-4xl font-semibold text-forest">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-lg font-medium text-ink/35 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
              <span className="rounded-full bg-leaf/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-leaf">
                В наличии 2
              </span>
              <div>Поделиться</div>
            </div>
            <div className="flex flex-col gap-3 items-end">
              <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink/65">
                {product.shortDescription}
              </p>

              {/*<div className="mt-8 grid grid-cols-3 gap-3">
              {attrs.map((a) => (
                <div
                  key={a.label}
                  className="rounded-2xl border border-forest/10 bg-parchment/60 p-4"
                >
                  <a.icon className="size-5 text-clay" strokeWidth={1.7} />
                  <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-ink/40">
                    {a.label}
                  </p>
                  <p className="mt-1 text-[13px] font-semibold leading-snug text-forest">
                    {a.value}
                  </p>
                </div>
              ))}
            </div>*/}

              <Tabs size="sm" defaultValue={sortedVariants[0]}>
                <TabsList
                  variant={"pill"}
                  className="shadow-none bg-transparent"
                  aria-label="Project sections"
                >
                  {sortedVariants.map((v) => {
                    const isSelected = currentVariant?.id === v.id;

                    return (
                      <TabsTab
                        key={v.id}
                        value={v.id}
                        className=""
                        onClick={() => variantsHandler(v.id)}
                        size={"lg"}
                        disabled={v.stock <= 0}
                      >
                        {v.name}
                      </TabsTab>
                    );
                  })}
                </TabsList>
              </Tabs>
              <NumberField width="fit" onValueChange={setQty} defaultValue={1}>
                <NumberFieldGroup>
                  <NumberFieldDecrement aria-label="Decrease quantity" />
                  <NumberFieldInput />
                  <NumberFieldIncrement aria-label="Increase quantity" />
                </NumberFieldGroup>
              </NumberField>

              <ButtonWithIcon
                width="fit"
                icon={<ShoppingBag aria-hidden="true" />}
                variant="accent"
                shape="pill"
              >
                В корзину · {formatPrice(currentVariant.price)}
              </ButtonWithIcon>
              <Accordion
                className="w-full "
                defaultValue={["notifications"]}
                multiple
              >
                {sections.map((section) => (
                  <AccordionItem key={section.value} value={section.value}>
                    <AccordionTrigger>{section.title}</AccordionTrigger>
                    <AccordionPanel>{section.content}</AccordionPanel>
                  </AccordionItem>
                ))}
                <AccordionItem title="Доставка и гарантия">
                  <ul className="space-y-4">
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
                    ].map((r) => (
                      <li
                        key={r.text}
                        className="flex items-start gap-3 text-[15px] text-ink/65"
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-forest text-cream">
                          <r.icon className="size-4" strokeWidth={1.8} />
                        </span>
                        <span className="pt-1.5">{r.text}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionItem>
              </Accordion>
            </div>
          </motion.div>
        </div>

        <Reviews1 />
        {/* похожие */}
        <section className="mt-24 border-t border-forest/10 pt-16">
          <Reveal>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-4xl font-medium text-forest md:text-5xl">
                Похожие{" "}
                <em className="font-light italic text-clay">растения</em>
              </h2>
              <Link
                href={`/products/${encodeURIComponent(product.category ?? "")}`}
                className="text-[12px] font-bold uppercase tracking-[0.14em] text-leaf underline-offset-4 transition-colors hover:text-clay hover:underline"
              >
                Все {getCategoryLabel(product.category ?? "", labels).toLowerCase()}
              </Link>
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
      </div>
    </main>
  );
}

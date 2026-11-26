"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { formatPrice } from "@/shared/data";
import { Card, CardContent, CardHeader, CardMedia } from "@/shared/ui/card";
import { CardTitle } from "@site/ui/card";
import { Badge } from "@site/ui/badge";

const badgeStyle = {
  Хит: "bg-clay text-cream",
  Новинка: "bg-leaf text-cream",
  Выгода: "bg-forest text-cream",
};

export function ProductCard({ product }) {
  const [liked, setLiked] = useState(false);

  return (
    <Card className="overflow-hidden group border-ink/5 bg-cream/30 transition-shadow duration-300 ">
      <CardHeader className="relative block p-0">
        {/* Тег / Бейдж */}
        {product.tags?.[0] && (
          <Badge
            shape="pill"
            className={`pointer-events-none absolute left-3.5 top-3.5 z-10 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] shadow-sm ${
              badgeStyle[product.badge] || "bg-forest text-cream"
            }`}
          >
            {product.tags[0]}
          </Badge>
        )}
        {/* Кнопка "В избранное"  */}
        {/*<button
          onClick={() => setLiked((v) => !v)}
          aria-label="В избранное"
          className={`absolute right-3.5 top-3.5 z-10 grid size-9 place-items-center rounded-full backdrop-blur-md transition-all duration-300 ${
            liked
              ? "bg-clay text-cream shadow-md"
              : "bg-cream/80 text-forest opacity-0 group-hover:opacity-100 hover:bg-cream max-lg:opacity-100"
          }`}
        >
          <Heart
            className={`size-4 ${liked ? "fill-current" : ""}`}
            strokeWidth={2}
          />
        </button>*/}
        {/* Изображение товара */}
        <CardMedia
          render={
            <Link
              href={`/product/${product.slug}`}
              aria-label={product.name}
              className="block aspect-[4/5] w-full overflow-hidden"
            >
              <img
                src={product.previewImage}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[700ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
              />
            </Link>
          }
        />
      </CardHeader>

      <CardContent className="flex flex-col flex-grow justify-between p-4">
        {/* Приглушенное название товара */}
        <Link
          href={`/product/${product.slug}`}
          className="group/title block mb-3"
        >
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-ink/60 transition-colors group-hover/title:text-ink">
            {product.name}
          </h3>
        </Link>

        {/* Нижний блок: Цена + Остаток (АКЦЕНТ) */}
        <div className="pt-2 border-t border-ink/5">
          {/* Остаток товара (Индикатор/Бейдж) */}
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-clay animate-pulse" />
            <span className="text-[11px] font-bold text-clay uppercase">
              Осталось {product.stock} ед.
            </span>
          </div>

          {/* Цены */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xl font-bold  text-forest">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs font-semibold text-ink/35 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

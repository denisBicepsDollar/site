"use client";

import { AlertCircle, X } from "lucide-react";
import Link from "next/link";
import { AspectRatio } from "@site/ui/aspect-ratio";
import { Separator } from "@site/ui/separator";
import { useCartStore } from "@/entities/cart";
import { Button } from "@/shared/ui/button";

const DEFAULT_IMAGE = "/default-image.png";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);

const CardDropdown = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const cartStorage = useCartStore((state) => state.cartStorage);
  const hasInitialized = useCartStore((state) => state.hasInitialized);
  const isLoadingProducts = useCartStore((state) => state.isLoadingProducts);
  const isError = useCartStore((state) => state.isError);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const fetchCartProducts = useCartStore((state) => state.fetchCartProducts);

  const isSyncPending =
    cartStorage.length > 0 &&
    (!hasInitialized || isLoadingProducts) &&
    cartItems.length === 0;

  if (isSyncPending) {
    return (
      <section className="min-w-64 text-center py-2">
        <p className="text-sm font-medium text-muted-foreground">
          Загрузка корзины…
        </p>
      </section>
    );
  }

  if (isError && cartItems.length === 0 && cartStorage.length > 0) {
    return (
      <section className="min-w-64 text-center space-y-3">
        <p className="text-sm font-semibold text-destructive">
          Не удалось загрузить корзину
        </p>
        <p className="text-xs text-muted-foreground">
          Проверьте соединение с сервером
        </p>
        <Button
          type="button"
          size="xs"
          variant="outline"
          onClick={() => void fetchCartProducts()}
        >
          Повторить
        </Button>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="text-center">
        <p className="mb-4 text-sm font-semibold">Корзина пуста</p>
        <p className="mb-4 text-xs text-muted-foreground">
          Кажется вы еще ничего не добавили
        </p>
        <Button
          variant="accent"
          shape="pill"
          size="xl"
          render={<Link href="/products">Посмотреть каталог</Link>}
        />
      </section>
    );
  }

  const hasOutOfStock = cartItems.some(
    (item) => item.stock <= 0 || item.isOutOfStock,
  );
  const inStockItems = cartItems.filter(
    (item) => item.stock > 0 && !item.isOutOfStock,
  );
  const subtotal = inStockItems.reduce(
    (sum, item) => sum + item.price * item.cartQuantity,
    0,
  );
  const canProceedToCheckout =
    inStockItems.length > 0 && !hasOutOfStock && !isError && !isLoadingProducts;

  return (
    <section className="container max-w-2xl min-w-80">
      <div className="space-y-4">
        {cartItems.map((cartItem) => {
          const isOos = cartItem.stock <= 0 || cartItem.isOutOfStock;
          const productHref = `/product/${encodeURIComponent(cartItem.slug)}`;
          return (
            <div
              key={cartItem.variantId || cartItem.id}
              className="flex items-center gap-4 rounded-lg border p-2"
            >
              <Link
                href={productHref}
                className="w-10 h-10 shrink-0 overflow-hidden rounded-md"
              >
                <AspectRatio ratio={1}>
                  <img
                    src={cartItem.previewImage || DEFAULT_IMAGE}
                    alt={cartItem.productName}
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (!img.src.endsWith(DEFAULT_IMAGE)) {
                        img.src = DEFAULT_IMAGE;
                      }
                    }}
                    className="h-full w-full object-cover"
                  />
                </AspectRatio>
              </Link>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">
                  <Link href={productHref} className="hover:underline">
                    {cartItem.productName} {cartItem.name}
                  </Link>
                </h3>
                {isOos ? (
                  <p className="text-xs font-medium text-destructive">
                    Нет в наличии
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {cartItem.cartQuantity} × {formatPrice(cartItem.price)}
                  </p>
                )}
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  {isOos
                    ? "—"
                    : formatPrice(cartItem.price * cartItem.cartQuantity)}
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="shrink-0"
                aria-label={`Удалить ${cartItem.productName}`}
                onClick={() =>
                  removeFromCart(cartItem.variantId || cartItem.id)
                }
              >
                <X className="size-4" />
              </Button>
            </div>
          );
        })}

        {hasOutOfStock && (
          <p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
            <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
            Удалите отсутствующие товары для оформления заказа
          </p>
        )}

        <div className="flex justify-between text-lg font-semibold">
          <span>Итого:</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col items-center space-y-2">
        <Button
          variant="accent"
          shape="pill"
          size="xl"
          render={<Link href="/cart">Перейти в корзину</Link>}
        />
      </div>
    </section>
  );
};

export { CardDropdown };

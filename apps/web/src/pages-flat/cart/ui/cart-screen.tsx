"use client";
import { useEffect } from "react";
import { useCartStore } from "@/entities/cart";
import { CartList } from "@/features/manage-cart";
import { AsidePanel } from "@/widgets/cart";

export function CartScreen() {
  const initCart = useCartStore((state) => state.initCart);
  const isLoadingProducts = useCartStore((state) => state.isLoadingProducts);
  const variants = useCartStore((state) => state.cartItems);
  const variantsIds = variants.map(({ variantId }) => variantId);

  useEffect(() => {
    initCart(); // инициализируем корзину при входе на экран
  }, []);

  if (isLoadingProducts) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-pulse bg-gray-200 h-10 w-full rounded" />
      </div>
    );
  }

  return (
    <section className="bg-white mt-10 py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
          Корзина
        </h2>

        <div className="flex mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8 gap-6">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              <CartList variantsIds={variantsIds} />
            </div>
          </div>
          <AsidePanel />
        </div>
        {/*<ProductRecomendations otherProducts={otherProducts.data}/>*/}
      </div>
    </section>
  );
}

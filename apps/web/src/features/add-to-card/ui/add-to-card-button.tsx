import { ShoppingBag } from "lucide-react";
import { useCartStore } from "../../../entities/cart/model/cartStore";
import { formatPrice } from "@/shared/data/products";
import { Button } from "@/shared/ui/button";

export function AddToCartButton({ variant, quantity }) {
  const addToCart = useCartStore((state) => state.addToCart);
  return (
    <Button
      onClick={() =>
        addToCart({
          variantId: variant.id,
          stock: variant.stock,
          quantity: quantity,
        })
      }
      className="flex w-full items-center justify-center gap-2.5 rounded-full bg-forest/95 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-cream backdrop-blur transition-colors duration-300 hover:bg-clay"
    >
      <ShoppingBag className="size-4" strokeWidth={2} />В корзину ·{" "}
      {formatPrice(variant.price)}
    </Button>
  );
}

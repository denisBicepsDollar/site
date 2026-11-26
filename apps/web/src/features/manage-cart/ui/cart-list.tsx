import { CartItem } from "./cart-item";

interface CartListProps {
  variantsIds: string[];
}

export function CartList({ variantsIds }: CartListProps) {
  return (
    <>
      {variantsIds.map((id) => (
        <CartItem key={id} variantId={id} />
      ))}
    </>
  );
}

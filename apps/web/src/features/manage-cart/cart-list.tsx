import {CartItem} from "./cart-item";
import {getProductsByVariant} from "../../shared/api/api";

export function CartList({variantsIds}) {
    return (
        <>
            {
                variantsIds.map(id => (
                    <CartItem key={id} variantId={id}/>
                ))
            }
        </>
    )
}
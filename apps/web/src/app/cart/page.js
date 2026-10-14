import {Header} from "../../widgets/header/ui/header";
import CheckoutScreen from "../../pages-flat/cart/checkout-screen";
import {Footer} from "../../widgets/footer/ui/footer";
import {CartScreen} from "../../pages-flat/cart/cart";

export default function CartPage() {
    return (
        <>
            <Header/>
            <CartScreen/>
            <Footer/>
        </>
    )
}
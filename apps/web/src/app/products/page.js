import ProductsPage, {ProductList} from "../../pages-flat/products/ui/products";
import {Footer} from "../../widgets/footer/ui/footer";
import {Header} from "../../widgets/header/ui/header";

export default async function Products() {
    return (
        <main>
            <Header/>
            <ProductsPage searchParams={''}/>
            <Footer/>
        </main>
    )
}
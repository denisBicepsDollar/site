// src/app/product/[slug]/page.js
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { getProductBySlug, getProducts } from "@/shared/api";
import { ProductScreen } from "@/pages-flat/product";

export default async function ProductPage({params}) {
    const resolvedParams = await params;

    const slug = resolvedParams.slug;

    const {data: product} = await getProductBySlug(slug);
    const {data: products} = await getProducts();

    return (
        <>
            <Header/>
            <ProductScreen product={product} products={products}/>
            <Footer/>
        </>

    );
}

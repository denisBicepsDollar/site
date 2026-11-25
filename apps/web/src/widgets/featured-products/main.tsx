// src/app/page.js
import {FeaturedProducts} from './featured-products';
import {getProducts} from "@/shared/api/api";


export default async function FeaturedProd() {
    const featuredProducts = await getProducts();

    return (
        <main>
            {/* Другие ваши блоки */}

            {/* 2. Передаем чистые данные в клиентский анимированный компонент */}
            <FeaturedProducts products={featuredProducts}/>

            {/* Другие ваши блоки */}
        </main>
    );
}

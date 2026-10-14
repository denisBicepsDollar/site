// src/app/product/[slug]/page.js
import {Suspense} from 'react';
import ProductScreen from '@/pages-flat/product-page/ui/product-screen';
import {Header} from "@/widgets/header/ui/header";
import {Footer} from "@/widgets/footer/ui/footer";

// Функция НЕ async!
export default function ProductPage({params}) {
    return (
        // Обязательно даем Suspense. Пока параметры разворачиваются,
        // Next.js мгновенно покажет этот fallback
        <>
            <Header/>
            <Suspense fallback={<div>Загрузка интерфейса...</div>}>
                <Header/>
                {/* Передаем params как Promise дальше вниз */}
                <ProductScreen paramsPromise={params}/>
            </Suspense>
            <Footer/>
        </>

    );
}

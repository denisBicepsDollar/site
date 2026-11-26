import { ProductCard } from "@/entities/product";
import { getProducts } from "@/shared/api";

export function ProductRecomendations({otherProducts}) {
    console.log('2121', otherProducts);
    return (
        <div className="xl:mt-8 xl:block">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">People also bought</h3>
            <div className="mt-6 grid grid-cols-3 gap-4 sm:mt-8">
                {
                    otherProducts.map(product => (
                        <ProductCard product={product}/>
                    ))
                }

            </div>
        </div>
    )
}
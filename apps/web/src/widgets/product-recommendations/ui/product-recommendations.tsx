import { ProductCard } from "@/entities/product";

export function ProductRecomendations({otherProducts}) {
    return (
        <div className="xl:mt-8 xl:block">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">С этим также покупают</h3>
            <div className="mt-6 grid grid-cols-3 gap-4 sm:mt-8">
                {
                    otherProducts.map(product => (
                        <ProductCard key={product.id} product={product}/>
                    ))
                }

            </div>
        </div>
    )
}
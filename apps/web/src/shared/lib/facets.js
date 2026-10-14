import {cacheLife} from "next/cache";
// import {commerce} from "@/shared/lib/commerce";

const EMPTY_FACETS = {
    priceBounds: {min: 0, max: 0},
    variantTypes: [],
    categories: [],
    collections: [],
    brands: [],
};

export async function getFilterFacets() {
    "use cache";
    cacheLife("minutes");
    // Filters are an enhancement — never let a facets failure take down the product list.
    try {
        return EMPTY_FACETS;
        // return await commerce.productFilters();
    } catch {
        return EMPTY_FACETS;
    }
}

const EMPTY_FACETS = {
  priceBounds: { min: 0, max: 0 },
  variantTypes: [],
  categories: [],
  collections: [],
  brands: [],
};

export async function getFilterFacets() {
  try {
    return EMPTY_FACETS;
    // return await commerce.productFilters();
  } catch {
    return EMPTY_FACETS;
  }
}

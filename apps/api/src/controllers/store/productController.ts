import * as productService from "@/services/store/productService.js";
import getLogger from "@/utils/logger";

const moduleName = "productController";

export type SearchParams = {
  size?: string | undefined; // приходит строкой а надо массивом
  category?: string | undefined;
  subcategory?: string | undefined;
  type?: string | undefined;
  minPrice?: string | undefined;
  maxPrice?: string | undefined;
  q?: string | undefined;
  page?: string | undefined;
  sort?: string | undefined;
};

export async function list(req, res) {
  const log = getLogger(moduleName).child({
    function: "list",
  });

  const searchParams: SearchParams = { ...req.query };
  const page = Math.max(1, Number(searchParams.page) || 1);

  // Если это 2-я страница и дальше — не грузим базу лишними запросами за sizes, prices и counts
  if (page > 1) {
    const { items, hasMore, limit } = await productService.listPage(searchParams);

    return res.status(200).json({
      data: items,
      meta: { hasMore, page, limit },
    });
  }

  // Только для первой страницы (или при смене фильтров) считаем всю мету
  const [{ items, hasMore, limit }, sizes, prices, counts] = await Promise.all([
    productService.listPage(searchParams),
    productService.sizes(searchParams),
    productService.prices(searchParams),
    productService.counts(searchParams),
  ]);

  const meta = { sizes, prices, counts, hasMore, page, limit };

  return res.status(200).json({
    data: items,
    meta,
  });
}

export async function getOneProduct(req, res) {
  const log = getLogger(moduleName).child({
    function: "getOne",
  });
  const { slug } = req.params;
  console.log("dasdas7");
  const product = await productService.getOneProduct(slug);
  return res.status(200).json(product);
}

export async function getVariants(req, res) {
  const log = getLogger(moduleName).child({
    function: "getOneVariant",
  });
  const { variantId: variantIds } = req.query;
  const product = await productService.getVariants([variantIds]);
  return res.status(200).json(product);
}

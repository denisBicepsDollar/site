import * as productService from "@/services/store/productService.js";
import getLogger from "@/utils/logger";

const moduleName = "productController";

export type SearchParams = {
  size?: string | undefined; // приходит строкой а надо массивом
  category?: string | undefined;
  subcategory?: string | undefined;
  minPrice?: string | undefined;
  maxPrice?: string | undefined;
  q?: string | undefined;
};

export async function list(req, res) {
  const log = getLogger(moduleName).child({
    function: "list",
  });

  const searchParams: SearchParams = { ...req.query };

  console.log(searchParams);

  const [data, sizes, prices, counts] = await Promise.all([
    productService.list(searchParams),
    productService.sizes(searchParams),
    productService.prices(searchParams),
    productService.counts(searchParams),
  ]);

  const meta = { sizes, prices, counts };

  return res.status(200).json({
    data,
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

import * as productService from "#services/store/productService.js";
import getLogger from "#utils/logger.js";

const moduleName = "productController";

export async function sizes(req, res) {
  const log = getLogger(moduleName).child({
    function: "sizes",
  });

  const products = await productService.list();

  return res.status(200).json(products);
}
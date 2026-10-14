import * as productService from '../services/productService.js';
import getLogger from "../utils/logger.js";

const moduleName = 'productController';

export async function list(req, res) {
    const log = getLogger(moduleName).child({
        function: 'list'
    })

    const products = await productService.list();

    return res.status(200).json(products);
}
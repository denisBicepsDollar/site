import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	productVariantsInProducts: {
		productsInProduct: r.one.productsInProducts({
			from: r.productVariantsInProducts.productId,
			to: r.productsInProducts.id
		}),
		productVariantsImagesInProducts: r.many.productVariantsImagesInProducts(),
	},
	productsInProducts: {
		productVariantsInProducts: r.many.productVariantsInProducts(),
	},
	productVariantsImagesInProducts: {
		productVariantsInProduct: r.one.productVariantsInProducts({
			from: r.productVariantsImagesInProducts.variantId,
			to: r.productVariantsInProducts.id
		}),
	},
}))
import * as shopRepo from '../../db/common/shopRepo.js';
import {getProductById, getProducts} from "../../db/common/shopRepo.js";

export function listProducts() {
    return shopRepo.getProducts();
}
export function getProduct(productId) {
    return shopRepo.getProductById(productId);
}
export function createOrder(order, items) {
    return shopRepo.createOrder(order, items);
}
export const saveContact = (data) => shopRepo.createContact(data);
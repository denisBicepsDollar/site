import * as shopService from "../services/Common/shopService.js";
import {ApiError} from "../utils/ApiError.js";

// GET /api/products
//
export async function list(req, res) {
    console.log(`[shopController] list]`);

    const data = await shopService.listProducts(req.query);
    return res.status(200).json(data);

}
// GET /api/products/:id
export async function get(req, res) {
    console.log('[shopController] get id=', req.params.id);
    const product = await shopService.getProduct(req.params.id);
    if (!product) {
        throw new ApiError(404)
    }
    return res.status(200).json(product);

}
export async function create(req, res) {

    console.log('[shopController] createOrder body:', req.body);

    const { customer, delivery, cart } = req.body; // ← вот что реально приходит

    // собираем ФИО в одну строку
    const customerName = [customer.surname, customer.name, customer.fathername]
        .filter(Boolean).join(' ');

    const pochtaTariffId = delivery.company === 'pochta' ? delivery.tariffId : null;
    const pochtaTariffName = delivery.company === 'pochta' ? delivery.tariffName : null;
    const cdekTariffId = delivery.company === 'cdek' ? delivery.tariffId : null;
    const cdekTariffName = delivery.company === 'cdek' ? delivery.tariffName : null;

    const order = {
        customerName,
        email: customer.email,
        phone: customer.phone,
        comment: customer.comment || null,
        deliveryMethod: delivery.method,
        deliveryCompany: delivery.company,
        deliveryType: delivery.type,
        deliveryPrice: delivery.price,
        address: delivery.address,
        pochtaTariffId,
        pochtaTariffName,
        cdekTariffId,
        cdekTariffName,
    };

    // фронт шлёт cart с полем count, а репо ждёт quantity
    const items = cart.map(i => ({
        productId: i.id,
        variantId: i.variantId || null,
        quantity: i.count,
        volume: i.volume || null,
    }));

    const result = await shopService.createOrder(order, items);
    return res.status(201).json(result);
}
// POST /api/contacts
export async function createContact(req, res) {
    console.log('[shopController] createContact');
    const id = await shopService.saveContact(req.body);
    return res.status(201).json({ id });
}
import * as shopService from "../services/Common/shopService.js";

// GET /api/products
//
export async function list(req, res) {
    try {
        console.log(`[shopController] list]`);

        const data = await shopService.listProducts(req.query);
        return res.status(200).json(data);
    } catch (err) {
        console.error(`[shopController] list error:`, err);
        return res.status(500).json(`Ошибка при получении списка товаров: ${err}`);
    }
}
// GET /api/products/:id
export async function get(req, res) {
    try {
        console.log('[shopController] get id=', req.params.id);
        const product = await shopService.getProduct(req.params.id);
        if (!product) {
            return res.status(404).json({error: 'Товар не найден'});
        }
        return res.status(200).json(product);
    } catch (err) {
        console.error(`[shopController] get error:`, err);
        return res.status(500).json(`Ошибка при получении товара: ${err}`)
    }
}
export async function create(req, res) {
    try {
        console.log('[shopController] createOrder body:', req.body);

        const { customer, delivery, cart } = req.body; // ← вот что реально приходит

        // собираем ФИО в одну строку
        const customerName = [customer.surname, customer.name, customer.fathername]
            .filter(Boolean).join(' ');

        const pochtaTariff = delivery.company === 'pochta' ? delivery.tariffId : null;
        const cdekTariff   = delivery.company === 'cdek' ? delivery.tariffId : null;

        const order = {
            customerName,
            email: customer.email,
            phone: customer.phone,
            deliveryMethod: delivery.method,
            deliveryCompany: delivery.company,
            deliveryType: delivery.type,
            deliveryPrice: delivery.price,
            address: delivery.address,
            pochtaTariff,
            cdekTariff,
        };

        // фронт шлёт cart с полем count, а репо ждёт quantity
        const items = cart.map(i => ({
            productId: i.id,
            quantity: i.count
        }));

        const result = await shopService.createOrder(order, items);
        return res.status(201).json(result);

    } catch (err) {
        console.error('[shopController] createOrder error:', err);
        return res.status(400).json({ error: err.message });
    }
}
// POST /api/contacts
export async function createContact(req, res) {
    try {
        console.log('[shopController] createContact');
        const id = await shopService.saveContact(req.body);
        return res.status(201).json({ id });
    } catch (err) {
        console.error('[shopController] createContact error:', err);
        return res.status(500).json({ error: `Ошибка: ${err.message}` });
    }
}
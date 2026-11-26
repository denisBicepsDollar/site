import {ordersClient} from "@/shared/api/orders/ordersClient.ts";

export interface AdminOrderItem {
    id: number;
    productId: string;
    variantId: string;
    title: string;
    name: string;
    options: string;
    quantity: number;
    price: number;
}

export interface AdminOrder {
    id: number;
    orderNumber: string;
    status: string;
    createdAt: string;
    customer: {
        name: string;
        firstName: string;
        lastName: string;
        initials: string;
        email: string;
        phone: string;
    };
    payment: {
        method: string;
        status: string;
        isPaid: boolean;
    };
    delivery: {
        company: string;
        method: string;
        address: string;
    };
    deliveryPrice: number;
    items: AdminOrderItem[];
    summary: {
        itemsPrice: number;
        deliveryPrice: number;
        totalPrice: number;
    };
    comment: string;
}

interface AdminOrdersResponse {
    data: AdminOrder[];
}

export type AdminOrderStatus = "new" | "confirmed" | "processing" | "shipped" | "completed" | "cancelled";

async function list(): Promise<AdminOrder[]> {
    const response = await ordersClient.get<AdminOrdersResponse>("");
    return response.data.data;
}

async function getById(id: number): Promise<AdminOrder> {
    const response = await ordersClient.get<AdminOrder>(`/${id}`);
    return response.data;
}

async function updateStatus(id: number, status: AdminOrderStatus): Promise<AdminOrder> {
    const response = await ordersClient.patch<AdminOrder>(`/${id}/status`, {status});
    return response.data;
}

export const ordersApi = {list, getById, updateStatus};

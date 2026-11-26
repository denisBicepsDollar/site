import {productsClient} from "@/shared/api/products/productsClient.ts";

export interface AdminMessage {
    id: number;
    name: string | null;
    email: string | null;
    phone: string | null;
    message: string;
    createdAt: string | null;
}

interface MessagesResponse {
    data: AdminMessage[];
}

async function list(): Promise<AdminMessage[]> {
    const response = await productsClient.get<MessagesResponse>("/../messages");
    return Array.isArray(response.data?.data) ? response.data.data : [];
}

export const messagesApi = {list};

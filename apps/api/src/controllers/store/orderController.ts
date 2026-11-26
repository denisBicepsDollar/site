import type { Request, Response } from "express";
import * as orderService from "@/services/store/orderService";

export async function create(req: Request, res: Response) {
  const result = await orderService.createOrder(
    (req.body ?? {}) as orderService.CreateOrderPayload,
  );

  if (result.status !== 201) {
    return res.status(result.status).json({
      status: "error",
      ...result.error,
    });
  }

  return res.status(201).json(result.data);
}

export async function listAdmin(_req: Request, res: Response) {
  const orders = await orderService.listAdminOrders();
  return res.status(200).json({data: orders});
}

export async function getAdmin(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({code: "INVALID_ORDER_ID", message: "Некорректный номер заказа"});
  }

  const order = await orderService.getAdminOrderById(id);
  if (!order) {
    return res.status(404).json({code: "ORDER_NOT_FOUND", message: "Заказ не найден"});
  }
  return res.status(200).json(order);
}

export async function updateAdminStatus(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({code: "INVALID_ORDER_ID", message: "Некорректный номер заказа"});
  }

  const result = await orderService.updateAdminOrderStatus(id, req.body?.status);
  if (!result.ok && result.reason === "not_found") {
    return res.status(404).json({code: "ORDER_NOT_FOUND", message: "Заказ не найден"});
  }
  if (!result.ok) {
    return res.status(409).json({
      code: "INVALID_ORDER_TRANSITION",
      message: "Невозможно перевести заказ в этот статус",
      currentStatus: result.currentStatus,
    });
  }
  return res.status(200).json(result.order);
}

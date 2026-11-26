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

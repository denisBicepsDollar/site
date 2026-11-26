import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { status: "error", message: "Некорректный формат данных заказа" },
        { status: 400 },
      );
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
    const res = await fetch(`${backendUrl}/api/v1/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    const data = await res.json().catch(() => null);
    if (!data) {
      return NextResponse.json(
        { status: "error", message: "Некорректный ответ сервера" },
        { status: res.status || 502 },
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    const isTimeout =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");
    return NextResponse.json(
      {
        status: "error",
        message: isTimeout
          ? "Превышено время ожидания ответа от сервера"
          : "Сервер оформления заказов недоступен",
      },
      { status: isTimeout ? 504 : 500 },
    );
  }
}

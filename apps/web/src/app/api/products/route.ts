// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams.toString();

  try {
    // Используем серверную переменную окружения (без NEXT_PUBLIC_)
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";

    const res = await fetch(`${backendUrl}/api/v1/products?${searchParams}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Ошибка Express" },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Сервер недоступен" }, { status: 500 });
  }
}

// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_PROXY_PARAMS = new Set([
  "q",
  "size",
  "minPrice",
  "maxPrice",
  "sort",
  "category",
  "subcategory",
  "type",
  "page",
]);

export async function GET(request: NextRequest) {
  const forwardParams = new URLSearchParams();
  request.nextUrl.searchParams.forEach((value, key) => {
    if (!ALLOWED_PROXY_PARAMS.has(key)) return;
    const trimmed = value.trim();
    if (!trimmed) return;
    if (key === "sort" && trimmed === "score") return;
    forwardParams.set(key, trimmed);
  });

  const searchParams = forwardParams.toString();

  try {
    // Используем серверную переменную окружения (без NEXT_PUBLIC_)
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";

    const targetUrl = searchParams
      ? `${backendUrl}/api/v1/products?${searchParams}`
      : `${backendUrl}/api/v1/products`;

    const res = await fetch(targetUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
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
    const isTimeout =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");
    return NextResponse.json(
      { error: isTimeout ? "Таймаут запроса" : "Сервер недоступен" },
      { status: isTimeout ? 504 : 500 },
    );
  }
}

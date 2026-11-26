import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const variantIds = request.nextUrl.searchParams
    .getAll("variantId")
    .map((id) => id.trim())
    .filter(Boolean);

  if (variantIds.length === 0) {
    return NextResponse.json([]);
  }

  try {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
    const query = variantIds
      .map((id) => `variantId=${encodeURIComponent(id)}`)
      .join("&");

    const res = await fetch(
      `${backendUrl}/api/v1/products/variants/by-ids?${query}`,
      {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      },
    );

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

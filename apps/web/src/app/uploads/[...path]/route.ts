import { NextRequest, NextResponse } from "next/server";

const getBackendUrl = () =>
  process.env.BACKEND_URL || "http://localhost:3000";

function sanitizeUploadSegments(segments: string[] | undefined): string | null {
  if (!Array.isArray(segments) || segments.length === 0) {
    return null;
  }

  const encoded: string[] = [];
  for (const segment of segments) {
    if (
      !segment ||
      segment === "." ||
      segment === ".." ||
      segment.includes("/") ||
      segment.includes("\\") ||
      segment.includes("\0") ||
      segment.startsWith(".")
    ) {
      return null;
    }
    encoded.push(encodeURIComponent(segment));
  }

  return encoded.join("/");
}

async function proxyUploadRequest(
  method: "GET" | "HEAD",
  segments: string[] | undefined,
) {
  const safePath = sanitizeUploadSegments(segments);
  if (!safePath) {
    return NextResponse.json(
      { error: "Invalid file path" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const targetUrl = `${getBackendUrl()}/uploads/${safePath}`;
    const res = await fetch(targetUrl, {
      method,
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return new NextResponse(null, {
        status: res.status,
        headers: { "Cache-Control": "no-store" },
      });
    }

    const headers = new Headers();
    const passthroughHeaders = [
      "content-type",
      "content-length",
      "cache-control",
      "etag",
      "last-modified",
      "accept-ranges",
    ];
    for (const name of passthroughHeaders) {
      const value = res.headers.get(name);
      if (value) headers.set(name, value);
    }
    if (!headers.has("cache-control")) {
      headers.set("cache-control", "public, max-age=3600");
    }

    if (method === "HEAD") {
      return new NextResponse(null, { status: res.status, headers });
    }

    const body = await res.arrayBuffer();
    return new NextResponse(body, { status: res.status, headers });
  } catch (error) {
    const isTimeout =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");
    return new NextResponse(null, {
      status: isTimeout ? 504 : 502,
      headers: { "Cache-Control": "no-store" },
    });
  }
}

type RouteContext = {
  params: Promise<{ path?: string[] }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyUploadRequest("GET", path);
}

export async function HEAD(_request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyUploadRequest("HEAD", path);
}

import { NextResponse, type NextRequest } from "next/server";
import { resolveProxyableImageUrl } from "@/lib/image-proxy";

function filenameFor(url: URL) {
  const last = url.pathname.split("/").pop();
  return last && last.includes(".") ? last : "image.jpg";
}

async function proxyUpstream(request: NextRequest, method: "GET" | "HEAD") {
  const target = resolveProxyableImageUrl(request.nextUrl.searchParams.get("url"));

  if (!target) {
    return NextResponse.json(
      { error: "Invalid or disallowed image URL" },
      { status: 400 },
    );
  }

  const upstream = await fetch(target, { method, cache: "no-store" });

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "Image request failed" },
      { status: upstream.status },
    );
  }

  const headers = new Headers();
  const contentType = upstream.headers.get("content-type");
  const contentLength = upstream.headers.get("content-length");
  if (contentType) headers.set("Content-Type", contentType);
  if (contentLength) headers.set("Content-Length", contentLength);

  if (method === "GET") {
    headers.set("Content-Disposition", `attachment; filename="${filenameFor(target)}"`);
    return new NextResponse(upstream.body, { headers });
  }

  return new NextResponse(null, { headers });
}

// Both requests exist for the same reason /api/discovery and /api/search
// do — cdn.nekosapi.com and safebooru.org send no CORS headers, so neither
// a `fetch()`-based download nor a plain HEAD-for-file-size check can be
// made directly from the browser.
export function GET(request: NextRequest) {
  return proxyUpstream(request, "GET");
}

export function HEAD(request: NextRequest) {
  return proxyUpstream(request, "HEAD");
}

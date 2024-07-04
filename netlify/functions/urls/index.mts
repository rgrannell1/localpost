import type { Context } from "@netlify/functions";

const ALLOWED_METHODS = ["GET", "PUT", "POST", "PATCH", "SEARCH"];

class ContentUrls {
  static toPageUrl(content: string) {
    return `https://localpost.rgrannell.xyz?content=${
      encodeURIComponent(content)
    }`;
  }
  static toDataUrl(content: string) {
    return `data:text/plain;base64,${btoa(content)}`;
  }
}

/*
 * Convert a content-string to a page-url and a data-url.
 */
export default async (req: Request, _: Context) => {
  if (!ALLOWED_METHODS.includes(req.method.toUpperCase())) {
    return new Response(
      `Method Not Allowed. Use ${ALLOWED_METHODS.join(", ")}`,
      {
        status: 405,
      },
    );
  }

  const contentType = req.headers.get("Content-Type");

  const parsedUrl = new URL(req.url);
  const contentParams = parsedUrl.searchParams.get("content") ?? "";
  const content = contentParams ?? await req.text();

  const pageUrl = ContentUrls.toPageUrl(content);
  const dataUrl = ContentUrls.toDataUrl(content);

  if (contentType?.startsWith("application/json")) {
    return new Response(JSON.stringify({
      pageUrl,
      dataUrl,
    }));
  } else {
    return new Response(`${pageUrl}\n${dataUrl}`);
  }
};

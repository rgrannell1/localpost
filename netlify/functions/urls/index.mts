import type { Context } from "@netlify/functions";

const ALLOWED_METHODS = ["GET", "PUT", "POST", "PATCH", "SEARCH"];
const HELP_MESSAGE = `
**Localpost**

  Localpost encodes your text-notes as URLS, allowing you to share them with others without storing them somewhere first.

**Routes**

  Contact any of the followng routes

    GET    https://localpost.rgrannell.xyz/api
    POST   https://localpost.rgrannell.xyz/api
    PUT    https://localpost.rgrannell.xyz/api
    PATCH  https://localpost.rgrannell.xyz/api
    SEARCH https://localpost.rgrannell.xyz/api

  Using curl, wget, your browser, or any other HTTP client.

**Sending Content**

  Either send your content:

  - in the request-body (preferred if you're using POST/PUT/PATCH/SEARCH)
  - a query parameter ?content=<note> if your're using GET

**Response**

  If you sent a request with Content-Type: application/json, you will receive
  a response like:

    {
      "pageUrl": "https://localpost.rgrannell.xyz/api?content=hello-world",
      "dataUrl": "data:text/plain;base64,aGVsbG8td29ybGQ="
    }

  Otherwise the response will be plain-text like:

    https://localpost.rgrannell.xyz/api?content=hello-world
    data:text/plain;base64,aGVsbG8td29ybGQ=

  Errors Codes:
    405 - Method Not Allowed
    422 - Unprocessable Entity

**Examples**

  curl -q https://localpost.rgrannell.xyz/api?content=hello-world

  curl -q -H 'Content-Type: application/json' https://localpost.rgrannell.xyz/api\?content\=hello-world

  curl -X POST -H 'Content-Type: application/json' --data 'hello-world' https://localpost.rgrannell.xyz/api

**Privacy**

  I have not enabled any additional tracking beyond Netlify's defaults. Localpost does not capture, view or track the notes you submit. I will track the total number of requests made to this API & the site's bandwidth usage.

  Localpost is open-source and available at:

  https://github.com/rgrannell1/localpost
`

class ContentUrls {
  static toPageUrl(content: string) {
    return `https://localpost.rgrannell.xyz/api?content=${
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
  const reqBody = await req.text();

  if (contentParams && reqBody) {
    return new Response("Please provide content in either the query or the request body, not both.", {
      status: 422
    });
  }

  const content = contentParams ? contentParams : reqBody;

  const pageUrl = ContentUrls.toPageUrl(content);
  const dataUrl = ContentUrls.toDataUrl(content);

  if (contentType?.startsWith("application/json")) {
    return new Response(JSON.stringify({
      pageUrl,
      dataUrl,
    }));
  } else if (!content) {
    return new Response(HELP_MESSAGE, {
      status: 422,
    });
  } else {
    return new Response(`${pageUrl}\n${dataUrl}`);
  }
};

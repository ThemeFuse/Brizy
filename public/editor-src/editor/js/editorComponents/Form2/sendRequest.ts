// How the published forms send a submit and read the reply.

export type SendResult = { kind: "done"; data: unknown } | { kind: "failed" };

export interface SendCallbacks {
  done: (data: unknown) => void;
  error: VoidFunction;
  always: VoidFunction;
}

interface SendBody {
  body: FormData | string;
  contentType: string | undefined;
}

const FAILED: SendResult = { kind: "failed" };

function isCrossDomain(url: string): boolean {
  const origin = document.createElement("a");
  const target = document.createElement("a");

  origin.href = window.location.href;

  try {
    target.href = url;

    return (
      `${origin.protocol}//${origin.host}` !==
      `${target.protocol}//${target.host}`
    );
  } catch {
    return true;
  }
}

function readXml(text: string): SendResult {
  if (!text) {
    return { kind: "done", data: undefined };
  }

  try {
    const xml = new DOMParser().parseFromString(text, "text/xml");

    if (xml.getElementsByTagName("parsererror")[0]) {
      return FAILED;
    }
  } catch {
    return FAILED;
  }

  return { kind: "done", data: undefined };
}

function readReply(
  status: number,
  contentType: string,
  text: string
): SendResult {
  const isSuccess = (status >= 200 && status < 300) || status === 304;

  if (!isSuccess) {
    return FAILED;
  }

  if (status === 204 || status === 304) {
    return { kind: "done", data: undefined };
  }

  if (/\bxml\b/.test(contentType)) {
    return readXml(text);
  }

  if (/\bhtml/.test(contentType)) {
    return { kind: "done", data: text };
  }

  if (/\bjson\b/.test(contentType)) {
    try {
      const data: unknown = JSON.parse(text);

      return { kind: "done", data };
    } catch {
      return FAILED;
    }
  }

  return { kind: "done", data: text };
}

// Fields as `application/x-www-form-urlencoded`; a field without a value is left out.
export function encodeFields(
  fields: Record<string, string | undefined>
): string {
  return Object.entries(fields)
    .flatMap(([key, value]) =>
      value === undefined
        ? []
        : [`${encodeURIComponent(key)}=${encodeURIComponent(value)}`]
    )
    .join("&")
    .replace(/%20/g, "+");
}

export const URL_ENCODED = "application/x-www-form-urlencoded; charset=UTF-8";

export function sendRequest(
  url: string,
  { body, contentType }: SendBody,
  { done, error, always }: SendCallbacks
): Promise<SendResult> {
  const target = (url || window.location.href).replace(
    /^\/\//,
    `${window.location.protocol}//`
  );
  const headers: Record<string, string> = { Accept: "*/*" };

  if (contentType !== undefined) {
    headers["Content-Type"] = contentType;
  }

  if (!isCrossDomain(target)) {
    headers["X-Requested-With"] = "XMLHttpRequest";
  }

  return fetch(target, { method: "POST", headers, body })
    .then(async (response) =>
      readReply(
        response.status,
        response.headers.get("Content-Type") ?? "",
        await response.text()
      )
    )
    .catch(() => FAILED)
    .then((result) => {
      if (result.kind === "done") {
        done(result.data);
      } else {
        error();
      }

      always();

      return result;
    });
}

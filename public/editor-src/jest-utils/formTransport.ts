// The network as a form submit sees it; the only file that knows which API the forms send with.

import { z } from "zod";

export type TransportReply =
  | {
      kind: "response";
      status: number;
      contentType: string | undefined;
      body: string;
    }
  | { kind: "networkError" };

type TransportBody =
  | { kind: "form"; entries: Array<[string, string]> }
  | { kind: "text"; value: string };

interface TransportRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: TransportBody;
}

export interface Transport {
  requests: TransportRequest[];
  restore: VoidFunction;
}

function bodyOf(body: FormData | string): TransportBody {
  if (body instanceof FormData) {
    return {
      kind: "form",
      entries: [...body.entries()].map(([name, value]) => [
        name,
        typeof value === "string" ? value : `file:${value.name}`
      ])
    };
  }

  return { kind: "text", value: body };
}

const initSchema = z.object({
  method: z.string(),
  headers: z.record(z.string()),
  body: z.union([z.instanceof(FormData), z.string()])
});

export function stubTransport(reply: TransportReply): Transport {
  const requests: TransportRequest[] = [];
  const original = Object.getOwnPropertyDescriptor(window, "fetch");

  const fetch = (url: unknown, init: unknown): Promise<unknown> => {
    const { method, headers, body } = initSchema.parse(init);

    requests.push({
      method,
      url: String(url),
      headers: Object.fromEntries(
        Object.entries(headers).map(([name, value]) => [
          name.toLowerCase(),
          value
        ])
      ),
      body: bodyOf(body)
    });

    if (reply.kind === "networkError") {
      return Promise.reject(new TypeError("Failed to fetch"));
    }

    return Promise.resolve({
      status: reply.status,
      headers: {
        get: (name: string) =>
          name.toLowerCase() === "content-type"
            ? (reply.contentType ?? null)
            : null
      },
      text: () => Promise.resolve(reply.body)
    });
  };

  Object.defineProperty(window, "fetch", {
    configurable: true,
    writable: true,
    value: fetch
  });

  return {
    requests,
    restore: () => {
      if (original) {
        Object.defineProperty(window, "fetch", original);
      } else {
        Reflect.deleteProperty(window, "fetch");
      }
    }
  };
}

// The reply arrives on a later turn; a few turns drain everything it sets off.
export async function settleTransport(): Promise<void> {
  for (let turn = 0; turn < 4; turn++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

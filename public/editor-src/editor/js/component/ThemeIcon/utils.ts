import { templateIconUrl } from "visual/utils/icons";
import { Dictionary } from "visual/types/utils";
import { decrypt } from "./utils-node";

export interface ParsedSVG {
  innerHTML: string;
  attr: Record<string, unknown>;
}

export async function fetchIcon(
  type: string,
  name: string,
  abortController?: AbortController
): Promise<string> {
  const r = await fetch(templateIconUrl(type, name), {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    signal: abortController?.signal
  });
  return await r.text();
}

export function decryptIcon(icon: string): string | undefined {
  if (/^<svg/.test(icon)) {
    return icon;
  } else {
    try {
      return decryptIcon(atob(decrypt(icon)));
    } catch (e) {
      return undefined;
    }
  }
}

export function parseSVG(svg: string): ParsedSVG | undefined {
  if (!svg) {
    return undefined;
  }

  const doc = new DOMParser().parseFromString(svg, "text/html");
  const { innerHTML, attributes } = {
    innerHTML: doc.body.firstElementChild?.innerHTML,
    attributes: doc.body.firstElementChild?.attributes
  };

  if (!innerHTML) {
    return undefined;
  }

  const attr: Record<string, unknown> = {};

  if (attributes) {
    const attributesToJSX: Dictionary<string> = {
      "xmlns:xlink": "xmlnsXlink",
      "xml:space": "xmlSpace"
    };

    for (let i = 0; i < attributes.length; i++) {
      const { name, value } = attributes[i];
      const normalizedName = attributesToJSX[name] || name;

      attr[normalizedName] = value;
    }
  }

  return {
    attr,
    innerHTML
  };
}

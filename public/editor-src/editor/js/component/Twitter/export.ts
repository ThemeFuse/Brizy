import { DeviceMode, ExportFunction } from "visual/types";
import { makeAttr, makeDataAttrString } from "visual/utils/i18n/attribute";
import { read } from "visual/utils/reader/string";
import { decodeFromString } from "visual/utils/string";

interface Heights {
  desktop: number;
  tablet: number;
  mobile: number;
}

const getCurrentDevice = (): DeviceMode => {
  const { innerWidth } = window;
  let device: DeviceMode = "desktop";

  if (innerWidth > 992) {
    device = "desktop";
  } else if (innerWidth < 992 && innerWidth > 768) {
    device = "tablet";
  } else if (innerWidth < 768) {
    device = "mobile";
  }

  return device;
};

let lastCurrentDevice = getCurrentDevice();

const initTwitter = (doc: Document, id: string): Window["twttr"] => {
  const t: Window["twttr"] = (window.twttr || {}) as Window["twttr"];

  if (doc.getElementById(id)) {
    return t;
  }

  const js = doc.createElement("script");
  js.setAttribute("id", id);
  js.setAttribute("src", "https://platform.twitter.com/widgets.js");
  doc.body.appendChild(js);

  return t;
};

const updateTwitterEmbed = (
  nodes: Array<HTMLElement>,
  device: DeviceMode
): void => {
  nodes.forEach((node) => {
    const iframe = node.querySelector("iframe");

    if (iframe) {
      try {
        const _heights = read(node.getAttribute(makeAttr("heights"))) ?? "";
        const heights = decodeFromString<Heights>(_heights);
        const newIframeUrl = new URL(iframe.src);
        const types = heights[device];

        newIframeUrl.searchParams.set("maxHeight", `${types}`);

        iframe.src = `${newIframeUrl}`;
      } catch (e) {
        console.error("Invalid attribute heights", e);
      }
    }
  });
};

const resize = (nodes: Array<HTMLElement>): void => {
  const device = getCurrentDevice();

  if (device !== lastCurrentDevice) {
    lastCurrentDevice = device;
    updateTwitterEmbed(nodes, lastCurrentDevice);
  }
};

const fn: ExportFunction = ($node) => {
  const node = $node.get(0);
  if (!node) return;

  const twitterLaunch = [
    ...node.querySelectorAll<HTMLDivElement>(".brz-twitter")
  ];

  if (twitterLaunch.length > 0) {
    const twitterEmbeds = twitterLaunch.filter(
      (node) => node.dataset.type === "embed"
    );

    if (twitterEmbeds.length > 0) {
      if (lastCurrentDevice !== "desktop") {
        twitterEmbeds.forEach((node) => {
          try {
            const link = node.querySelector<HTMLElement>(
              makeDataAttrString({ name: "height" })
            );

            if (link) {
              const _heights =
                read(node.getAttribute(makeAttr("heights"))) ?? "";
              const heights = decodeFromString<Heights>(_heights);
              link.dataset.height = `${heights[lastCurrentDevice]}`;
            }
          } catch (e) {
            console.error("Invalid attribute heights", e);
          }
        });
      }

      window.addEventListener("resize", () => resize(twitterEmbeds));
    }

    window.twttr = initTwitter(document, "twitter-wjs");
  }
};

export default fn;

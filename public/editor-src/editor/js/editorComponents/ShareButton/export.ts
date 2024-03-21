import { makeAttr } from "visual/utils/i18n/attribute";
import * as Str from "visual/utils/reader/string";
import { TargetUrl } from "./types";
import { getNetworkInfo, getNetworkType } from "./utils";

export default function ($node: JQuery): void {
  const node = $node.get(0);

  if (!node) return;

  node.querySelectorAll(".brz-shareButton__item").forEach((item) => {
    const network = getNetworkType(item.getAttribute(makeAttr("network")));
    const href = Str.read(item.getAttribute(makeAttr("href"))) ?? "";
    const target =
      Str.read(item.getAttribute(makeAttr("target"))) ?? TargetUrl.CurrentUrl;

    if (network) {
      const networkUrl = getNetworkInfo(network).networkUrl;
      const currentUrl =
        target === TargetUrl.CurrentUrl
          ? encodeURIComponent(window.location.origin)
          : encodeURIComponent(href);

      const finalUrl = networkUrl + currentUrl;

      item.addEventListener("click", () => {
        window.open(finalUrl, "_blank", "width=600, height=400");
      });
    }
  });
}

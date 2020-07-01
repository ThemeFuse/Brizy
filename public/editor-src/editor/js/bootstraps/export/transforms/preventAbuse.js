import Config from "visual/global/Config";
import { URL } from "url";

export default function preventAbuse($) {
  const { site, siteOriginal } = Config.get("urls");
  const siteBase = getBaseUrl(site);
  const siteOriginalBase = getBaseUrl(siteOriginal);

  $("a[href]").each(function() {
    const $this = $(this);
    const href = $this.attr("href") || "";

    if (
      href[0] &&
      href[0] !== "#" &&
      href[0] !== "/" &&
      !href.includes(siteBase) &&
      !href.includes(siteOriginalBase)
    ) {
      $this.attr("href", "#");
    }
  });
}

function getBaseUrl(url) {
  const { hostname } = new URL(url);
  const split = hostname.split(".");

  if (split.length === 2) {
    return hostname;
  } else if (split.length > 2) {
    // attempt to drop any subdomains like www.
    const l = split.length;
    return split[l - 2] + "." + split[l - 1];
  }

  return hostname;
}

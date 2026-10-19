import { load as cheerioLoad } from "cheerio";
import { makeAttr } from "visual/utils/i18n/attribute";
import { consentCategorySchema } from "./schemas";
import type { ConsentCategory } from "./types";

const CONSENT_ATTR = makeAttr("consent");
const FALLBACK_CATEGORY: ConsentCategory = "auto";

export function applyConsentGating(
  html: string,
  category: string | undefined
): string {
  if (!html) {
    return html;
  }

  const parsed = consentCategorySchema.safeParse(category);
  const resolved = parsed.success ? parsed.data : FALLBACK_CATEGORY;

  if (resolved === "auto") {
    return html;
  }

  const $ = cheerioLoad(html, null, false);

  $("script[src]").each((_, el) => {
    const $el = $(el);

    if ($el.attr(CONSENT_ATTR) !== undefined) {
      return;
    }

    $el.attr(CONSENT_ATTR, resolved);
  });

  return $.root().html() ?? html;
}

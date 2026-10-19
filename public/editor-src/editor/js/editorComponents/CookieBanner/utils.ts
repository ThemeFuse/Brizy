import { t } from "visual/utils/i18n";
import { makeAttr } from "visual/utils/i18n/attribute";
import { buildConsentModeSignal } from "./consent/consentMode";
import {
  CONSENT_CATEGORY_KEYS,
  type Consent,
  type ConsentCategories
} from "./consent/model";
import type { CookieBannerCategoryKey } from "./types";

const categoryToggleSelector = (key: keyof ConsentCategories): string =>
  `[${makeAttr("cc")}="category-toggle"][${makeAttr("cc-category")}="${key}"]`;

export const categoriesWithAllSetTo = (
  granted: boolean
): ConsentCategories => ({
  preferences: granted,
  statistics: granted,
  marketing: granted,
  other: granted
});

export function readCategoriesFromDialog(dialog: Element): ConsentCategories {
  const categories = categoriesWithAllSetTo(false);

  CONSENT_CATEGORY_KEYS.forEach((key) => {
    const input = dialog.querySelector<HTMLInputElement>(
      categoryToggleSelector(key)
    );

    categories[key] = input?.checked ?? false;
  });

  return categories;
}

export function seedDialog(
  dialog: Element,
  consent: Consent | undefined
): void {
  CONSENT_CATEGORY_KEYS.forEach((key) => {
    const input = dialog.querySelector<HTMLInputElement>(
      categoryToggleSelector(key)
    );

    if (input) {
      input.checked = consent?.c[key] ?? false;
    }
  });
}

/**
 * Activates gated `<script type="text/plain" data-brz-consent="…">` tags for
 * the given granted categories, document-wide (scripts can live anywhere on
 * the published page, not just inside the banner root) and idempotently
 * (marks the original so a re-run — e.g. accepting more categories later —
 * never re-executes the same script twice).
 */
export function activateScripts(categories: string[]): void {
  if (categories.length === 0) {
    return;
  }

  const gatedScripts = document.querySelectorAll<HTMLScriptElement>(
    `script[type="text/plain"][${makeAttr("consent")}]`
  );

  gatedScripts.forEach((original) => {
    if (original.hasAttribute(makeAttr("consent-activated"))) {
      return;
    }

    const category = original.getAttribute(makeAttr("consent"));

    if (!category || !categories.includes(category)) {
      return;
    }

    const activated = document.createElement("script");
    const origType = original.getAttribute(makeAttr("orig-type"));

    // Attribute order is correctness here, not style: on a published page the
    // blocker's createElement gate (consent/blockerAsset.ts) fires at src-set
    // time and classifies a still-UNLABELED clone by host — an unknown
    // third-party host resolves to "other". With `other` denied (partial
    // consent) such a clone is re-neutralized back to text/plain and never
    // runs. So the label must already be on the clone before its `src`: copy
    // every other attribute first, `src` last.
    Array.from(original.attributes).forEach((attr) => {
      if (
        attr.name === "type" ||
        attr.name === makeAttr("orig-type") ||
        attr.name === "src"
      ) {
        return;
      }

      activated.setAttribute(attr.name, attr.value);
    });

    const src = original.getAttribute("src");

    if (src !== null) {
      activated.setAttribute("src", src);
    }

    if (origType) {
      // Restore the type the mutation-observer interceptor neutralized (e.g.
      // "module") instead of defaulting to a classic script.
      activated.type = origType;
    }

    if (activated.src) {
      // async=false preserves relative execution order among multiple
      // re-injected external scripts (dynamically-inserted scripts default
      // to async-like, out-of-order execution otherwise).
      activated.async = false;
    }

    // Inline content (a `src` script simply fetches/executes on insertion,
    // no text to copy).
    activated.text = original.text;

    original.setAttribute(makeAttr("consent-activated"), "true");
    original.insertAdjacentElement("afterend", activated);
  });
}

/**
 * Dispatches a Google Consent Mode v2 update: prefers `window.gtag` when
 * present, otherwise falls back to pushing the call onto `window.dataLayer`
 * the way Google's own bootstrap does it — `function gtag(){
 * dataLayer.push(arguments); }`, i.e. an `arguments` object, not an array —
 * otherwise no-ops. Never throws.
 */
export function dispatchConsentModeUpdate(categories: ConsentCategories): void {
  try {
    const signal = buildConsentModeSignal(categories);

    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", signal);
      return;
    }

    if (Array.isArray(window.dataLayer)) {
      const dataLayer = window.dataLayer;

      // gtag.js / gtm.js treat ONLY an `arguments` object on the queue as a
      // gtag command (`[object Arguments]`); a real Array is parsed as a legacy
      // "call global method by dotted path" directive and the consent update
      // is silently dropped. Hence a `function` expression (arrows have no
      // `arguments`) with no declared params — this mirrors Google's own
      // bootstrap `function gtag(){dataLayer.push(arguments);}` exactly.
      const gtag: GoogleTag.Gtag = function () {
        // Rest params would produce a real Array — the one shape gtag.js drops.
        // biome-ignore lint/complexity/noArguments: gtag.js parses only an Arguments object as a consent command; a real Array is silently dropped
        dataLayer.push(arguments);
      };

      gtag("consent", "update", signal);
    }
  } catch (_) {
    // Consent Mode dispatch is best-effort — it must never break the consent
    // flow (cookie persistence, script activation) itself.
  }
}

export const getCategories = (): Array<{
  key: CookieBannerCategoryKey;
  label: string;
  description: string;
  locked: boolean;
}> => [
  {
    key: "necessary",
    label: t("Necessary"),
    description: t("Required for the website to function. Always on."),
    locked: true
  },
  {
    key: "preferences",
    label: t("Preferences"),
    description: t(
      "Remember choices you make, like language or region, for a better experience."
    ),
    locked: false
  },
  {
    key: "statistics",
    label: t("Statistics"),
    description: t(
      "Help us understand how visitors use the website through anonymous, aggregated data."
    ),
    locked: false
  },
  {
    key: "marketing",
    label: t("Marketing"),
    description: t(
      "Used to show you relevant ads and measure their performance."
    ),
    locked: false
  },
  {
    key: "other",
    label: t("Other"),
    description: t(
      "Scripts that do not fit into any of the other categories or are not yet classified."
    ),
    locked: false
  }
];

const OVERLAYS_CONTAINER_ID = "brz-overlays";

export function getOrCreateOverlaysContainer(): HTMLElement {
  const existing = document.getElementById(OVERLAYS_CONTAINER_ID);

  if (existing) {
    return existing;
  }

  const container = document.createElement("div");
  container.id = OVERLAYS_CONTAINER_ID;
  document.body.appendChild(container);

  return container;
}

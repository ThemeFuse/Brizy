// Pure consent data model + parsing. No DOM/window access here on purpose —
// keeps this module unit-testable without jsdom and reusable outside the
// cookie-transport concern (see ./cookie.ts).

import type { z } from "zod";
import { type consentCategoriesSchema, consentSchema } from "./schemas";

export type ConsentCategories = z.infer<typeof consentCategoriesSchema>;

export type Consent = z.infer<typeof consentSchema>;

export const CONSENT_CATEGORY_KEYS: ReadonlyArray<keyof ConsentCategories> = [
  "preferences",
  "statistics",
  "marketing",
  "other"
];

/**
 * Strict parse: valid JSON, `v === 1`, numeric `ts`, and all four category
 * booleans present. Anything else (garbage, wrong version, missing keys,
 * absent input) parses to `undefined` — treated the same as "no consent yet".
 * A cookie written in an older shape (3 keys, no `other`) therefore fails
 * closed and the banner reshows once; no migration is provided.
 */
export function parseConsent(raw: string | undefined): Consent | undefined {
  if (!raw) {
    return undefined;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch (_) {
    return undefined;
  }

  const result = consentSchema.safeParse(parsed);

  return result.success ? result.data : undefined;
}

export function serializeConsent(c: ConsentCategories, ts: number): string {
  const consent: Consent = { v: 1, ts, c };

  return JSON.stringify(consent);
}

/**
 * Category keys granted by a consent record, "necessary" always included
 * (it is implied, never stored).
 */
export function grantedCategories(consent: Consent): string[] {
  const categories: string[] = ["necessary"];

  CONSENT_CATEGORY_KEYS.forEach((key) => {
    if (consent.c[key]) {
      categories.push(key);
    }
  });

  return categories;
}

export interface ConsentDiff {
  revoked: boolean;
  newlyGranted: string[];
}

/**
 * Compares a previous consent record (or `undefined` when none existed yet) to a
 * newly chosen set of categories.
 * - `revoked`: true iff any category flips granted -> denied (never true when
 *   `prev` is `undefined`, since nothing was granted before).
 * - `newlyGranted`: categories that flip denied/absent -> granted (when
 *   `prev` is `undefined`, every granted category in `next` counts as new).
 */
export function diffConsent(
  prev: Consent | undefined,
  next: ConsentCategories
): ConsentDiff {
  let revoked = false;
  const newlyGranted: string[] = [];

  CONSENT_CATEGORY_KEYS.forEach((key) => {
    const was = prev?.c[key] ?? false;
    const is = next[key];

    if (was && !is) {
      revoked = true;
    }

    if (!was && is) {
      newlyGranted.push(key);
    }
  });

  return { revoked, newlyGranted };
}

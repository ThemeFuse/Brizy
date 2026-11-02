import {
  Consent,
  ConsentCategories,
  diffConsent,
  grantedCategories,
  parseConsent,
  serializeConsent
} from "../model";

describe("parseConsent", () => {
  test("round-trips a value produced by serializeConsent", () => {
    const categories: ConsentCategories = {
      preferences: true,
      statistics: false,
      marketing: true,
      other: false
    };
    const serialized = serializeConsent(categories, 1700000000000);

    expect(parseConsent(serialized)).toEqual({
      v: 1,
      ts: 1700000000000,
      c: categories
    });
  });

  // Every malformed or absent cookie fails closed, exactly like "no consent
  // yet": the banner reshows. A legacy 3-key cookie (no `other`) is one of
  // them — no migration is provided.
  it.each([
    { case: "non-JSON text", raw: "not json" },
    { case: "broken JSON", raw: "{broken" },
    { case: "JSON null", raw: "null" },
    { case: "a JSON number", raw: "42" },
    { case: "a JSON string", raw: '"a string"' },
    { case: "an empty string", raw: "" },
    { case: "absent input", raw: undefined },
    {
      case: "a wrong version",
      raw: JSON.stringify({
        v: 2,
        ts: 1700000000000,
        c: { preferences: true, statistics: true, marketing: true, other: true }
      })
    },
    {
      case: "a legacy 3-key cookie (no `other`)",
      raw: JSON.stringify({
        v: 1,
        ts: 1700000000000,
        c: { preferences: true, statistics: true, marketing: true }
      })
    },
    {
      case: "a non-numeric ts",
      raw: JSON.stringify({
        v: 1,
        ts: "1700000000000",
        c: { preferences: true, statistics: true, marketing: true, other: true }
      })
    },
    {
      case: "a non-boolean category",
      raw: JSON.stringify({
        v: 1,
        ts: 1700000000000,
        c: {
          preferences: "yes",
          statistics: true,
          marketing: true,
          other: true
        }
      })
    },
    {
      case: "a non-boolean `other`",
      raw: JSON.stringify({
        v: 1,
        ts: 1700000000000,
        c: {
          preferences: true,
          statistics: true,
          marketing: true,
          other: "yes"
        }
      })
    }
  ])("returns undefined for $case", ({ raw }) => {
    expect(parseConsent(raw)).toBeUndefined();
  });

  test("drops unknown keys instead of passing them through", () => {
    const raw = JSON.stringify({
      v: 1,
      ts: 1,
      extra: true,
      c: {
        preferences: true,
        statistics: false,
        marketing: false,
        other: false,
        extra: true
      }
    });

    expect(parseConsent(raw)).toEqual({
      v: 1,
      ts: 1,
      c: {
        preferences: true,
        statistics: false,
        marketing: false,
        other: false
      }
    });
  });
});

describe("serializeConsent", () => {
  test("builds the {v, ts, c} JSON shape", () => {
    const categories: ConsentCategories = {
      preferences: false,
      statistics: true,
      marketing: false,
      other: true
    };

    expect(JSON.parse(serializeConsent(categories, 123))).toEqual({
      v: 1,
      ts: 123,
      c: categories
    });
  });
});

describe("grantedCategories", () => {
  it.each([
    {
      case: "nothing granted",
      c: {
        preferences: false,
        statistics: false,
        marketing: false,
        other: false
      },
      out: ["necessary"]
    },
    {
      case: "some granted",
      c: { preferences: true, statistics: false, marketing: true, other: true },
      out: ["necessary", "preferences", "marketing", "other"]
    }
  ])(
    "returns necessary plus every granted category for $case",
    ({ c, out }) => {
      const consent: Consent = { v: 1, ts: 0, c };

      expect(grantedCategories(consent)).toEqual(out);
    }
  );
});

describe("diffConsent", () => {
  it.each([
    {
      case: "a category going granted -> denied is a revocation",
      prev: {
        preferences: true,
        statistics: true,
        marketing: true,
        other: true
      },
      next: {
        preferences: true,
        statistics: false,
        marketing: true,
        other: true
      },
      out: { revoked: true, newlyGranted: [] }
    },
    {
      case: "categories going denied -> granted are newly granted",
      prev: {
        preferences: false,
        statistics: false,
        marketing: true,
        other: false
      },
      next: {
        preferences: true,
        statistics: true,
        marketing: true,
        other: true
      },
      out: {
        revoked: false,
        newlyGranted: ["preferences", "statistics", "other"]
      }
    },
    {
      case: "no previous record: never a revocation, every grant is new",
      prev: undefined,
      next: {
        preferences: true,
        statistics: false,
        marketing: true,
        other: false
      },
      out: { revoked: false, newlyGranted: ["preferences", "marketing"] }
    },
    {
      case: "no change yields nothing",
      prev: {
        preferences: true,
        statistics: false,
        marketing: true,
        other: false
      },
      next: {
        preferences: true,
        statistics: false,
        marketing: true,
        other: false
      },
      out: { revoked: false, newlyGranted: [] }
    }
  ])("$case", ({ prev, next, out }) => {
    const previous: Consent | undefined = prev && { v: 1, ts: 0, c: prev };

    expect(diffConsent(previous, next)).toEqual(out);
  });
});

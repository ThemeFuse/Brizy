import { parseGlobalBlock, parseGlobalBlocksToRecord } from "../";

const overlayPayload = {
  uid: "gb-overlay-1",
  title: "Cookie Banner",
  status: "publish",
  dataVersion: 1,
  position: null,
  dependencies: [],
  rules: [{ type: 1, appliedFor: null, entityType: "", entityValues: [] }],
  meta: JSON.stringify({
    type: "overlay",
    subtype: "cookieBanner",
    extraFontStyles: []
  }),
  data: {
    type: "CookieBanner",
    blockId: "CookieBanner",
    value: { _id: "gb-overlay-1", items: [] }
  }
};

const normalPayload = {
  uid: "gb-normal-1",
  title: "Normal Block",
  status: "publish",
  dataVersion: 1,
  position: null,
  dependencies: [],
  rules: [],
  meta: JSON.stringify({ type: "normal", extraFontStyles: [] }),
  data: {
    type: "Section",
    blockId: "Section",
    value: { _id: "gb-normal-1", items: [] }
  }
};

// A `meta` value that isn't valid JSON makes the whole block unparsable
// (parseGlobalBlock catches and returns undefined for it).
const unparsableMetaPayload = {
  uid: "gb-broken-1",
  status: "publish",
  dataVersion: 1,
  position: null,
  dependencies: [],
  rules: [],
  meta: "not valid json",
  data: {
    type: "Section",
    blockId: "Section",
    value: { _id: "gb-broken-1", items: [] }
  }
};

const withMeta = (meta: string): Record<string, unknown> => ({
  ...normalPayload,
  meta
});

describe("parseGlobalBlock - meta", () => {
  it.each([
    {
      case: "an overlay, preserving subtype",
      payload: overlayPayload,
      meta: { type: "overlay", subtype: "cookieBanner", extraFontStyles: [] }
    },
    {
      // Kept, not dropped: the editor never reads the subtype.
      case: "an overlay without a subtype",
      payload: withMeta(JSON.stringify({ type: "overlay" })),
      meta: { type: "overlay", subtype: undefined, extraFontStyles: [] }
    },
    {
      case: "an overlay with an unknown subtype",
      payload: withMeta(
        JSON.stringify({ type: "overlay", subtype: "ageGate" })
      ),
      meta: { type: "overlay", subtype: undefined, extraFontStyles: [] }
    },
    {
      case: "a popup",
      payload: withMeta(JSON.stringify({ type: "popup", extraFontStyles: [] })),
      meta: { type: "popup", extraFontStyles: [] }
    },
    {
      case: "a missing type, as normal",
      payload: withMeta(JSON.stringify({ extraFontStyles: [] })),
      meta: { type: "normal", extraFontStyles: [] }
    },
    {
      case: "an unknown type, as normal",
      payload: withMeta(JSON.stringify({ type: "banner" })),
      meta: { type: "normal", extraFontStyles: [] }
    },
    {
      // Kept as stored: this meta is written back to the API on save.
      case: "a normal block, keeping a subtype it does not use",
      payload: withMeta(
        JSON.stringify({ type: "normal", subtype: "cookieBanner" })
      ),
      meta: { type: "normal", subtype: "cookieBanner", extraFontStyles: [] }
    },
    {
      case: 'an empty meta stored as "[]", as normal',
      payload: withMeta("[]"),
      meta: { type: "normal", extraFontStyles: [] }
    },
    {
      // Passed through untouched: this meta is written back to the API on
      // save, so the reader must not drop what it does not recognise.
      case: "font styles, passing them through as stored",
      payload: withMeta(
        JSON.stringify({ type: "normal", extraFontStyles: [{ id: "x" }] })
      ),
      meta: { type: "normal", extraFontStyles: [{ id: "x" }] }
    },
    {
      case: "non-array font styles, as none",
      payload: withMeta(
        JSON.stringify({ type: "normal", extraFontStyles: "bad" })
      ),
      meta: { type: "normal", extraFontStyles: [] }
    },
    {
      case: "thumbnails, coercing numeric strings and numbers as before",
      payload: withMeta(
        JSON.stringify({
          type: "normal",
          _thumbnailSrc: 42,
          _thumbnailWidth: "600",
          _thumbnailHeight: 300,
          _thumbnailTime: ""
        })
      ),
      meta: {
        type: "normal",
        extraFontStyles: [],
        _thumbnailSrc: "42",
        _thumbnailWidth: 600,
        _thumbnailHeight: 300
      }
    },
    {
      case: "thumbnails, dropping mistyped ones",
      payload: withMeta(
        JSON.stringify({
          type: "normal",
          _thumbnailSrc: "a.png",
          _thumbnailWidth: "wide"
        })
      ),
      meta: {
        type: "normal",
        extraFontStyles: [],
        _thumbnailSrc: "a.png"
      }
    }
  ])("reads $case", ({ payload, meta }) => {
    expect(parseGlobalBlock(payload)?.meta).toEqual(meta);
  });

  it.each([
    { case: "meta that is not valid JSON", payload: unparsableMetaPayload },
    { case: "a missing meta", payload: { ...normalPayload, meta: undefined } },
    { case: "a meta that is a JSON number", payload: withMeta("42") },
    { case: "a meta that is JSON null", payload: withMeta("null") }
  ])("rejects $case", ({ payload }) => {
    jest.spyOn(console, "error").mockImplementation(() => undefined);

    expect(parseGlobalBlock(payload)).toBeUndefined();
  });
});

describe("parseGlobalBlocksToRecord - overlay", () => {
  test("accepts meta.type: 'overlay' into the output record", () => {
    const record = parseGlobalBlocksToRecord([overlayPayload]);

    expect(record["gb-overlay-1"]).toBeDefined();
    expect(record["gb-overlay-1"].meta).toEqual({
      type: "overlay",
      subtype: "cookieBanner",
      extraFontStyles: []
    });
  });

  test("still drops blocks it can't parse, without dropping the rest of the batch", () => {
    const record = parseGlobalBlocksToRecord([
      normalPayload,
      overlayPayload,
      unparsableMetaPayload
    ]);

    expect(Object.keys(record).sort()).toStrictEqual([
      "gb-normal-1",
      "gb-overlay-1"
    ]);
    expect(record["gb-broken-1"]).toBeUndefined();
  });
});

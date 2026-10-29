import { parseGlobalBlocks } from "visual/bootstraps/common/utils/parseGlobalBlocks";
import { parseGlobalBlock } from "visual/utils/reader/globalBlocks";

/** This suite's jsdom has no `structuredClone`; every value here is JSON. */
const clone = (value: unknown): unknown => JSON.parse(JSON.stringify(value));

const UID = "qZk32Un_fi0gtOTsn7ljbLbzyq3YsE7k";
const COLLECTION_TYPE = "/collection_types/12729";
const COLLECTION_ITEM = "/collection_items/12599";

/** A rule entity exactly as the host delivers it to the compiler. */
const wireRule = {
  id: "/rules/862",
  mode: "include",
  type: "specific",
  entityTypeSlug: null,
  entityType: COLLECTION_TYPE,
  entityId: COLLECTION_ITEM,
  externalType: null,
  externalId: null,
  entityTypeField: null,
  fieldValueItem: null
};

const flatRule = {
  type: 1,
  appliedFor: 1,
  entityType: COLLECTION_TYPE,
  entityValues: [COLLECTION_ITEM],
  mode: "specific"
};

/**
 * `data` reaches the compiler as a plain JSON string — unlike the browser
 * bootstrap, which is handed base64.
 */
const blockData = JSON.stringify({
  type: "Section",
  value: { _id: UID, items: [] }
});

const globalBlock = (
  over: Record<string, unknown>
): Record<string, unknown> => ({
  uid: UID,
  id: 0,
  title: "Global Block",
  status: "publish",
  dataVersion: 1,
  position: { align: "bottom", top: 1, bottom: 1 },
  meta: '{"type":"normal","extraFontStyles":[]}',
  data: blockData,
  ...over
});

describe("parseGlobalBlocks", () => {
  it("decodes `data` and converts rule entities", () => {
    expect(
      parseGlobalBlocks([globalBlock({ rules: [wireRule] })], {})
    ).toStrictEqual([
      globalBlock({
        data: JSON.parse(blockData),
        rules: [
          {
            type: 1,
            mode: "specific",
            appliedFor: 1,
            entityType: COLLECTION_TYPE,
            entityValues: [COLLECTION_ITEM]
          }
        ]
      })
    ]);
  });

  it("drops a block whose `data` is not JSON", () => {
    expect(
      parseGlobalBlocks([globalBlock({ data: "not json" })], {})
    ).toStrictEqual([]);
  });

  // Whatever is not an array of rule entities must survive byte-identical: the
  // clone is taken before the call, so an in-place mutation could not hide.
  it.each([
    { case: "old flat rules", rules: [flatRule] },
    { case: "WordPress rules", rules: [{ ...flatRule, entityType: "post" }] },
    { case: "an empty rule list", rules: [] },
    { case: "rules set to null", rules: null },
    {
      case: "rules carried as a JSON string",
      rules: JSON.stringify([flatRule])
    }
  ])("leaves $case untouched", ({ rules }) => {
    const block = globalBlock({ rules });
    const before = clone(block.rules);

    expect(parseGlobalBlocks([block], {})[0].rules).toStrictEqual(before);
  });

  it("leaves a block with no rules key alone apart from the decoded data", () => {
    expect(parseGlobalBlocks([globalBlock({})], {})).toStrictEqual([
      globalBlock({ data: JSON.parse(blockData) })
    ]);
  });

  // The regression: a rule entity used to be unreadable, so `rules` collapsed
  // to `[]` and the block was compiled out of the page.
  it("produces rules the editor's own reader accepts", () => {
    const [block] = parseGlobalBlocks([globalBlock({ rules: [wireRule] })], {});

    expect(parseGlobalBlock({ ...block })?.rules).toStrictEqual([
      {
        type: 1,
        mode: "specific",
        appliedFor: 1,
        entityType: COLLECTION_TYPE,
        entityValues: [COLLECTION_ITEM]
      }
    ]);
  });
});

import { readConfig } from "visual/bootstraps/common/readConfig";
import type { ActionHydrate } from "visual/redux/actions2";
import { blocksHtmlRawSelector } from "visual/redux/selectors";
import { createStore } from "visual/redux/store";
import type { PageCollection } from "visual/types/Page";
import type { Project } from "visual/types/Project";
import { BlockTypeRule, type Rule } from "visual/types/Rule";
import { canUseCondition } from "visual/utils/blocks/getAllowedGBIds";
import { parseGlobalBlocksToRecord } from "visual/utils/reader/globalBlocks";
import fixture from "./__fixtures__/compilerConfig.globalBlocks.json";

/**
 * The host request the node compiler really receives, trimmed to the
 * global-block story: five page items (three sections around two global
 * blocks), four global blocks, and their fourteen rules byte-for-byte off the
 * wire. `modules.shop` names no collection type on this project, so every
 * ecwid rule falls back to the editor's literal dialect.
 */
const PAGE_ITEM = "/collection_items/12599";
const PAGE_TYPE = "/collection_types/12729";

const MIDDLE_UIDS = [
  "pjGrhLaEWTI2EAr1lXMdd0B0Ih7TAWQx",
  "qZk32Un_fi0gtOTsn7ljbLbzyq3YsE7k"
];

const config = readConfig(fixture);
const globalBlocks = parseGlobalBlocksToRecord(config.globalBlocks);
const pageData = config.pageData;

if (!pageData) {
  throw new Error("the fixture must carry pageData");
}

/**
 * The page being compiled. Its items come from the parsed config; the rest is
 * spelled out because the conditions code wants a `Page`, not the looser
 * `PageCommon` the config carries. `fields` is `null` here — the real page's
 * only field is rich text, which carries no reference for a rule to match.
 */
const page: PageCollection = {
  id: PAGE_ITEM,
  matchingItemId: PAGE_ITEM,
  title: "About",
  slug: "about",
  status: "publish",
  dataVersion: 1,
  dependencies: MIDDLE_UIDS,
  collectionType: { id: PAGE_TYPE, title: "Page" },
  fields: null,
  data: pageData.data
};

const project: Project = {
  id: "project-1",
  dataVersion: 1,
  data: {
    selectedKit: "",
    selectedStyle: "",
    styles: [],
    extraStyles: [],
    extraFontStyles: [],
    font: "",
    fonts: {},
    disabledElements: [],
    pinnedElements: []
  }
};

/** The rule the two middle blocks are placed by: "this page, specifically". */
const thisPageRule: Rule = {
  type: BlockTypeRule.include,
  mode: "specific",
  appliedFor: 1,
  entityType: PAGE_TYPE,
  entityValues: [PAGE_ITEM]
};

interface BlockCase {
  case: string;
  uid: string;
  /** How many rules the wire carried — none of them may be dropped. */
  wireRuleCount: number;
  rules: Rule[];
  usable: boolean;
}

const cases: BlockCase[] = [
  {
    case: "the header block, whose six rules cover every stored shape",
    uid: "aqHAvOnan39H",
    wireRuleCount: 6,
    rules: [
      // No shop collection types in this config, so the referenced
      // `ecwid-category` row comes back in the editor's literal dialect with
      // its numeric external id.
      {
        type: BlockTypeRule.include,
        mode: "reference",
        appliedFor: 1,
        entityType: "ecwid-product-category",
        entityValues: [179508506]
      },
      {
        type: BlockTypeRule.include,
        mode: "specific",
        appliedFor: 1,
        entityType: PAGE_TYPE,
        entityValues: ["/collection_items/12585"]
      },
      {
        type: BlockTypeRule.include,
        mode: "reference",
        appliedFor: 1,
        entityType: "/collection_types/12731",
        entityValues: ["/collection_type_fields/36474:/collection_items/12602"]
      },
      thisPageRule,
      {
        type: BlockTypeRule.include,
        mode: "specific",
        appliedFor: 1,
        entityType: "customer",
        entityValues: ["/customers/253"]
      },
      {
        type: BlockTypeRule.include,
        mode: "specific",
        appliedFor: 1,
        entityType: "/collection_types/12734",
        entityValues: ["/collection_items/12589"]
      }
    ],
    usable: true
  },
  {
    case: "the first middle block",
    uid: "pjGrhLaEWTI2EAr1lXMdd0B0Ih7TAWQx",
    wireRuleCount: 1,
    rules: [thisPageRule],
    usable: true
  },
  {
    case: "the second middle block",
    uid: "qZk32Un_fi0gtOTsn7ljbLbzyq3YsE7k",
    wireRuleCount: 1,
    rules: [thisPageRule],
    usable: true
  },
  {
    case: "the footer block, whose excludes must survive as type 2",
    uid: "dPWKsc32JX7V",
    wireRuleCount: 6,
    rules: [
      {
        type: BlockTypeRule.exclude,
        mode: "specific",
        appliedFor: 1,
        entityType: PAGE_TYPE,
        entityValues: ["/collection_items/12600"]
      },
      {
        type: BlockTypeRule.exclude,
        mode: "reference",
        appliedFor: 1,
        entityType: "ecwid-product-category",
        entityValues: [179508506]
      },
      {
        type: BlockTypeRule.include,
        mode: "specific",
        appliedFor: 1,
        entityType: "/collection_types/12731",
        entityValues: ["/collection_items/12601"]
      },
      thisPageRule,
      {
        type: BlockTypeRule.include,
        mode: "specific",
        appliedFor: 1,
        entityType: "/collection_types/12731",
        entityValues: ["/collection_items/12608"]
      },
      {
        type: BlockTypeRule.exclude,
        mode: "specific",
        appliedFor: 1,
        entityType: "customer",
        entityValues: ["/customers/253"]
      }
    ],
    usable: true
  }
];

describe("the node compiler reads the host's global blocks", () => {
  it.each(cases)(
    "$case",
    ({ uid, wireRuleCount, rules, usable }: BlockCase) => {
      const globalBlock = globalBlocks[uid];

      expect(globalBlock.rules).toHaveLength(wireRuleCount);
      expect(globalBlock.rules).toStrictEqual(rules);
      expect(canUseCondition({ globalBlock, page, config })).toBe(usable);
    }
  );

  // The browser publish path anchors middle global blocks without consulting
  // their rules, so it must keep doing so once the rules are converted; the
  // node compiler's own gate is the `canUseCondition` assertion above.
  it("the browser publish path still anchors every middle global block", () => {
    const store = createStore();
    const action: ActionHydrate = {
      type: "HYDRATE",
      payload: {
        page,
        project,
        globalBlocks,
        fonts: {},
        projectStatus: { locked: false, lockedBy: false },
        authorized: "connected",
        syncAllowed: true,
        config,
        editorMode: config.mode,
        symbols: []
      }
    };

    store.dispatch(action);

    const blocks = blocksHtmlRawSelector(store.getState());

    expect(blocks.map(({ id }) => id)).toStrictEqual([
      "qsJ3VUxi65xA",
      MIDDLE_UIDS[0],
      "vBkC16s4kxBA",
      MIDDLE_UIDS[1],
      "yV8IiDvDWDPS"
    ]);
    expect(
      blocks
        .filter(({ id }) => MIDDLE_UIDS.includes(id))
        .map(({ html }) => html)
    ).toStrictEqual(
      MIDDLE_UIDS.map((uid) => `{{ brizy_dc_global_block uid="${uid}" }}`)
    );
  });
});

import {
  convertGlobalBlockRule,
  type ExternalTypesByCollectionType,
  externalTypesFromShop,
  ruleEntityToApiRule
} from "visual/bootstraps/common/utils/globalBlockRules";
import type { RuleEntity } from "visual/bootstraps/common/utils/globalBlockRules/schemas";
import type { ApiRule } from "visual/utils/reader/globalBlocks";

/** This suite's jsdom has no `structuredClone`; every value here is JSON. */
const clone = (value: unknown): unknown => JSON.parse(JSON.stringify(value));

/** A stored rule entity as the converters see it — absent fields omitted. */
const ruleEntity = (over: Partial<RuleEntity>): RuleEntity => ({
  mode: "include",
  type: "specific",
  ...over
});

/**
 * The same entity as the wire actually delivers it: every column present, with
 * the backend's `null` for the absent ones. Both spellings must behave alike.
 */
const wireRuleEntity = (over: Partial<RuleEntity>): RuleEntity => ({
  mode: "include",
  type: "specific",
  entityType: null,
  entityTypeSlug: null,
  entityId: null,
  entityTypeField: null,
  fieldValueItem: null,
  externalType: null,
  externalId: null,
  ...over
});

/** What `modules.shop` names on an ecwid project with both types configured. */
const SHOP_EXTERNAL_TYPES: ExternalTypesByCollectionType = {
  "/collection_types/8": "ecwid-category",
  "/collection_types/9": "ecwid-product"
};

const PARTIAL_SHOP_EXTERNAL_TYPES: ExternalTypesByCollectionType = {
  "/collection_types/8": "ecwid-category"
};

interface InboundCase {
  case: string;
  entity: RuleEntity;
  externalTypes: ExternalTypesByCollectionType;
  out: ApiRule;
}

const inboundCases: InboundCase[] = [
  {
    case: "an empty entity -> the all rule (entityType '' + null appliedFor)",
    entity: ruleEntity({}),
    externalTypes: {},
    out: { type: 1, appliedFor: null, entityType: "", entityValues: [] }
  },
  {
    case: "the wire spelling of an empty entity -> the same all rule",
    entity: wireRuleEntity({}),
    externalTypes: {},
    out: { type: 1, appliedFor: null, entityType: "", entityValues: [] }
  },
  {
    case: "mode 'exclude' -> type 2",
    entity: ruleEntity({ mode: "exclude" }),
    externalTypes: {},
    out: { type: 2, appliedFor: null, entityType: "", entityValues: [] }
  },
  {
    case: "a collection type with no entityId -> no values, no mode",
    entity: ruleEntity({ entityType: "/collection_types/3" }),
    externalTypes: {},
    out: {
      type: 1,
      appliedFor: 1,
      entityType: "/collection_types/3",
      entityValues: []
    }
  },
  {
    case: "a specific collection item -> single-value entityValues + mode",
    entity: ruleEntity({
      entityType: "/collection_types/3",
      entityId: "/collection_items/88"
    }),
    externalTypes: {},
    out: {
      type: 1,
      mode: "specific",
      appliedFor: 1,
      entityType: "/collection_types/3",
      entityValues: ["/collection_items/88"]
    }
  },
  {
    case: "the wire spelling of a specific collection item -> the same rule",
    entity: wireRuleEntity({
      entityType: "/collection_types/3",
      entityId: "/collection_items/88"
    }),
    externalTypes: {},
    out: {
      type: 1,
      mode: "specific",
      appliedFor: 1,
      entityType: "/collection_types/3",
      entityValues: ["/collection_items/88"]
    }
  },
  {
    case: "a referenced collection item -> reference mode",
    entity: ruleEntity({
      type: "referenced",
      entityType: "/collection_types/3",
      entityId: "/collection_items/9"
    }),
    externalTypes: {},
    out: {
      type: 1,
      mode: "reference",
      appliedFor: 1,
      entityType: "/collection_types/3",
      entityValues: ["/collection_items/9"]
    }
  },
  {
    case: "a customer with an entityId -> specific customer rule",
    entity: ruleEntity({
      entityTypeSlug: "customer",
      entityId: "/customers/5"
    }),
    externalTypes: {},
    out: {
      type: 1,
      mode: "specific",
      appliedFor: 1,
      entityType: "customer",
      entityValues: ["/customers/5"]
    }
  },
  {
    case: "a customer with no entityId -> no mode",
    entity: ruleEntity({ entityTypeSlug: "customer" }),
    externalTypes: {},
    out: {
      type: 1,
      appliedFor: 1,
      entityType: "customer",
      entityValues: []
    }
  },
  {
    case: "customer_group -> entityType 'customer' + reference mode (IRI as-is)",
    entity: ruleEntity({
      type: "referenced",
      entityTypeSlug: "customer_group",
      entityId: "/customer_groups/5"
    }),
    externalTypes: {},
    out: {
      type: 1,
      mode: "reference",
      appliedFor: 1,
      entityType: "customer",
      entityValues: ["/customer_groups/5"]
    }
  },
  {
    case: "customer_group with no entityId -> reference mode, no values",
    entity: ruleEntity({
      type: "referenced",
      entityTypeSlug: "customer_group"
    }),
    externalTypes: {},
    out: {
      type: 1,
      mode: "reference",
      appliedFor: 1,
      entityType: "customer",
      entityValues: []
    }
  },
  {
    case: "a specific ecwid-product -> the numeric id round-trips to a number",
    entity: ruleEntity({ externalType: "ecwid-product", externalId: "12345" }),
    externalTypes: {},
    out: {
      type: 1,
      mode: "specific",
      appliedFor: 1,
      entityType: "ecwid-product",
      entityValues: [12345]
    }
  },
  {
    case: "an ecwid-product with no externalId -> empty values, no mode",
    entity: ruleEntity({ externalType: "ecwid-product" }),
    externalTypes: {},
    out: {
      type: 1,
      appliedFor: 1,
      entityType: "ecwid-product",
      entityValues: []
    }
  },
  {
    case: "a referenced external with an id -> reference mode, editor entityType",
    entity: ruleEntity({
      type: "referenced",
      externalType: "ecwid-category",
      externalId: "800001"
    }),
    externalTypes: {},
    out: {
      type: 1,
      mode: "reference",
      appliedFor: 1,
      entityType: "ecwid-product-category",
      entityValues: [800001]
    }
  },
  {
    // Without this the rule would fold back to `specific` on the next outbound
    // pass and the content-matched diff would churn the row.
    case: "a referenced external with NO id keeps reference mode (all-reference)",
    entity: ruleEntity({ type: "referenced", externalType: "ecwid-category" }),
    externalTypes: {},
    out: {
      type: 1,
      mode: "reference",
      appliedFor: 1,
      entityType: "ecwid-product-category",
      entityValues: []
    }
  },
  {
    case: "a field rule (entityTypeField + fieldValueItem) -> the fieldIRI:itemIRI composite",
    entity: ruleEntity({
      type: "referenced",
      entityType: "/collection_types/1",
      entityTypeField: "/collection_type_fields/9",
      fieldValueItem: "/collection_items/42"
    }),
    externalTypes: {},
    out: {
      type: 1,
      mode: "reference",
      appliedFor: 1,
      entityType: "/collection_types/1",
      entityValues: ["/collection_type_fields/9:/collection_items/42"]
    }
  },
  {
    case: "a field rule with no fieldValueItem -> the bare field IRI (all reference)",
    entity: ruleEntity({
      type: "referenced",
      entityType: "/collection_types/1",
      entityTypeField: "/collection_type_fields/9"
    }),
    externalTypes: {},
    out: {
      type: 1,
      mode: "reference",
      appliedFor: 1,
      entityType: "/collection_types/1",
      entityValues: ["/collection_type_fields/9"]
    }
  },
  {
    case: "shop map: a specific ecwid-category -> Product Categories IRI + item id",
    entity: ruleEntity({
      externalType: "ecwid-category",
      externalId: "800001"
    }),
    externalTypes: SHOP_EXTERNAL_TYPES,
    out: {
      type: 1,
      mode: "specific",
      appliedFor: 1,
      entityType: "/collection_types/8",
      entityValues: ["ecwid-category/800001"]
    }
  },
  {
    case: "shop map: a specific ecwid-product -> Products IRI + item id",
    entity: ruleEntity({
      externalType: "ecwid-product",
      externalId: "700001"
    }),
    externalTypes: SHOP_EXTERNAL_TYPES,
    out: {
      type: 1,
      mode: "specific",
      appliedFor: 1,
      entityType: "/collection_types/9",
      entityValues: ["ecwid-product/700001"]
    }
  },
  {
    case: "shop map: a specific row with no externalId -> the type's 'All' (CollectionTypeRule)",
    entity: ruleEntity({ externalType: "ecwid-category" }),
    externalTypes: SHOP_EXTERNAL_TYPES,
    out: {
      type: 1,
      appliedFor: 1,
      entityType: "/collection_types/8",
      entityValues: []
    }
  },
  {
    // Listed under Products, whose synthesized reference field's id IS the
    // Product Categories CollectionType IRI.
    case: "shop map: a referenced ecwid-category -> Products type + reference composite",
    entity: ruleEntity({
      type: "referenced",
      externalType: "ecwid-category",
      externalId: "800001"
    }),
    externalTypes: SHOP_EXTERNAL_TYPES,
    out: {
      type: 1,
      mode: "reference",
      appliedFor: 1,
      entityType: "/collection_types/9",
      entityValues: ["/collection_types/8:ecwid-category/800001"]
    }
  },
  {
    case: "shop map: a referenced row with no id -> the bare field slot (All Product Categories)",
    entity: ruleEntity({ type: "referenced", externalType: "ecwid-category" }),
    externalTypes: SHOP_EXTERNAL_TYPES,
    out: {
      type: 1,
      mode: "reference",
      appliedFor: 1,
      entityType: "/collection_types/9",
      entityValues: ["/collection_types/8"]
    }
  },
  {
    case: "shop map: a legacy `ecwid-product-category` row is canonicalized before mapping",
    entity: ruleEntity({
      externalType: "ecwid-product-category",
      externalId: "800001"
    }),
    externalTypes: SHOP_EXTERNAL_TYPES,
    out: {
      type: 1,
      mode: "specific",
      appliedFor: 1,
      entityType: "/collection_types/8",
      entityValues: ["ecwid-category/800001"]
    }
  },
  {
    case: "shop map: exclude survives the generic mapping",
    entity: ruleEntity({
      mode: "exclude",
      externalType: "ecwid-category",
      externalId: "800001"
    }),
    externalTypes: SHOP_EXTERNAL_TYPES,
    out: {
      type: 2,
      mode: "specific",
      appliedFor: 1,
      entityType: "/collection_types/8",
      entityValues: ["ecwid-category/800001"]
    }
  },
  {
    // Nothing references Products, so a `referenced` ecwid-product row (which
    // the UI cannot produce) has no generic home; keep the legacy encoding
    // rather than inventing an entityType.
    case: "shop map: a referenced ecwid-product has no owner -> the literal dialect",
    entity: ruleEntity({
      type: "referenced",
      externalType: "ecwid-product",
      externalId: "700001"
    }),
    externalTypes: SHOP_EXTERNAL_TYPES,
    out: {
      type: 1,
      mode: "reference",
      appliedFor: 1,
      entityType: "ecwid-product",
      entityValues: [700001]
    }
  },
  {
    // Only the category type is known -> the referenced rule's owner
    // (Products) cannot be resolved.
    case: "a partial shop config -> the literal dialect for a referenced category",
    entity: ruleEntity({
      type: "referenced",
      externalType: "ecwid-category",
      externalId: "800001"
    }),
    externalTypes: PARTIAL_SHOP_EXTERNAL_TYPES,
    out: {
      type: 1,
      mode: "reference",
      appliedFor: 1,
      entityType: "ecwid-product-category",
      entityValues: [800001]
    }
  },
  {
    case: "shop map: ordinary CMS rules are left alone",
    entity: ruleEntity({
      entityType: "/collection_types/3",
      entityId: "/collection_items/88"
    }),
    externalTypes: SHOP_EXTERNAL_TYPES,
    out: {
      type: 1,
      mode: "specific",
      appliedFor: 1,
      entityType: "/collection_types/3",
      entityValues: ["/collection_items/88"]
    }
  }
];

describe("ruleEntityToApiRule", () => {
  it.each(inboundCases)(
    "$case",
    ({ entity, externalTypes, out }: InboundCase) => {
      expect(ruleEntityToApiRule(entity, externalTypes)).toStrictEqual(out);
    }
  );
});

describe("externalTypesFromShop", () => {
  interface ShopCase {
    case: string;
    shop: unknown;
    out: ExternalTypesByCollectionType;
  }

  const cases: ShopCase[] = [
    {
      case: "both shop collection types -> their canonical external names",
      shop: {
        ecwidCategoryTypeId: "/collection_types/8",
        ecwidProductTypeId: "/collection_types/9"
      },
      out: {
        "/collection_types/8": "ecwid-category",
        "/collection_types/9": "ecwid-product"
      }
    },
    {
      case: "only the category type is configured",
      shop: { ecwidCategoryTypeId: "/collection_types/8" },
      out: { "/collection_types/8": "ecwid-category" }
    },
    {
      case: "only the product type is configured",
      shop: { ecwidProductTypeId: "/collection_types/9" },
      out: { "/collection_types/9": "ecwid-product" }
    },
    {
      case: "no shop module at all",
      shop: undefined,
      out: {}
    },
    {
      // a non-ecwid (e.g. Shopify) shop object has none of these keys
      case: "a non-ecwid shop module",
      shop: {},
      out: {}
    },
    {
      case: "empty ids -> no junk keys",
      shop: { ecwidCategoryTypeId: "", ecwidProductTypeId: "" },
      out: {}
    },
    {
      // what the host really sends for a project with no CMS shop types
      case: "null ids -> no junk keys",
      shop: { ecwidCategoryTypeId: null, ecwidProductTypeId: null },
      out: {}
    },
    {
      case: "a shop that is not an object at all",
      shop: "ecwid",
      out: {}
    }
  ];

  it.each(cases)("$case", ({ shop, out }: ShopCase) => {
    expect(externalTypesFromShop(shop)).toStrictEqual(out);
  });
});

describe("convertGlobalBlockRule", () => {
  it.each([
    {
      case: "a rule entity is flattened",
      rule: {
        id: "/rules/862",
        mode: "include",
        type: "specific",
        entityTypeSlug: null,
        entityType: "/collection_types/12729",
        entityId: "/collection_items/12599",
        externalType: null,
        externalId: null,
        entityTypeField: null,
        fieldValueItem: null
      },
      out: {
        type: 1,
        mode: "specific",
        appliedFor: 1,
        entityType: "/collection_types/12729",
        entityValues: ["/collection_items/12599"]
      }
    }
  ])("$case", ({ rule, out }) => {
    expect(convertGlobalBlockRule(rule, {})).toStrictEqual(out);
  });

  // Detection is structural, so anything that is not a rule entity — a
  // WordPress rule, an already-flat Cloud rule, junk — must come back
  // byte-identical. The clone is taken before the call, so a mutation of the
  // input could not hide here.
  it.each([
    {
      case: "an already-flat Cloud rule",
      rule: {
        type: 1,
        appliedFor: 1,
        entityType: "page",
        entityValues: ["1"],
        mode: "specific"
      }
    },
    {
      case: "a WordPress rule",
      rule: {
        type: 1,
        appliedFor: 1,
        entityType: "post",
        entityValues: ["in|category|"]
      }
    },
    {
      case: "a rule entity missing its mode",
      rule: { id: "/rules/1", type: "specific", entityType: "page" }
    },
    { case: "null", rule: null },
    { case: "a string", rule: "rule" },
    { case: "a number", rule: 1 }
  ])("leaves $case untouched", ({ rule }) => {
    const before = clone(rule);

    expect(convertGlobalBlockRule(rule, {})).toStrictEqual(before);
  });
});

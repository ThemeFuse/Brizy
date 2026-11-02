import {
  CUSTOMER_TYPE,
  createEntityValue,
  createEntityValueAll
} from "visual/utils/blocks/blocksConditions";
import {
  ECWID_CATEGORY_TYPE,
  ECWID_PRODUCT_CATEGORY_TYPE,
  ECWID_PRODUCT_TYPE
} from "visual/utils/ecwid";
import type { ApiRule } from "visual/utils/reader/globalBlocks";
import {
  type RuleEntity,
  ruleEntitySchema,
  shopExternalTypesSchema
} from "./schemas";

/**
 * CollectionType IRI -> `externalType`, for the shop collection types the host
 * names in `modules.shop`. The API stores a rule about an ecwid item as plain
 * `externalType` + `externalId` strings, so reading it back into the editor's
 * IRI-based dialect needs this pairing. Empty when the project has no shop.
 */
export type ExternalTypesByCollectionType = Readonly<Record<string, string>>;

export function externalTypesFromShop(
  shop: unknown
): ExternalTypesByCollectionType {
  const parsed = shopExternalTypesSchema.safeParse(shop);

  if (!parsed.success) {
    return {};
  }

  const { ecwidCategoryTypeId, ecwidProductTypeId } = parsed.data;

  return {
    ...(ecwidCategoryTypeId
      ? { [ecwidCategoryTypeId]: ECWID_CATEGORY_TYPE }
      : {}),
    ...(ecwidProductTypeId ? { [ecwidProductTypeId]: ECWID_PRODUCT_TYPE } : {})
  };
}

const collectionTypeOf = (
  externalType: string,
  externalTypes: ExternalTypesByCollectionType
): string | undefined =>
  Object.keys(externalTypes).find((iri) => externalTypes[iri] === externalType);

/** Ecwid ids are numeric — convert an all-digits string back to a number. */
const maybeNumber = (value: string): string | number =>
  /^\d+$/.test(value) ? Number(value) : value;

type Mode = "reference" | "specific";

/** A flat rule; `mode` is written only when given, as the reader expects. */
const apiRule = (
  type: 1 | 2,
  entityType: string,
  entityValues: Array<string | number>,
  mode: Mode | undefined
): ApiRule => ({
  type,
  appliedFor: 1,
  entityType,
  entityValues,
  ...(mode === undefined ? {} : { mode })
});

/**
 * A stored shop rule, rebuilt in the generic dialect the conditions modal
 * speaks: CollectionType IRIs for the type, `ecwid-category/800001` for the
 * item. `undefined` when the shop config never named the collection types.
 *
 * The CMS gives Products one synthesized reference field, "Product
 * Categories", whose id is the target CollectionType IRI itself. So a
 * *referenced* category rule is listed under Products with the category IRI as
 * the field slot; the wire keeps neither end, so both come from the map.
 */
function externalRule(
  entity: RuleEntity,
  externalType: string,
  type: 1 | 2,
  externalTypes: ExternalTypesByCollectionType
): ApiRule | undefined {
  const collectionType = collectionTypeOf(externalType, externalTypes);

  if (collectionType === undefined) {
    return undefined;
  }

  const item =
    entity.externalId != null
      ? `${externalType}/${entity.externalId}`
      : undefined;

  if (entity.type === "referenced") {
    const owner =
      externalType === ECWID_CATEGORY_TYPE
        ? collectionTypeOf(ECWID_PRODUCT_TYPE, externalTypes)
        : undefined;

    if (owner === undefined) {
      return undefined;
    }

    const entityValues = [
      item === undefined
        ? createEntityValueAll({ fieldId: collectionType })
        : createEntityValue({ fieldId: collectionType, collectionId: item })
    ];

    return apiRule(type, owner, entityValues, "reference");
  }

  return item === undefined
    ? apiRule(type, collectionType, [], undefined)
    : apiRule(type, collectionType, [item], "specific");
}

/** A stored rule entity, flattened into the rule dialect the editor reads. */
export function ruleEntityToApiRule(
  entity: RuleEntity,
  externalTypes: ExternalTypesByCollectionType
): ApiRule {
  const type: 1 | 2 = entity.mode === "include" ? 1 : 2;
  const itemMode: Mode =
    entity.type === "referenced" ? "reference" : "specific";
  const values = entity.entityId != null ? [entity.entityId] : [];
  // mode only for item-level rules (when there is a value).
  const modeIfValues = values.length > 0 ? itemMode : undefined;

  if (entity.entityTypeSlug === "customer_group") {
    return apiRule(type, CUSTOMER_TYPE, values, "reference");
  }

  if (entity.entityTypeSlug === "customer") {
    return apiRule(type, CUSTOMER_TYPE, values, modeIfValues);
  }

  if (entity.externalType != null) {
    const externalType =
      entity.externalType === ECWID_PRODUCT_CATEGORY_TYPE
        ? ECWID_CATEGORY_TYPE
        : entity.externalType;

    const generic = externalRule(entity, externalType, type, externalTypes);

    if (generic) {
      return generic;
    }

    // No shop config to resolve IRIs: keep the editor's own literal. A
    // valueless *referenced* rule keeps its mode too, or the next outbound
    // pass would fold it back to `specific`.
    const externalValues =
      entity.externalId != null ? [maybeNumber(entity.externalId)] : [];

    return apiRule(
      type,
      externalType === ECWID_CATEGORY_TYPE
        ? ECWID_PRODUCT_CATEGORY_TYPE
        : externalType,
      externalValues,
      externalValues.length > 0 || entity.type === "referenced"
        ? itemMode
        : undefined
    );
  }

  if (entity.entityType != null) {
    if (entity.entityTypeField != null) {
      const slot =
        entity.fieldValueItem != null
          ? createEntityValue({
              fieldId: entity.entityTypeField,
              collectionId: entity.fieldValueItem
            })
          : createEntityValueAll({ fieldId: entity.entityTypeField });

      return apiRule(type, entity.entityType, [slot], "reference");
    }

    return apiRule(type, entity.entityType, values, modeIfValues);
  }

  // The all rule: `appliedFor: null` is what the reader recognizes it by.
  return { type, appliedFor: null, entityType: "", entityValues: [] };
}

/**
 * A rule entity becomes a flat rule the editor's reader understands; anything
 * else — a WordPress rule, an already-flat Cloud rule — is passed through
 * untouched, so detection is purely structural.
 */
export function convertGlobalBlockRule(
  rule: unknown,
  externalTypes: ExternalTypesByCollectionType
): unknown {
  const parsed = ruleEntitySchema.safeParse(rule);

  return parsed.success
    ? ruleEntityToApiRule(parsed.data, externalTypes)
    : rule;
}

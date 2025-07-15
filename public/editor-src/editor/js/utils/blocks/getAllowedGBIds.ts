import { difference, intersection } from "es-toolkit";
import { isT } from "fp-utilities";
import { isWp } from "visual/global/Config";
import {
  GetCollectionItem_collectionItem_fields_CollectionItemFieldMultiReference as CollectionItemFieldMultiReference,
  GetCollectionItem_collectionItem_fields_CollectionItemFieldReference as CollectionItemFieldReference
} from "visual/global/Config/types/GetCollectionItem";
import { isCustomerPage } from "visual/global/Config/types/configs/Base";
import {
  isCloud,
  isCollectionPage
} from "visual/global/Config/types/configs/Cloud";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ReduxState } from "visual/redux/types";
import { GlobalBlock } from "visual/types/GlobalBlock";
import { Page, PageCollection } from "visual/types/Page";
import {
  AllRule,
  CollectionItemRule,
  CollectionTypeRule,
  Rule
} from "visual/types/Rule";
import {
  isReferenceAllAuthor,
  isReferenceAllChild,
  isReferenceAllIn,
  isReferenceSpecificAuthor,
  isReferenceSpecificChild,
  isReferenceSpecificIn,
  isWPPage
} from "visual/types/utils";
import { isTemplate } from "visual/utils/models";
import {
  CUSTOMER_TYPE,
  TEMPLATES_GROUP_ID,
  TEMPLATE_TYPE,
  createEntityValue,
  getCurrentRule,
  getEntityValue
} from "./blocksConditions";
import {
  isAllRule,
  isCollectionItemRule,
  isCollectionTypeRule
} from "./guards";
import { isPopup } from "./isPopup";

interface FieldsReferences {
  appliedFor: 1;
  entityType: string;
  entityValues: string[];
  fieldId: string;
}

interface AllowedGBIds {
  pageBlocksIds: Page["id"][];
  globalBlocks: ReduxState["globalBlocks"];
  page: ReduxState["page"];
  config: ConfigCommon;
}

export function getAllowedGBIds(data: AllowedGBIds): string[] {
  const { globalBlocks, pageBlocksIds, page, config } = data;
  return Object.entries(globalBlocks).reduce<string[]>(
    (acc, [currentGlobalBlockId, globalBlock]) => {
      const isInPage = pageBlocksIds.includes(currentGlobalBlockId);

      if (!isInPage && canUseCondition({ globalBlock, page, config })) {
        acc.push(currentGlobalBlockId);
      }

      return acc;
    },
    []
  );
}

interface Data {
  globalBlock: GlobalBlock;
  page: Page;
  config: ConfigCommon;
}

export function canUseCondition(data: Data): boolean {
  const { globalBlock, config } = data;
  if (isPopup(globalBlock.data)) {
    return true;
  }

  return isTemplate(config)
    ? canUseConditionInTemplates(data)
    : canUseConditionInPage(data);
}

export function canUseConditionInTemplates(data: Data): boolean {
  const { config, globalBlock, page } = data;

  if (!isWp(config)) {
    return false;
  }

  const rules = globalBlock.rules;
  const { ruleMatches } = config.wp;

  const templateCondition = rules.find((rule) => {
    if (isCollectionItemRule(rule)) {
      return (
        rule.appliedFor === TEMPLATES_GROUP_ID &&
        rule.entityType === TEMPLATE_TYPE &&
        //String(v) - for old users where entityValue can store as number
        rule.entityValues.some((v) => String(v) === String(page.id))
      );
    }
  });

  if (templateCondition) {
    return isIncludeCondition(templateCondition);
  }

  const templateRules: Rule[] = ruleMatches.map(
    ({ type, group, entityType, values }) => {
      if (values.length) {
        return {
          type,
          entityType,
          mode: "specific",
          appliedFor: group,
          entityValues: values
        };
      } else if (values.length === 0) {
        return {
          type,
          entityType,
          appliedFor: group
        };
      }

      return {
        type
      };
    }
  );

  const blockGroupedRules = templateSplitRules(rules);
  const templateGroupedRules = templateSplitRules(templateRules);

  const itemCondition = blockGroupedRules.level1.find((rule) =>
    templateGroupedRules.level1.find(
      ({ entityType, appliedFor, entityValues }) =>
        appliedFor === rule.appliedFor &&
        entityType === rule.entityType &&
        intersection(entityValues, rule.entityValues).length
    )
  );

  if (itemCondition) {
    return isIncludeCondition(itemCondition);
  }

  const typeCondition = blockGroupedRules.level2.find((rule) =>
    templateGroupedRules.level2.find(
      ({ entityType, appliedFor }) =>
        appliedFor === rule.appliedFor && entityType === rule.entityType
    )
  );

  const templateCondition2 = rules.find((rule) => {
    if (isCollectionTypeRule(rule)) {
      return (
        rule.appliedFor === TEMPLATES_GROUP_ID &&
        rule.entityType === TEMPLATE_TYPE
      );
    }
  });

  if (templateCondition2) {
    return isIncludeCondition(templateCondition2);
  }

  if (typeCondition) {
    return isIncludeCondition(typeCondition);
  }

  if (blockGroupedRules.level3.length) {
    return isIncludeCondition(blockGroupedRules.level3[0]);
  }

  return false;
}

interface TemplateSplitRules {
  level1: CollectionItemRule[];
  level2: CollectionTypeRule[];
  level3: AllRule[];
}

export function templateSplitRules(rules: Rule[]): TemplateSplitRules {
  return rules.reduce<TemplateSplitRules>(
    (acc, rule) => {
      if (
        (isCollectionItemRule(rule) || isCollectionTypeRule(rule)) &&
        rule.entityType === TEMPLATE_TYPE
      ) {
        return acc;
      }

      if (isCollectionItemRule(rule)) {
        acc.level1.push(rule);
      } else if (isCollectionTypeRule(rule)) {
        acc.level2.push(rule);
      } else if (isAllRule(rule)) {
        acc.level3.push(rule);
      }

      return acc;
    },
    {
      level1: [],
      level2: [],
      level3: []
    }
  );
}

// rules split here on 3 part

// level 1 - exactly collectionItem was chosen
// (like collectionType - "page", collectionValue - ["/collectionItem/item_id"])
// see CollectionItemRule type into visual/types/index.ts

// level 2 - exactly collectionType was chosen
//  (like collectionType - "page")
// see CollectionTypeRule type into visual/types/index.ts

// level 2 - just "all"(show everywhere) was chosen
// see AllRule type into visual/types/index.ts
interface SplitRules {
  level1: CollectionItemRule | undefined;
  level2: CollectionTypeRule | undefined;
  level3: AllRule | undefined;
}

interface RuleData {
  rules: Rule[];
  page: Page;
  config: ConfigCommon;
}

export function pageSplitRules(data: RuleData): SplitRules {
  const { rules = [], page, config } = data;
  const currentRule = getCurrentRule(page, config);

  return rules.reduce<SplitRules>(
    (acc, rule) => {
      if (isCollectionItemRule(rule)) {
        if (
          rule.mode === "specific" &&
          rule.appliedFor === currentRule.group &&
          rule.entityType === currentRule.type &&
          rule.entityValues.some((v) => String(v) === String(currentRule.id))
        ) {
          acc.level1 = rule;
        }
      } else if (isCollectionTypeRule(rule)) {
        if (
          rule.appliedFor === currentRule.group &&
          rule.entityType === currentRule.type
        ) {
          acc.level2 = rule;
        }
      } else if (isAllRule(rule)) {
        acc.level3 = rule;
      }

      return acc;
    },
    {
      level1: undefined,
      level2: undefined,
      level3: undefined
    }
  );
}

interface ReferenceRule {
  referenceAll: Rule | undefined;
  referenceSingle: Rule | undefined;
}

export function pageCMSSplitRules(
  rules: Rule[] = [],
  page: Page
): ReferenceRule {
  const r = {
    referenceAll: undefined,
    referenceSingle: undefined
  };

  if (!isCollectionPage(page)) {
    return r;
  }

  const { fields } = page;
  const refs = getFieldsReferences(fields);

  if (refs === undefined || refs.length === 0) {
    return r;
  }

  const referenceRule = rules.filter((rule): rule is CollectionItemRule => {
    return (
      isCollectionItemRule(rule) &&
      rule.mode === "reference" &&
      refs.filter((ref) => ref.entityType === rule.entityType).length > 0
    );
  });

  if (referenceRule.length === 0) {
    return r;
  }

  const specificReference = referenceRule.filter((r) => {
    return r.entityValues.some((v) => getEntityValue(`${v}`)?.collectionId);
  });

  const referenceSingle = specificReference.find((rule) => {
    const intersectionRule = refs
      .map((ref) => intersection(ref.entityValues, rule.entityValues))
      .flat();

    return intersectionRule.length;
  });

  const referenceAll = difference(referenceRule, specificReference).find(
    (r) => {
      const intersectionRule = refs.filter((ref) =>
        r.entityValues.some((r) => ref.fieldId === r)
      );
      return intersectionRule.length;
    }
  );

  return { referenceSingle, referenceAll };
}

function pageCustomerSplitRules(
  rules: Rule[],
  config: ConfigCommon
): Rule | undefined {
  if (isCloud(config) && isCustomerPage(config.page)) {
    const groups = config.availableRoles;

    if (groups.length === 0) {
      return undefined;
    }
    const groupIds = groups.map((group) => group.role);

    return rules
      .filter(
        (rule): rule is CollectionItemRule =>
          isCollectionItemRule(rule) && rule.entityType === CUSTOMER_TYPE
      )
      .find((rule) => intersection(groupIds, rule.entityValues).length > 0);
  }

  return undefined;
}

function pageWPSplitRules(data: RuleData): ReferenceRule {
  const { rules = [], page, config } = data;
  const r = {
    referenceAll: undefined,
    referenceSingle: undefined
  };

  if (!isWp(config) || !isWPPage(page, config)) {
    return r;
  }

  const currentRule = getCurrentRule(page, config);
  const { postAuthor, postTermParents, postTerms } = config.wp;

  const referenceRule = rules.filter(
    (rule): rule is CollectionItemRule =>
      isCollectionItemRule(rule) &&
      rule.mode === "reference" &&
      rule.entityType === currentRule.type
  );

  if (referenceRule.length === 0) {
    return r;
  }

  const referenceSingle = referenceRule.find((r) => {
    return r.entityValues.some((v) => {
      if (isReferenceSpecificAuthor(v)) {
        const arr = v.split("|");
        const id = arr[arr.length - 1];
        return id === `${postAuthor}`;
      }

      if (isReferenceSpecificIn(v)) {
        return postTerms.some(
          ({ taxonomy, term_id }) => `in|${taxonomy}|${term_id}` === v
        );
      }

      if (isReferenceSpecificChild(v)) {
        return postTermParents.some(
          ({ taxonomy, term_id }) => `child|${taxonomy}|${term_id}` === v
        );
      }
    });
  });

  const referenceAll = referenceRule.find((r) => {
    return r.entityValues.some((v) => {
      if (isReferenceAllAuthor(v)) {
        return isT(postAuthor);
      }

      if (isReferenceAllIn(v)) {
        const [_, taxonomy] = v.split("|"); // eslint-disable-line @typescript-eslint/no-unused-vars
        const taxonomies = postTerms.filter((p) => p.taxonomy === taxonomy);

        return taxonomies.length > 0;
      }

      if (isReferenceAllChild(v)) {
        const [_, taxonomy] = v.split("|"); // eslint-disable-line @typescript-eslint/no-unused-vars
        const taxonomies = postTermParents.filter(
          (p) => p.taxonomy === taxonomy
        );

        return taxonomies.length > 0;
      }
    });
  });

  return {
    referenceAll,
    referenceSingle
  };
}

export function canUseConditionInPage(data: Data): boolean {
  const { globalBlock, page, config } = data;

  if (!globalBlock) {
    // Normally it should never happen.
    // Some projects has globalBlock into pageJson and doesn't have it into globalBlocks
    // and preview corrupts
    console.error("Global block don't exists");
    return false;
  }

  const { rules } = globalBlock;

  const {
    level1: level1Rule,
    level2: level2Rule,
    level3: level3Rule
  } = pageSplitRules({ rules, page, config });

  const referenceRule = pageCMSSplitRules(rules, page);

  const wpReferenceRule = pageWPSplitRules({ rules, page, config });

  const referenceCustomerRule = pageCustomerSplitRules(rules, config);

  if (level1Rule) {
    return isIncludeCondition(level1Rule);
  }

  if (referenceRule.referenceSingle) {
    // is for cms references
    return isIncludeCondition(referenceRule.referenceSingle);
  }

  if (referenceRule.referenceAll) {
    return isIncludeCondition(referenceRule.referenceAll);
  }

  if (referenceCustomerRule) {
    return isIncludeCondition(referenceCustomerRule);
  }

  if (wpReferenceRule.referenceSingle) {
    return isIncludeCondition(wpReferenceRule.referenceSingle);
  }

  if (wpReferenceRule.referenceAll) {
    return isIncludeCondition(wpReferenceRule.referenceAll);
  }

  if (level2Rule) {
    return isIncludeCondition(level2Rule);
  }

  if (level3Rule) {
    return isIncludeCondition(level3Rule);
  }

  return false;
}

export function isIncludeCondition(rule: Rule): boolean {
  return rule.type === 1;
}

export function getFieldsReferences(
  fields: PageCollection["fields"]
): FieldsReferences[] | undefined {
  if (fields === null) {
    return undefined;
  }

  return fields
    .filter(
      (
        v
      ): v is
        | CollectionItemFieldReference
        | CollectionItemFieldMultiReference =>
        v.__typename === "CollectionItemFieldReference" ||
        v.__typename === "CollectionItemFieldMultiReference"
    )
    .map<FieldsReferences>((field) => {
      switch (field.__typename) {
        case "CollectionItemFieldReference": {
          const entityType = field.type.collectionType.id;
          const entityValues = createEntityValue({
            fieldId: field.type.id,
            collectionId: field.referenceValues.collectionItem.id
          });

          return {
            appliedFor: 1,
            entityType,
            entityValues: [entityValues],
            fieldId: field.type.id
          };
        }
        case "CollectionItemFieldMultiReference": {
          const entityType = field.type.collectionType.id;
          const entityValues = field.multiReferenceValues.collectionItems.map(
            ({ id }) =>
              createEntityValue({ fieldId: field.type.id, collectionId: id })
          );

          return {
            appliedFor: 1,
            entityType,
            entityValues,
            fieldId: field.type.id
          };
        }
      }
    });
}

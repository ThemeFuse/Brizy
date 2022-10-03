import { isT } from "fp-utilities";
import _ from "underscore";
import Config, { isWp } from "visual/global/Config";
import {
  isCollectionPage,
  isCustomerPage
} from "visual/global/Config/types/configs/Cloud";
import { ReduxState } from "visual/redux/types";
import {
  AllRule,
  CollectionItemRule,
  CollectionTypeRule,
  GlobalBlock,
  isWPPage,
  Page,
  PageCollection,
  Rule
} from "visual/types";
import {
  isReferenceAllAuthor,
  isReferenceAllChild,
  isReferenceAllIn,
  isReferenceSpecificAuthor,
  isReferenceSpecificChild,
  isReferenceSpecificIn
} from "visual/types/utils";
import {
  GetCollectionItem_collectionItem_fields_CollectionItemFieldMultiReference as CollectionItemFieldMultiReference,
  GetCollectionItem_collectionItem_fields_CollectionItemFieldReference as CollectionItemFieldReference
} from "visual/utils/api/cms/graphql/types/GetCollectionItem";
import { IS_TEMPLATE } from "visual/utils/models";
import {
  createEntityValue,
  CUSTOMER_TYPE,
  getCurrentRule,
  getEntityValue,
  TEMPLATES_GROUP_ID,
  TEMPLATE_TYPE
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

export const getAllowedGBIds = (
  pageBlocksIds: Page["id"][],
  globalBlocks: ReduxState["globalBlocks"],
  page: ReduxState["page"]
): string[] => {
  return Object.entries(globalBlocks).reduce<string[]>(
    (acc, [currentGlobalBlockId, globalBlock]) => {
      const isInPage = pageBlocksIds.includes(currentGlobalBlockId);

      if (!isInPage && canUseCondition(globalBlock, page)) {
        acc.push(currentGlobalBlockId);
      }

      return acc;
    },
    []
  );
};

export function canUseCondition(globalBlock: GlobalBlock, page: Page): boolean {
  if (isPopup(globalBlock.data)) {
    return true;
  }

  return IS_TEMPLATE
    ? canUseConditionInTemplates(globalBlock, page)
    : canUseConditionInPage(globalBlock, page);
}

export function canUseConditionInTemplates(
  { rules }: GlobalBlock,
  page: Page
): boolean {
  const config = Config.getAll();

  if (!isWp(config)) {
    return false;
  }

  const { ruleMatches } = config.wp;

  const templateCondition = rules.find((rule) => {
    if (isCollectionItemRule(rule)) {
      return (
        rule.appliedFor === TEMPLATES_GROUP_ID &&
        rule.entityType === TEMPLATE_TYPE &&
        //String(v) - for old users where entityValue can store as number
        rule.entityValues.some((v) => String(v) === page.id)
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
        _.intersection(entityValues, rule.entityValues).length
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

export function pageSplitRules(rules: Rule[] = [], page: Page): SplitRules {
  const currentRule = getCurrentRule(page);

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
      .map((ref) => _.intersection(ref.entityValues, rule.entityValues))
      .flat();

    return intersectionRule.length;
  });

  const referenceAll = _.difference(referenceRule, specificReference).find(
    (r) => {
      const intersectionRule = refs.filter((ref) =>
        r.entityValues.some((r) => ref.fieldId === r)
      );
      return intersectionRule.length;
    }
  );

  return { referenceSingle, referenceAll };
}

function pageCustomerSplitRules(rules: Rule[], page: Page): Rule | undefined {
  if (!isCustomerPage(page)) {
    return undefined;
  }
  const { groups } = page;

  if (groups.length === 0) {
    return undefined;
  }
  const groupIds = groups.map((group) => group.id);

  return rules
    .filter(
      (rule): rule is CollectionItemRule =>
        isCollectionItemRule(rule) && rule.entityType === CUSTOMER_TYPE
    )
    .find((rule) => _.intersection(groupIds, rule.entityValues).length > 0);
}

function pageWPSplitRules(rules: Rule[] = [], page: Page): ReferenceRule {
  const config = Config.getAll();
  const r = {
    referenceAll: undefined,
    referenceSingle: undefined
  };

  if (!isWp(config) || !isWPPage(page)) {
    return r;
  }

  const currentRule = getCurrentRule(page);
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
        // @ts-expect-error: skip "in"
        const [_, taxonomy] = v.split("|"); // eslint-disable-line @typescript-eslint/no-unused-vars
        const taxonomies = postTerms.filter((p) => p.taxonomy === taxonomy);

        return taxonomies.length > 0;
      }

      if (isReferenceAllChild(v)) {
        // @ts-expect-error: skip "child"
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

export function canUseConditionInPage(
  globalBlock: GlobalBlock,
  page: Page
): boolean {
  if (!globalBlock) {
    // Normally it should never happen.
    // Some projects has globalBlock into pageJson and doesn't have it into globalBlocks
    // and preview corrupts
    if (IS_EDITOR) {
      throw Error("GlobalBlock should exist");
    } else {
      // block will be ignored by compiler
      return false;
    }
  }

  const { rules } = globalBlock;

  const {
    level1: level1Rule,
    level2: level2Rule,
    level3: level3Rule
  } = pageSplitRules(rules, page);

  const referenceRule = pageCMSSplitRules(rules, page);

  const wpReferenceRule = pageWPSplitRules(rules, page);

  const referenceCustomerRule = pageCustomerSplitRules(rules, page);

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

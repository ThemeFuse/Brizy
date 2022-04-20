/* eslint-disable @typescript-eslint/no-use-before-define */
import _ from "underscore";
import Config from "visual/global/Config";
import {
  GetCollectionItem_collectionItem_fields_CollectionItemFieldMultiReference as CollectionItemFieldMultiReference,
  GetCollectionItem_collectionItem_fields_CollectionItemFieldReference as CollectionItemFieldReference
} from "visual/utils/api/cms/graphql/types/GetCollectionItem";
import {
  getCurrentRule,
  TEMPLATES_GROUP_ID,
  TEMPLATE_TYPE,
  CUSTOMER_TYPE
} from "./blocksConditions";
import { isPopup } from "./isPopup";
import { IS_TEMPLATE } from "visual/utils/models";
import {
  isCollectionPage,
  isCustomerPage
} from "visual/global/Config/types/configs/Cloud";
import {
  AllRule,
  CollectionItemRule,
  CollectionTypeRule,
  GlobalBlock,
  Page,
  PageCollection,
  Rule
} from "visual/types";
import { ReduxState } from "visual/redux/types";
import { isWp } from "visual/global/Config/types/configs/WP";
import {
  isAllRule,
  isCollectionItemRule,
  isCollectionTypeRule
} from "visual/utils/blocks/guards";

interface FieldsReferences {
  appliedFor: 1;
  entityType: string;
  entityValues: string[];
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

  const templateCondition = rules.find(rule => {
    if (isCollectionItemRule(rule)) {
      return (
        rule.appliedFor === TEMPLATES_GROUP_ID &&
        rule.entityType === TEMPLATE_TYPE &&
        //String(v) - for old users where entityValue can store as number
        rule.entityValues.some(v => String(v) === page.id)
      );
    }
  });

  if (templateCondition) {
    return isIncludeCondition(templateCondition);
  }

  // @ts-expect-error: mode missing, we are added in next pr
  const templateRules: Rule[] = ruleMatches.map(
    ({ type, group, entityType, values }) => ({
      type,
      entityType,
      appliedFor: group,
      entityValues: values
    })
  );

  const blockGroupedRules = templateSplitRules(rules);
  const templateGroupedRules = templateSplitRules(templateRules);

  const itemCondition = blockGroupedRules.level1.find(rule =>
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

  const typeCondition = blockGroupedRules.level2.find(rule =>
    templateGroupedRules.level2.find(
      ({ entityType, appliedFor }) =>
        appliedFor === rule.appliedFor && entityType === rule.entityType
    )
  );

  if (typeCondition) {
    return isIncludeCondition(typeCondition);
  }

  // condition = blockGroupedRules.level3.find(rule =>
  //   templateGroupedRules.level3.find(
  //     ({ appliedFor }) => appliedFor === rule.appliedFor
  //   )
  // );

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

      if (isAllRule(rule)) {
        acc.level3.push(rule);
      } else if (isCollectionItemRule(rule)) {
        acc.level1.push(rule);
      } else {
        acc.level2.push(rule);
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
          rule.appliedFor === currentRule.group &&
          rule.entityType === currentRule.type &&
          rule.entityValues.some(v => String(v) === String(currentRule.id))
        ) {
          acc.level1 = rule;
        }
      } else if (isCollectionTypeRule(rule)) {
        if (
          rule.appliedFor === currentRule.group &&
          rule.entityType === currentRule.type &&
          !rule.entityValues.length
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

function pageCMSSplitRules(rules: Rule[] = [], page: Page): Rule | undefined {
  if (!isCollectionPage(page)) {
    return undefined;
  }

  const { fields } = page;
  const refs: FieldsReferences[] | undefined = getFieldsReferences(fields);

  if (refs === undefined) {
    return undefined;
  }

  return rules.filter(isCollectionItemRule).find(rule => {
    let equalRules = [];

    refs.forEach(ref => {
      if (ref.entityType === rule.entityType) {
        equalRules = _.intersection(ref.entityValues, rule.entityValues);
      }
    });

    return equalRules.length;
  });
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

  const referenceCustomerRule = pageCustomerSplitRules(rules, page);

  const referenceRule: Rule | undefined = pageCMSSplitRules(rules, page);

  if (level1Rule) {
    return isIncludeCondition(level1Rule);
  }

  if (referenceRule) {
    return isIncludeCondition(referenceRule);
  }

  if (referenceCustomerRule) {
    return isIncludeCondition(referenceCustomerRule);
  }

  if (level2Rule) {
    return isIncludeCondition(level2Rule);
  }

  if (level3Rule) {
    return isIncludeCondition(level3Rule);
  }

  return false;
}

export function isIncludeCondition(condition: Rule): boolean {
  return condition.type === 1;
}

function getFieldsReferences(
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
    .map<FieldsReferences>(field => {
      switch (field.__typename) {
        case "CollectionItemFieldReference": {
          const entityType = field.type.collectionType.id;
          const entityValues = field.referenceValues.collectionItem.id;

          return {
            appliedFor: 1,
            entityType,
            entityValues: [entityValues]
          };
        }
        case "CollectionItemFieldMultiReference": {
          const entityType = field.type.collectionType.id;
          const entityValues = field.multiReferenceValues.collectionItems.map(
            ({ id }) => id
          );

          return {
            appliedFor: 1,
            entityType,
            entityValues
          };
        }
      }
    });
}

function pageCustomerSplitRules(rules: Rule[], page: Page): Rule | undefined {
  if (!isCustomerPage(page)) {
    return undefined;
  }
  const { groups } = page;

  if (groups.length === 0) {
    return undefined;
  }
  const groupIds = groups.map(group => group.id);

  return rules
    .filter(
      (rule): rule is CollectionItemRule | CollectionTypeRule =>
        (isCollectionItemRule(rule) || isCollectionTypeRule(rule)) &&
        rule.entityType === CUSTOMER_TYPE
    )
    .find(rule => _.intersection(groupIds, rule.entityValues).length > 0);
}

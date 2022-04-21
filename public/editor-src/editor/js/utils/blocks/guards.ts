import {
  Rule,
  AllRule,
  CollectionItemRule,
  CollectionTypeRule
} from "visual/types";

export function isCollectionItemRule(rule: Rule): rule is CollectionItemRule {
  return (
    (rule as CollectionItemRule).entityValues !== undefined &&
    (rule as CollectionItemRule).entityValues.length > 0
  );
}

export function isCollectionTypeRule(rule: Rule): rule is CollectionTypeRule {
  return (
    ((rule as CollectionItemRule).entityValues === undefined ||
      (rule as CollectionItemRule).entityValues.length === 0) &&
    (rule as CollectionTypeRule).entityType !== undefined &&
    (rule as CollectionTypeRule).appliedFor !== null
  );
}

export function isAllRule(rule: Rule): rule is AllRule {
  return (
    (rule as CollectionTypeRule).appliedFor === null &&
    ((rule as CollectionTypeRule).entityType === "" ||
      (rule as CollectionTypeRule).entityType === undefined)
  );
}

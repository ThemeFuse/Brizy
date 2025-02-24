import {
  AllRule,
  CollectionItemRule,
  CollectionTypeRule,
  Rule
} from "visual/types/Rule";

export function isCollectionItemRule(rule: Rule): rule is CollectionItemRule {
  const appliedFor = "appliedFor" in rule;
  const entityType = "entityType" in rule;
  const entityValues = "entityValues" in rule && rule.entityValues.length > 0;

  return appliedFor && entityType && entityValues;
}

export function isCollectionTypeRule(rule: Rule): rule is CollectionTypeRule {
  const appliedFor = "appliedFor" in rule && rule.appliedFor !== null;
  const entityType = "entityType" in rule;
  const entityValues = !("entityValues" in rule);

  return appliedFor && entityType && entityValues;
}

export function isAllRule(rule: Rule): rule is AllRule {
  const appliedFor = !("appliedFor" in rule);
  const entityType = !("entityType" in rule);
  const entityValues = !("entityValues" in rule);

  return appliedFor && entityType && entityValues;
}

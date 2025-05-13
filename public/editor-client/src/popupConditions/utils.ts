import { MValue } from "@/utils/types";
import { Obj } from "@brizy/readers";
import { match } from "fp-utilities";
import {
  AllRule,
  ApiAllRule,
  ApiCollectionItemRule,
  ApiCollectionTypeRule,
  ApiRule,
  CollectionItemRule,
  CollectionTypeRule,
  Rule
} from "types/Rule";

const isApiItemRule = (rule: ApiRule): rule is ApiCollectionItemRule => {
  return "entityValues" in rule && rule.entityValues.length > 0;
};

const isApiTypeRule = (rule: ApiRule): rule is ApiCollectionTypeRule => {
  return (
    "appliedFor" in rule &&
    rule.appliedFor !== null &&
    "entityValues" in rule &&
    rule.entityValues.length === 0 &&
    rule.entityType !== undefined
  );
};

const isApiAllRule = (rule: ApiRule): rule is ApiAllRule => {
  return (
    "appliedFor" in rule &&
    rule.appliedFor === null &&
    (rule.entityType === "" || rule.entityType === undefined)
  );
};

const matches = match(
  [
    isApiItemRule,
    (rule: ApiCollectionItemRule): CollectionItemRule => {
      return {
        mode: rule.mode ?? "specific",
        type: rule.type,
        appliedFor: rule.appliedFor,
        entityType: rule.entityType,
        entityValues: rule.entityValues
      };
    }
  ],
  [
    isApiTypeRule,
    (rule: ApiCollectionTypeRule): CollectionTypeRule => {
      return {
        type: rule.type,
        appliedFor: rule.appliedFor,
        entityType: rule.entityType
      };
    }
  ],
  [
    isApiAllRule,
    (rule: ApiAllRule): AllRule => {
      return {
        type: rule.type
      };
    }
  ]
);

export const apiRuleToEditorRule = (v: unknown): MValue<Rule> => {
  const rule = Obj.read(v);

  if (rule) {
    return matches(rule as unknown as ApiRule);
  }

  return undefined;
};

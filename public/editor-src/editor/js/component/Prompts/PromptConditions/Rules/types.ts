import { EntityTypeRule } from "visual/types/Rule";

export type StatusRule = "published" | "draft";

export interface ValueItems {
  title: string;
  value: EntityTypeRule;
  status?: StatusRule;
}

export type CmsListItem = {
  title: string;
  value: string;
  mode: "specific" | "reference";
  disabled?: boolean;
  status?: "publish" | "draft" | "pending";
  items: ValueItems[];
};

export type LegacyRuleListItem = {
  title: string;
  value: string;
  disabled?: boolean;
  status?: "publish" | "draft" | "pending";
  // without the line below type guard won't work, because
  // this type is "subtype" of CmsListItem
  items?: never;
};

export type RuleListItem = LegacyRuleListItem | CmsListItem;

export interface RuleList {
  title: string;
  value: string;
  groupValue?: number;
  disabled?: boolean;
  items?: RuleListItem[];
}

export const isCMSRuleListItem = (
  listItem: RuleListItem
): listItem is CmsListItem => (listItem as CmsListItem).items !== undefined;

export const isLegacyRuleListItem = (
  listItem: RuleListItem
): listItem is LegacyRuleListItem => {
  return !isCMSRuleListItem(listItem);
};

interface ListRuleItems<T> {
  item: T;
  onClick: (value: string) => void;
  value: string;
}

export type RuleListProps = ListRuleItems<CmsListItem>;
export type LegacyRuleListProps = ListRuleItems<RuleListItem>;

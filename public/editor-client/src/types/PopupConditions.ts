import { EntityTypeRule } from "@/types/Rule";
import { Response } from "./Response";

export interface Rule {
  type: string;
  appliedFor: number;
  entityType: string;
  mode: "reference" | "specific";
  entityValues: Array<string>;
}

export interface Extra {
  rules: Array<Rule>;
  dataVersion: number;
}

export interface PopupConditions {
  conditions?: {
    save: (
      res: Response<Array<Rule>>,
      rej: Response<string>,
      extra: Extra
    ) => void;
    getRuleList?: (res: Response<Array<Rule>>, rej: Response<string>) => void;
    getGroupList?: (
      res: Response<Array<RuleList[]>>,
      rej: Response<string>,
      type: "block" | "popup"
    ) => void;
  };
}
export interface RuleList {
  title: string;
  value: string;
  groupValue?: number;
  disabled?: boolean;
  items?: RuleListItem[];
}

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

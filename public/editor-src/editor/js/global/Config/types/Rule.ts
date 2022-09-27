import { BlockTypeRule } from "visual/types";

export interface Rule {
  type: BlockTypeRule;
  entityType: string;
  group: number;
  values: string[];
}

import { BlockTypeRule } from "visual/types/Rule";

export interface Rule {
  type: BlockTypeRule;
  entityType: string;
  group: number;
  values: string[];
}

import { ReduxState } from "visual/redux/types";
import { GlobalBlock, GlobalBlockPosition, Rule as GbRule } from "visual/types";

export type PB = ReduxState["blocksOrder"];
export type GB = ReduxState["globalBlocks"];
export type GBIds = (keyof GB)[];

export type GBP = { [key: string]: GlobalBlock["position"] };

export type GBPWithoutNull = { [key: string]: GlobalBlockPosition };

export type PositionAlign = "top" | "bottom";

export type AlignsList = PositionAlign | "center";

export type SortedGBPositions = {
  globalBlockId: string;
  align: PositionAlign;
}[];

export type Rule = {
  group: GbRule["appliedFor"];

  type: GbRule["entityType"];

  id: string | number;
};

export type SurroundedConditionsIds = {
  top: PB;
  bottom: PB;
};

export type InsertScheme = {
  [k: string]: {
    before: SortedGBPositions;
    after: SortedGBPositions;
  };
};

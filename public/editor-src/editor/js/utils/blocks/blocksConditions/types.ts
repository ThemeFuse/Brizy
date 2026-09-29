import type { ReduxState } from "visual/redux/types";
import type {
  GlobalBlock,
  GlobalBlockPosition
} from "visual/types/GlobalBlock";

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

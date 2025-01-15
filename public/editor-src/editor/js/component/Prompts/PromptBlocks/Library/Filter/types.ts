import { BlockTypes } from "../../types";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export interface Props<T extends BlockTypes> {
  type: T;
  value: string;
  onChange: (v: string) => void;
  api: ConfigCommon["api"];
}

export type Choices = Array<{ id: string; label: string }>;

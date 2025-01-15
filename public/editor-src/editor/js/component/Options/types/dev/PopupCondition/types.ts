import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export interface Props {
  className: string;
  attr: { className?: string };
}

export interface Trigger {
  active: boolean;
  id: string;
  value: string;
}

export interface ConditionsProps {
  config: ConfigCommon;
}

export type Value = MValue<Literal>;

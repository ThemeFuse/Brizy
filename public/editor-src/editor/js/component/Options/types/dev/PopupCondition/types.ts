import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { Literal } from "visual/utils/types/Literal";
import type { MValue } from "visual/utils/value";

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

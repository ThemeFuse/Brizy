import { Config } from "visual/global/Config";
import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";

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
  config: Config;
}

export type Value = MValue<Literal>;

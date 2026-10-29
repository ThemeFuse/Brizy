import type * as Option from "visual/component/Options/Type";
import type { Choices } from "visual/component/Options/types/common/Population/types/Choices";
import type { WithConfig } from "visual/types/attributes";
import type { Literal } from "visual/utils/types/Literal";
import type { Value } from "../../common/Population/types/Value";

export interface Config {
  activeChoice: string;
  choices: Array<Choices<Literal>>;
}

export type Props = Option.Props<Value, Value> & WithConfig<Config>;

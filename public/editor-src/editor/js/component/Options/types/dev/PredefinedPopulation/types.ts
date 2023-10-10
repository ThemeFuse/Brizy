import * as Option from "visual/component/Options/Type";
import { Choices } from "visual/component/Options/types/common/Population/types/Choices";
import { WithConfig } from "visual/utils/options/attributes";
import { Literal } from "visual/utils/types/Literal";
import type { Value } from "../../common/Population/types/Value";

interface Config {
  activeChoice: string;
  choices: Array<Choices<Literal>>;
}

export type Props = Option.Props<Value, Value> & WithConfig<Config>;

import { Props as P } from "visual/component/Options/types/dev/MultiSelect/types";
import { OnChange, SimpleValue } from "visual/component/Options/Type";
import { Literal } from "visual/utils/types/Literal";

export type Props = Exclude<P, "value" | "onChange"> & {
  value: Literal;
  onChange: OnChange<SimpleValue<Literal>>;
};

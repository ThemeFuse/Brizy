import type { Props as OptionProps } from "visual/component/Options/Type";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import type { WithConfig, WithValue } from "visual/types/attributes";

export type Props = OptionProps<WithValue<string[]>> &
  WithConfig<{ type?: ElementTypes }>;

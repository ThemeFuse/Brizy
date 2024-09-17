import { NonEmptyArray } from "visual/utils/array/types";
import { ReactElement } from "react";
import { Literal } from "visual/utils/types/Literal";
import { Props as ItemProps } from "visual/component/Controls/IconToggle/IconToggleItem";

export const isNonEmptyArray = (
  choices: unknown
): choices is NonEmptyArray<ReactElement<ItemProps<Literal>>> =>
  Array.isArray(choices) && choices.length > 0;

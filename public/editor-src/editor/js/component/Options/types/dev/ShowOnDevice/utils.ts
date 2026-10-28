import type { ReactElement } from "react";
import type { Props as ItemProps } from "visual/component/Controls/IconToggle/IconToggleItem";
import type { NonEmptyArray } from "visual/utils/array/types";
import type { Literal } from "visual/utils/types/Literal";

export const isNonEmptyArray = (
  choices: unknown
): choices is NonEmptyArray<ReactElement<ItemProps<Literal>>> =>
  Array.isArray(choices) && choices.length > 0;

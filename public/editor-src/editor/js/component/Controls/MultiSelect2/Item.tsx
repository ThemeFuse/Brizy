import React, { ReactElement } from "react";
import { Literal } from "visual/utils/types/Literal";
import { MultiSelectItemProps as Props } from "./types";

export function MultiSelectItem<T extends Literal>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props: Props<T>
): ReactElement {
  // noop. This element is used in a more unusual way
  // as it is provides a sort of interface for MultiSelect children
  return <span />;
}

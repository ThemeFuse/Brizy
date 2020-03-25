import { PropsWithChildren, ReactElement } from "react";
import { Value } from "visual/component/Controls/MultiSelect/types/Value";

export type ItemProps = PropsWithChildren<{
  value: Value;
  active?: boolean;
}>;

export type ItemInstance = ReactElement<ItemProps>;

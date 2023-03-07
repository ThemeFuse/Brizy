import { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import {
  OptionName,
  OptionPatch,
  OptionValue
} from "visual/component/Options/types";
import { ToolbarItemsInstance } from "visual/component/Toolbar/ToolbarItems";
import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";

export type OnChange<T> = (v: T) => void;

export type SimpleValue<T> = { value: T };

export type FromElementModelGetter = (k: string) => MValue<Literal>;

export const callGetter =
  (s: string) =>
  (g: FromElementModelGetter): MValue<Literal> =>
    g(s);

export type FromElementModel<T extends OptionName> = (
  get: FromElementModelGetter
) => Partial<OptionValue<T>>;

export type ToElementModel<T extends OptionName> = (
  value: OptionPatch<T>
) => ElementModel;

export type Props<Model, Patch = Model> = {
  value: Model;
  onChange: OnChange<Patch>;
  toolbar?: ToolbarItemsInstance;
  label?: ReactNode;
  description?: ReactNode;
};

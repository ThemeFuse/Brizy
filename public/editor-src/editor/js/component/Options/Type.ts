import { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import {
  OptionMeta,
  OptionName,
  OptionPatch,
  OptionValue
} from "visual/component/Options/types";
import { ToolbarItemsInstance } from "visual/component/Toolbar/ToolbarItems";
import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";

export interface GlobalMeta {
  isChanging: boolean;
}

export type OnChange<T, M = GlobalMeta> = (v: T, m?: M) => void;

export type SimpleValue<T> = { value: T };

export type FromElementModelGetterValue = MValue<Literal | boolean>;

export type FromElementModelGetter = (
  k: string,
  withoutId?: boolean
) => FromElementModelGetterValue;

export type FromElementModel<T extends OptionName> = (
  get: FromElementModelGetter
) => Partial<OptionValue<T>>;

export type ToElementModel<T extends OptionName> = (
  value: OptionPatch<T>
) => ElementModel;

export type ToMeta<T extends OptionName> = (
  v: OptionValue<T>
) => Partial<OptionMeta<T>>;

export type Props<Model, Patch = Model> = {
  value: Model;
  onChange: OnChange<Patch>;
  toolbar?: ToolbarItemsInstance;
  label?: JSX.Element;
  description?: ReactNode;
  location?: string;
};

export type Meta<T> = {
  meta?: T;
};

import { ReactNode } from "react";
import { MValue } from "visual/utils/value";
import { OptionName } from "visual/component/Options/types";
import { Literal } from "visual/utils/types/Literal";
import { ElementModel } from "visual/component/Elements/Types";
import {
  GenericToolbarItemType,
  ToolbarItemType
} from "visual/editorComponents/ToolbarItemType";
import { ToolbarItemsInstance } from "visual/component/Toolbar/ToolbarItems";

export type OnChange<T> = (v: T) => void;

export type SimpleValue<T> = { value: T };

export type FromElementModelGetter = (k: string) => MValue<Literal>;

export const callGetter = (s: string) => (
  g: FromElementModelGetter
): MValue<Literal> => g(s);

export type FromElementModel<M> = (get: FromElementModelGetter) => Partial<M>;

export type ToElementModel<M> = (value: M) => ElementModel;

export type Props<Model, Patch = Model> = {
  value: Model;
  onChange: OnChange<Patch>;
  toolbar?: ToolbarItemsInstance;
  label?: ReactNode;
  description?: ReactNode;
};

export type OptionType<M, Patch = M> = {
  fromElementModel: FromElementModel<M>;
  defaultValue: M;
  toElementModel: ToElementModel<Patch>;
};

export interface SelfFilter<Type extends OptionName> {
  /**
   * @internal
   */
  filter: (
    f: (t: ToolbarItemType) => ToolbarItemType | undefined,
    t: GenericToolbarItemType<Type>
  ) => GenericToolbarItemType<Type> | undefined;

  /**
   * @internal
   */
  map: (
    f: (t: ToolbarItemType) => ToolbarItemType,
    t: GenericToolbarItemType<Type>
  ) => GenericToolbarItemType<Type>;

  /**
   * @internal
   */
  reduce: <T>(
    fn: (acc: T, item: ToolbarItemType) => T,
    t0: T,
    item: GenericToolbarItemType<Type>
  ) => T;
}

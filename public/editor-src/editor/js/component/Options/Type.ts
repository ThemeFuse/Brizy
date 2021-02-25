import { MValue } from "visual/utils/value";
import { OptionName, OptionTypes } from "visual/component/Options/types";
import { ComponentProps, ReactNode } from "react";
import { Literal } from "visual/utils/types/Literal";
import { ElementModel } from "visual/component/Elements/Types";
import {
  WithClassName,
  WithHelper,
  WithId,
  WithLabel
} from "visual/utils/options/attributes";

export type OnChange<T> = (v: T) => void;

export type SimpleValue<T> = { value: T };

export type GetModel<M> = (get: (k: string) => MValue<Literal>) => Partial<M>;

export type GetElementModel<M> = (
  value: M,
  get: (k: string) => string
) => ElementModel;

export type Props<Model> = {
  value: Model;
  onChange: OnChange<ElementModel>;
  toolbar?: object;
  label?: ReactNode;
  description?: ReactNode;
};

export type OptionType<M extends Patch, Patch = M> = {
  getModel: GetModel<M>;
  defaultValue: M;
  getElementModel: GetElementModel<Patch>;
};

export interface GenericOptionDefinition<K extends OptionName>
  extends WithId<string>,
    WithLabel,
    WithHelper,
    WithClassName {
  type: K;
  value: ComponentProps<OptionTypes[K]>["value"];
  onChange: ComponentProps<OptionTypes[K]>["onChange"];
}

type OptionsDefinitions = { [P in OptionName]: GenericOptionDefinition<P> };

export type OptionDefinition = OptionsDefinitions[keyof OptionsDefinitions];

export type ShouldBeFiltered<K extends OptionName> = (
  props: GenericOptionDefinition<K>
) => boolean;

export interface SelfFilter<P> {
  shouldOptionBeFiltered: (props: P) => boolean;
}

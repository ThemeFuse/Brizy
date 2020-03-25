import { MValue } from "visual/utils/value";
import { OptionName, OptionTypes } from "visual/component/Options/types";
import { ComponentProps } from "react";
import { Literal } from "visual/utils/types/Literal";
import {
  WithClassName,
  WithHelper,
  WithId,
  WithLabel
} from "visual/utils/options/attributes";

export type OnChange<T> = (v: T) => void;

export type SimpleValue<T> = { value: T };

export type GetModel<M> = (get: (k: string) => MValue<Literal>) => M;

export type Props<Model, Patch> = {
  value: Model;
  onChange: OnChange<Patch>;
  toolbar?: object;
};

export interface OptionType<M> {
  getModel: GetModel<M>;
}

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

import { ComponentProps } from "react";
import {
  OptionName,
  OptionTypes,
  OptionValue
} from "visual/component/Options/types";
import { UserRole } from "visual/types";
import { Device } from "visual/utils/devices";
import { Disabled } from "visual/utils/disabled";
import {
  WithClassName,
  WithHelper,
  WithId,
  WithLabel,
  WithPopulation
} from "visual/utils/options/attributes";
import { State } from "visual/utils/stateMode";

export type GenericToolbarItemType<K extends OptionName> = WithId<string> &
  WithLabel &
  WithHelper &
  WithClassName &
  WithPopulation &
  Omit<
    ComponentProps<OptionTypes[K]>,
    | "type"
    | "value"
    | "onChange"
    | "devices"
    | "states"
    | "position"
    | keyof WithLabel
    | keyof WithHelper
    | keyof WithClassName
    | keyof WithPopulation
  > & {
    type: K;
    disabled?: Disabled;
    devices?: Device;
    states?: State[];
    position?: number;
    roles?: UserRole[]; //TODO: Make sure that roles are a concrete type, not string
    isPro?: boolean;
  };

type ToolbarItemsTypes = { [P in OptionName]: GenericToolbarItemType<P> };

export type ToolbarItemType = ToolbarItemsTypes[keyof ToolbarItemsTypes];

export type OptionDefinition<T extends OptionName = OptionName> =
  GenericToolbarItemType<T> & {
    value: OptionValue<T>;
    onChange: (v: OptionValue<T>) => void;
  };

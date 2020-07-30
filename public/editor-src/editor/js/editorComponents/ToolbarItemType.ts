import {
  WithClassName,
  WithConfig,
  WithHelper,
  WithId,
  WithLabel,
  WithPopulation
} from "visual/utils/options/attributes";
import { OptionName, OptionTypes } from "visual/component/Options/types";
import { ComponentProps } from "react";
import { Device } from "visual/utils/devices";
import { Disabled } from "visual/utils/disabled";
import { State } from "visual/utils/stateMode";

export interface GenericToolbarItemType2<K extends OptionName>
  extends WithId<string>,
    WithLabel,
    WithHelper,
    WithClassName,
    WithPopulation,
    WithConfig<ComponentProps<OptionTypes[K]>["config"]> {
  type: K;
  value?: Partial<ComponentProps<OptionTypes[K]>["value"]>;
  disabled?: Disabled;
  devices?: Device;
  states?: State[];
  options?: ToolbarItemType[];
  position?: number;
}

export type GenericToolbarItemType<K extends OptionName> = WithId<string> &
  WithLabel &
  WithHelper &
  WithClassName &
  WithPopulation & {
    type: K;
    disabled?: Disabled;
    devices?: Device;
    states?: State[];
    position?: number;
    value?: Partial<ComponentProps<OptionTypes[K]>["value"]>;
  } & Exclude<ComponentProps<OptionTypes[K]>, "onChange" | "value">;

type ToolbarItemsTypes = { [P in OptionName]: GenericToolbarItemType<P> };

export type ToolbarItemType = ToolbarItemsTypes[keyof ToolbarItemsTypes];

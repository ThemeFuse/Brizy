import { Obj } from "@brizy/readers";
import { ComponentProps } from "react";
import {
  OptionMeta,
  OptionName,
  OptionTypes,
  OptionValue
} from "visual/component/Options/types";
import { UserRole } from "visual/types";
import {
  WithClassName,
  WithHelper,
  WithId,
  WithLabel,
  WithPopulation
} from "visual/types/attributes";
import { OptionStyle } from "visual/utils/cssStyle/types";
import { Device } from "visual/utils/devices";
import { Disabled } from "visual/utils/disabled";
import { State } from "visual/utils/stateMode";
import { MValue } from "visual/utils/value";

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
    style?: OptionStyle<K>;
    selector?: string;
    preserveId?: boolean;
    default?: Partial<OptionValue<K>>;
  };

type ToolbarItemsTypes = { [P in OptionName]: GenericToolbarItemType<P> };

export type ToolbarItemType = ToolbarItemsTypes[keyof ToolbarItemsTypes];

export type ToolbarItemTypeWithColumns = ToolbarItemType & {
  columns: ToolbarItemType[];
};

export type ToolbarItemTypeWithOptions = ToolbarItemType & {
  options: ToolbarItemType[];
};

export type ToolbarItemTypeWithTabs = ToolbarItemType & {
  tabs: ToolbarItemType[];
};

export type ToolbarItemTypeWithChildOption = ToolbarItemType & {
  option: ToolbarItemType;
};

export const hasId = (o: unknown): boolean =>
  Obj.isObject(o) && Obj.hasKey("id", o);

export const is =
  (checker: (o: unknown) => boolean) =>
  (o: unknown): o is ToolbarItemType =>
    checker(o);

export type Meta = MValue<{ [k: string]: unknown }>;

export type OptionDefinition<T extends OptionName = OptionName> =
  GenericToolbarItemType<T> & {
    value: OptionValue<T>;
    onChange: (v: OptionValue<T>, meta: Meta) => void;
    meta?: Partial<OptionMeta<T>>;
    dependencies?: (v: OptionValue<T>) => void;
  };

import React from "react";
import * as Option from "visual/component/Options/Type";
import { Image } from "./model";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
import { Patch, SizePatch } from "./types/Patch";

export interface Size {
  value: string;
  label: string;
}

export interface Value extends Image, SizePatch {}

export interface Config {
  pointer?: boolean;
  edit?: boolean;
  disableSizes?: boolean;
}

export type Props = Option.Props<Value, Patch> &
  WithConfig<Config> &
  WithClassName;

export type Component = React.FC<Props> & Option.OptionType<Value, Patch>;

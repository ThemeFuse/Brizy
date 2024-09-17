import React from "react";
import { Props as OptionProps } from "visual/component/Options/Type";
import { WithClassName, WithConfig } from "visual/types/attributes";
import { Image } from "./model";
import { Patch, SizePatch } from "./types/Patch";

export type Extensions = "svg" | "png" | "jpg" | "jpeg" | "gif" | "webp";

export interface Size {
  value: string;
  label: string;
}

export interface Value extends Image, SizePatch {}

export interface Config {
  pointer?: boolean;
  edit?: boolean;
  disableSizes?: boolean;
  acceptedExtensions?: Extensions[];
}

export type Props = OptionProps<Value, Patch> &
  WithConfig<Config> &
  WithClassName;

export type Component = React.FC<Props>;

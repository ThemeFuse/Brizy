import React from "react";
import type { Props as OptionProps } from "visual/component/Options/Type";
import type { WithClassName, WithConfig } from "visual/types/attributes";
import type { Patch, SizePatch } from "visual/utils/options/ImageUpload/Patch";
import type { Image } from "./model";

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

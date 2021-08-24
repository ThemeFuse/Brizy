import React from "react";
import * as Option from "visual/component/Options/Type";
import { Image } from "./model";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";

export interface Value extends Image, SizePatch {}

export type ImageDataPatch = {
  imageSrc: string;
  imageExtension: string;
  imageWidth: number;
  imageHeight: number;
};

export type PositionPatch = {
  positionX: number;
  positionY: number;
};

export type SizePatch = {
  sizeType: string;
};

export interface Config {
  pointer?: boolean;
  edit?: boolean;
  disableSizes?: boolean;
  sizes?: Array<{ value: string; label: string }>;
}

export type Props = Option.Props<Value> & WithConfig<Config> & WithClassName;

export type Component = React.FC<Props> & Option.OptionType<Value>;

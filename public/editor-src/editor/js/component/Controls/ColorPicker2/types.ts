import { MouseEvent, TouchEvent } from "react";
import _ from "underscore";

import HSLA = tinycolor.ColorFormats.HSLA;
import HSVA = tinycolor.ColorFormats.HSVA;
import RGBA = tinycolor.ColorFormats.RGBA;

export interface HSLAwithSource extends HSLA {
  source: string;
}

export interface HSVAwithSource extends HSVA {
  source: string;
}

export interface HSVAChange extends HSVA {
  source: string;
  wasChanged: string;
  opacityDragEnd?: boolean;
  hsv?: HSVA;
  hsl?: HSLA;
  rgb?: RGBA;
  hex?: string;
  oldHue?: number;
}

export interface HSLAChange extends HSLA {
  source: string;
  wasChanged: string;
  opacityDragEnd?: boolean;
  hsv?: HSVA;
  hsl?: HSLA;
  rgb?: RGBA;
  hex?: string;
  oldHue?: number;
}

export type ChangeFunction = (
  data: HSLAChange | HSVAChange,
  e: TouchEvent | MouseEvent
) => void;

export const isHSLAChange = (
  data: HSLAChange | HSVAChange | string
): data is HSLAChange =>
  _.has(data, "h") && _.has(data, "s") && _.has(data, "l");

export const isHSVAChange = (
  data: HSLAChange | HSVAChange | string
): data is HSVAChange =>
  _.has(data, "h") && _.has(data, "s") && _.has(data, "v");

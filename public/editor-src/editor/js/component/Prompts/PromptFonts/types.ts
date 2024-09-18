import { MouseEvent, ReactElement } from "react";
import { ReduxState } from "visual/redux/types";

export type Fonts = ReduxState["fonts"];

export type FontTypes = keyof Fonts;

type StrictFonts = Required<Fonts>;

type Font<T extends FontTypes> = StrictFonts[T]["data"][0];

type WithFontGroupType<T, G> = T & {
  fontGroupType: G;
};
export type FontGroup<T extends FontTypes> = WithFontGroupType<Font<T>, T>;

export interface StateToProps {
  fonts: ReduxState["fonts"];
}
export interface Circle {
  classname: string;
  children: ReactElement;
  hint?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

export interface Tooltip {
  children: ReactElement;
  hint: string;
  className: string;
}

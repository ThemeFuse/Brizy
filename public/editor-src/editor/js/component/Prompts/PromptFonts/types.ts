import { ReduxState } from "visual/redux/types";

type Fonts = ReduxState["fonts"];

export type FontTypes = keyof Fonts;

type StrictFonts = Required<Fonts>;

type Font<T extends FontTypes> = StrictFonts[T]["data"][0];

type WithFontGroupType<T, G> = T & {
  fontGroupType: G;
};
export type FontGroup<T extends FontTypes> = WithFontGroupType<Font<T>, T>;

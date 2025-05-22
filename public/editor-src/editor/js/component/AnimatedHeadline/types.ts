export enum TextEffectTypes {
  typing = "typing",
  clip = "clip",
  flip = "flip",
  swirl = "swirl",
  blinds = "blinds",
  dropIn = "drop-in",
  wave = "wave",
  slide = "slide",
  slideDown = "slide-down"
}

export enum SvgEffectTypes {
  circle = "circle",
  underline_zigzag = "underline_zigzag",
  x = "x",
  strikethrough = "strikethrough",
  curly = "curly",
  diagonal = "diagonal",
  double = "double",
  double_underline = "double_underline",
  underline = "underline"
}

export enum AnimationStyle {
  text = "text",
  svg = "svg"
}

interface BaseSettings {
  textBefore: string;
  text: string;
  textAfter: string;
  loop: boolean;
  duration: number;
}

interface TextSettings {
  animationStyle: AnimationStyle.text;
  effectType: TextEffectTypes;
}

interface SvgSettings {
  animationStyle: AnimationStyle.svg;
  effectType: SvgEffectTypes;
  delay: number;
}

export type Settings = BaseSettings & (TextSettings | SvgSettings);

export interface Elements {
  headline: HTMLElement | null;
  dynamicWrapper: HTMLElement | null;
  dynamicText: HTMLElement[] | null;
}

export interface Options {
  lettersDelay: number;
  typeLettersDelay: number;
  selectionDuration: number;
  animationDelay: number;
  typeAnimationDelay: number;
  revealDuration: number;
  revealAnimationDelay: number;
  selectors: {
    headline: string;
    dynamicWrapper: string;
    dynamicText: string;
  };
  classes: {
    dynamicText: string;
    dynamicLetter: string;
    textActive: string;
    textInactive: string;
    letters: string;
    animationIn: string;
    typeSelected: string;
    activateSvgAnimation: string;
    hideSvgAnimation: string;
  };
}

export type HeadlineSettings = Settings & Options;

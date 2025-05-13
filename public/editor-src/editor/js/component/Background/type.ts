export enum Transition {
  Fade = "fade",
  SlideLeft = "slide-left",
  SlideRight = "slide-right",
  SlideUp = "slide-up",
  SlideDown = "slide-down"
}

export enum Effect {
  Fade = "fade",
  Slide = "slide"
}

export enum KenEffect {
  Off = "off",
  In = "in",
  Out = "out"
}

// This is type for props for BackgroundContainer component from index.jsx. This type needs to be finished when component will be converted to .tsx
export interface Value {
  bg: string;
  tabletBg: string;
  mobileBg: string;
  hoverBg: string;
}

export interface PopulationVars {
  "--brz-background-image": string;
  "--brz-tabletBackground-image": string;
  "--brz-mobileBackground-image": string;
  "--brz-hoverBackground-image": string;
}

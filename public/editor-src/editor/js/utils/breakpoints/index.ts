import { MValue } from "visual/utils/value";
import { AllCSSKeys } from "../cssStyle/types";
import { Device } from "../devices";
import {
  Breakpoints,
  BreakpointsNames,
  DesktopBreakpoints,
  ResponsiveBreakpoints
} from "./types";

export const desktopBreakpoints = {
  widescreen: 1920,
  desktopLarge: 1440,
  desktop: 1279
};

export const responsiveBreakpoints = {
  tablet: 991,
  mobileLandscape: 767,
  mobile: 478
};

export const breakpoints = {
  ...desktopBreakpoints,
  ...responsiveBreakpoints
};

export const isResponsiveBreakpoint = (breakpoint: BreakpointsNames): boolean =>
  Object.keys(responsiveBreakpoints).includes(breakpoint);

export const isBreakpointWithMediaQuery = (breakpoint: AllCSSKeys): boolean =>
  breakpoint !== "desktop" && Object.keys(breakpoints).includes(breakpoint);

export const getCurrentBreakpoints = (): {
  desktop: number;
  tablet: number;
  mobile: number;
} => ({
  desktop: desktopBreakpoints["desktop"],
  tablet: responsiveBreakpoints["tablet"],
  mobile: responsiveBreakpoints["mobile"]
});

export const getBreakpoints = (
  type: Device = "all"
): MValue<Breakpoints | DesktopBreakpoints | ResponsiveBreakpoints> => {
  switch (type) {
    case "all":
      return breakpoints;
    case "desktop":
      return desktopBreakpoints;
    case "responsive":
      return responsiveBreakpoints;
  }
};

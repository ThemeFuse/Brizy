import { breakpoints, desktopBreakpoints, responsiveBreakpoints } from ".";

export type BreakpointsNames = keyof typeof breakpoints;

export type Breakpoints = typeof breakpoints;
export type DesktopBreakpoints = typeof desktopBreakpoints;
export type ResponsiveBreakpoints = typeof responsiveBreakpoints;

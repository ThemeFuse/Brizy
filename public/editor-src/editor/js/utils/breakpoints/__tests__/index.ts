import type { Device } from "visual/utils/devices";
import {
  breakpoints,
  desktopBreakpoints,
  getBreakpoints,
  getCurrentBreakpoints,
  isBreakpointWithMediaQuery,
  isResponsiveBreakpoint,
  responsiveBreakpoints
} from "..";
import type { BreakpointsNames } from "../types";

describe("Testing breakpoints utils functions", () => {
  test("isResponsiveBreakpoint", () => {
    expect(isResponsiveBreakpoint("laptop" as BreakpointsNames)).toBe(false);
    expect(isResponsiveBreakpoint("asd" as BreakpointsNames)).toBe(false);
    expect(isResponsiveBreakpoint("mobile")).toBe(true);
    expect(isResponsiveBreakpoint("tablet")).toBe(true);
    expect(isResponsiveBreakpoint("mobileLandscape")).toBe(true);
  });

  test("isBreakpointWithMediaQuery", () => {
    expect(isBreakpointWithMediaQuery("desktop")).toBe(false);
    expect(isBreakpointWithMediaQuery("laptop" as BreakpointsNames)).toBe(
      false
    );
    expect(isBreakpointWithMediaQuery("smartphone" as BreakpointsNames)).toBe(
      false
    );
    expect(isBreakpointWithMediaQuery("desktopLarge")).toBe(true);
    expect(isBreakpointWithMediaQuery("mobile")).toBe(true);
    expect(isBreakpointWithMediaQuery("mobileLandscape")).toBe(true);
    expect(isBreakpointWithMediaQuery("tablet")).toBe(true);
    expect(isBreakpointWithMediaQuery("widescreen")).toBe(true);
  });

  test("getBreakpoints", () => {
    expect(getBreakpoints("all")).toBe(breakpoints);
    expect(getBreakpoints("desktop")).toBe(desktopBreakpoints);
    expect(getBreakpoints("responsive")).toBe(responsiveBreakpoints);
    expect(getBreakpoints("asd" as Device)).toBe(undefined);
  });
});

///// Temporary tests until we have breakpoints
describe("Testing getCurrentBreakpoints function that should return desktop, tablet and mobile", () => {
  test("General tests", () => {
    const output = {
      desktop: 1279,
      tablet: 991,
      mobile: 478
    };

    // @ts-expect-error testing purposes
    expect(getCurrentBreakpoints(undefined)).toStrictEqual(output);

    // @ts-expect-error testing purposes
    expect(getCurrentBreakpoints(null)).toStrictEqual(output);

    // @ts-expect-error testing purposes
    expect(getCurrentBreakpoints("")).toStrictEqual(output);

    // @ts-expect-error testing purposes
    expect(getCurrentBreakpoints(NaN)).toStrictEqual(output);

    // @ts-expect-error testing purposes
    expect(getCurrentBreakpoints("test")).toStrictEqual(output);

    expect(getCurrentBreakpoints()).toStrictEqual(output);
  });
});

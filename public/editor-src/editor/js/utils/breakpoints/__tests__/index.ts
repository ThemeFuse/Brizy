import type { Device } from "visual/utils/devices";
import {
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
  });

  test("isBreakpointWithMediaQuery", () => {
    expect(isBreakpointWithMediaQuery("desktop")).toBe(false);
    expect(isBreakpointWithMediaQuery("laptop" as BreakpointsNames)).toBe(
      false
    );
    expect(isBreakpointWithMediaQuery("smartphone" as BreakpointsNames)).toBe(
      false
    );
    expect(isBreakpointWithMediaQuery("mobile")).toBe(true);
    expect(isBreakpointWithMediaQuery("tablet")).toBe(true);
  });

  test("getBreakpoints", () => {
    expect(getBreakpoints("all")).toStrictEqual(getCurrentBreakpoints());
    expect(getBreakpoints("desktop")).toStrictEqual({
      desktop: desktopBreakpoints["desktop"]
    });
    expect(getBreakpoints("responsive")).toStrictEqual({
      tablet: responsiveBreakpoints["tablet"],
      mobile: responsiveBreakpoints["mobile"]
    });
    expect(getBreakpoints("asd" as Device)).toStrictEqual(undefined);
  });
});

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

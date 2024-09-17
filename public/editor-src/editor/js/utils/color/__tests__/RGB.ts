import { getRGBValues, hexToBlendedRgba } from "../RGB";

describe("getRGBValues", () => {
  test("should return RGB values for a valid hex color", () => {
    const hex = "#FFFFFF";
    const expected = { r: 255, g: 255, b: 255 };
    expect(getRGBValues(hex)).toEqual(expected);
  });

  test("should return RGB values for a valid hex color", () => {
    const hex = "#7f11e0";
    const expected = { r: 127, g: 17, b: 224 };
    expect(getRGBValues(hex)).toEqual(expected);
  });

  test("should return RGB values for a valid hex color with mixed case", () => {
    const hex = "#FfFfFf";
    const expected = { r: 255, g: 255, b: 255 };
    expect(getRGBValues(hex)).toEqual(expected);
  });

  test("should return undefined for an invalid hex color", () => {
    const hex = "#GGGGGG";
    expect(getRGBValues(hex)).toBeUndefined();
  });

  test("should return undefined for an empty string", () => {
    const hex = "";
    expect(getRGBValues(hex)).toBeUndefined();
  });

  test("should return undefined for a non-hex string", () => {
    const hex = "not-a-hex";
    expect(getRGBValues(hex)).toBeUndefined();
  });
});

describe("hexToBlendedRgba", () => {
  test("returns undefined when hex is undefined", () => {
    const result = hexToBlendedRgba({ hex: undefined, opacity: 0.5 });
    expect(result).toBeUndefined();
  });

  test("returns rgba equivalent when hex is valid color", () => {
    const result = hexToBlendedRgba({ hex: "#ffffff", opacity: 0.5 });
    const expected = "rgba(255, 255, 255, 1)";
    expect(result).toBe(expected);
  });

  test("returns rgba equivalent when hex is valid color", () => {
    const result = hexToBlendedRgba({ hex: "#f2f2f2", opacity: 0.5 });
    const expected = "rgba(249, 249, 249, 1)";
    expect(result).toBe(expected);
  });

  test("returns rgba equivalent when hex is valid color", () => {
    const result = hexToBlendedRgba({ hex: "#f2f2f2", opacity: 0.75 });
    const expected = "rgba(245, 245, 245, 1)";
    expect(result).toBe(expected);
  });

  test("returns undefined when opacity is undefined", () => {
    const result = hexToBlendedRgba({ hex: "#ffffff", opacity: undefined });
    expect(result).toBeUndefined();
  });

  test("returns undefined when both hex and opacity are undefined", () => {
    const result = hexToBlendedRgba({ hex: undefined, opacity: undefined });
    expect(result).toBeUndefined();
  });

  test("returns undefined when hex is invalid", () => {
    const result = hexToBlendedRgba({ hex: "#ZXZXZX", opacity: 0.5 });
    expect(result).toBeUndefined();
  });

  test("returns rgba equivalent when opacity is 0", () => {
    const result = hexToBlendedRgba({ hex: "#000000", opacity: 0 });
    const expected = "rgba(255, 255, 255, 1)";
    expect(result).toBe(expected);
  });

  test("returns rgba equivalent when opacity is 1", () => {
    const result = hexToBlendedRgba({ hex: "#000000", opacity: 1 });
    const expected = "rgba(0, 0, 0, 1)";
    expect(result).toBe(expected);
  });

  test("returns correct rgba when opacity is between 0 and 1", () => {
    const result = hexToBlendedRgba({ hex: "#ff0000", opacity: 0.5 });
    const expected = "rgba(255, 128, 128, 1)";
    expect(result).toBe(expected);
  });

  test("returns correct rgba for mixed color and opacity", () => {
    const result = hexToBlendedRgba({ hex: "#00ff00", opacity: 0.3 });
    const expected = "rgba(179, 255, 179, 1)";
    expect(result).toBe(expected);
  });

  test("returns correct rgba for another mixed color and opacity", () => {
    const result = hexToBlendedRgba({ hex: "#0000ff", opacity: 0.8 });
    const expected = "rgba(51, 51, 255, 1)";
    expect(result).toBe(expected);
  });

  test("handles hex without # symbol correctly", () => {
    const result = hexToBlendedRgba({ hex: "ff00ff", opacity: 0.6 });
    expect(result).toBeUndefined();
  });

  test("returns correct rgba for low opacity value", () => {
    const result = hexToBlendedRgba({ hex: "#abcdef", opacity: 0.1 });
    const expected = "rgba(247, 250, 253, 1)";
    expect(result).toBe(expected);
  });

  test("returns correct rgba for high opacity value", () => {
    const result = hexToBlendedRgba({ hex: "#123456", opacity: 0.9 });
    const expected = "rgba(42, 72, 103, 1)";
    expect(result).toBe(expected);
  });
});

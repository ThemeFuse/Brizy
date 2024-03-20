import { OptionValue } from "visual/component/Options/types";
import {
  empty as pxSuffix,
  fromString as readSuffix
} from "visual/utils/fonts/SizeSuffix";
import {
  empty as normalWeight,
  fromNumber as readWeight
} from "visual/utils/fonts/Weight";
import {
  FontFamilyType,
  fromString as readFontFamilyType
} from "visual/utils/fonts/familyType";
import {
  Zero as emptyPositive,
  fromNumber as readPositive
} from "visual/utils/math/Positive";
import { css as cssStyleTypography } from "../css";

export const nullishValue = {
  fontStyle: undefined,
  fontFamilyType: undefined,
  fontFamily: null,
  fontSize: NaN,
  fontSizeSuffix: "",
  fontWeight: undefined,
  letterSpacing: NaN,
  lineHeight: NaN
} as unknown as OptionValue<"typography">;

describe("Testing cssStyleTypography that should return CSS for font family, font size, font weight, line height, letter spacing", () => {
  test("Nullish values, should return CSS with nullish values", () => {
    expect(cssStyleTypography({ value: nullishValue })).toBe(
      "font-family:null; font-size:NaN; font-weight:undefined; line-height: NaN; letter-spacing:NaN; font-variation-settings:undefined;"
    );
  });

  test("Working values, should return CSS for typography", () => {
    const value: OptionValue<"typography"> = {
      fontStyle: "",
      fontFamilyType: readFontFamilyType("google") ?? FontFamilyType.google,
      fontFamily: "lato",
      fontSize: readPositive(16) ?? emptyPositive,
      fontSizeSuffix: readSuffix("px") ?? pxSuffix,
      fontWeight: readWeight(400) ?? normalWeight,
      letterSpacing: 0,
      lineHeight: readPositive(1) ?? emptyPositive,
      variableFontWeight: readWeight(400) ?? normalWeight,
      fontWidth: 100,
      fontSoftness: 0
    };

    expect(cssStyleTypography({ value })).toBe(
      "font-family:lato; font-size:16px; font-weight:400; line-height: 1; letter-spacing:0; font-variation-settings:400;"
    );

    expect(
      cssStyleTypography({
        value: {
          ...value,
          letterSpacing: 100
        }
      })
    ).toBe(
      "font-family:lato; font-size:16px; font-weight:400; line-height: 1; letter-spacing:100; font-variation-settings:400;"
    );

    expect(
      cssStyleTypography({
        value: {
          ...value,
          fontStyle: "heading1"
        }
      })
    ).toBe(
      "font-family:lato; font-size:16px; font-weight:400; line-height: 1; letter-spacing:0; font-variation-settings:400;"
    );

    expect(
      cssStyleTypography({
        value: {
          ...value,
          fontFamilyType: FontFamilyType.upload
        }
      })
    ).toBe(
      "font-family:lato; font-size:16px; font-weight:400; line-height: 1; letter-spacing:0; font-variation-settings:400;"
    );
  });
});

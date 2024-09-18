import { OptionValue } from "visual/component/Options/types";
import { hydrate } from "visual/redux/actions";
import { createStore } from "visual/redux/store";
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
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";
import { getTypographyValues } from "../utils";
import { nullishValue } from "./css";

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
  fontSoftness: 0,
  bold: false,
  italic: true,
  underline: true,
  strike: true,
  uppercase: false,
  lowercase: true
};

const output = {
  fontFamily: "'Lato', sans-serif",
  fontFamilyType: "google",
  fontSize: 16,
  fontSizeSuffix: "px",
  fontStyle: "",
  fontWeight: 400,
  letterSpacing: "0px",
  lineHeight: 1,
  variableFontWeight: '"wght" 400, "wdth" 100, "SOFT" 0',
  textStyle: "font-style:italic;",
  textDecoration: "text-decoration:underline line-through;",
  textTransform: "text-transform:lowercase;"
};

beforeAll(() => {
  const store = createStore();
  // @ts-expect-error IS_PREVIEW si on build time added by webpack
  global.IS_PREVIEW = false;
  store.dispatch(
    // @ts-expect-error There is not need to add types because is only for testing purposes
    hydrate(mockDataForReduxStore)
  );
});

describe("Testing getTypographyValues that should return typography values", () => {
  test("Nullish values, should return same nullish values", () => {
    expect(
      getTypographyValues({
        value: nullishValue,
        device: "desktop",
        state: NORMAL
      })
    ).toStrictEqual({
      fontStyle: undefined,
      fontFamilyType: undefined,
      fontFamily: "",
      fontSize: 0,
      fontSizeSuffix: "px",
      fontWeight: 400,
      letterSpacing: "NaNpx",
      lineHeight: 0,
      variableFontWeight:
        '"wght" undefined, "wdth" undefined, "SOFT" undefined',
      textStyle: "",
      textDecoration: "",
      textTransform: ""
    });
  });

  test("Desktop normal", () => {
    expect(
      getTypographyValues({
        value,
        device: "desktop",
        state: NORMAL
      })
    ).toStrictEqual(output);
  });

  test("Desktop hover", () => {
    expect(
      getTypographyValues({
        value,
        device: "desktop",
        state: HOVER
      })
    ).toStrictEqual(output);
  });

  test("Desktop active", () => {
    expect(
      getTypographyValues({
        value,
        device: "desktop",
        state: ACTIVE
      })
    ).toStrictEqual(output);
  });

  test("Tablet", () => {
    expect(
      getTypographyValues({
        value,
        device: "tablet",
        state: NORMAL
      })
    ).toStrictEqual(output);
  });

  test("Tablet", () => {
    expect(
      getTypographyValues({
        value,
        device: "mobile",
        state: NORMAL
      })
    ).toStrictEqual(output);
  });
});

const mockDataForReduxStore = {
  project: {
    data: {
      selectedStyle: "bahcadtpvdhdphmhymrsgrwobyzhxcdzytyx",
      styles: [
        {
          id: "bahcadtpvdhdphmhymrsgrwobyzhxcdzytyx",
          title: "Overpass",
          colorPalette: [
            {
              id: "color1",
              hex: "#A170D9"
            },
            {
              id: "color2",
              hex: "#1C1C1C"
            },
            {
              id: "color3",
              hex: "#05CAB6"
            },
            {
              id: "color4",
              hex: "#B8E6E1"
            },
            {
              id: "color5",
              hex: "#F5D4D1"
            },
            {
              id: "color6",
              hex: "#EBEBEB"
            },
            {
              id: "color7",
              hex: "#666666"
            },
            {
              id: "color8",
              hex: "#FFFFFF"
            }
          ],
          fontStyles: [
            {
              deletable: "off",
              id: "paragraph",
              title: "Paragraph",
              fontFamily: "overpass",
              fontFamilyType: "google",
              fontSize: 16,
              fontSizeSuffix: "px",
              fontWeight: 400,
              lineHeight: 1.9,
              letterSpacing: 0,
              tabletFontSize: 15,
              tabletFontSizeSuffix: "px",
              tabletFontWeight: 400,
              tabletLineHeight: 1.6,
              tabletLetterSpacing: 0,
              mobileFontSize: 15,
              mobileFontSizeSuffix: "px",
              mobileFontWeight: 400,
              mobileLineHeight: 1.6,
              mobileLetterSpacing: 0
            },
            {
              deletable: "off",
              id: "subtitle",
              title: "Subtitle",
              fontFamily: "overpass",
              fontFamilyType: "google",
              fontSize: 17,
              fontSizeSuffix: "px",
              fontWeight: 400,
              lineHeight: 1.8,
              letterSpacing: 0,
              tabletFontSize: 17,
              tabletFontSizeSuffix: "px",
              tabletFontWeight: 400,
              tabletLineHeight: 1.5,
              tabletLetterSpacing: 0,
              mobileFontSize: 16,
              mobileFontSizeSuffix: "px",
              mobileFontWeight: 400,
              mobileLineHeight: 1.5,
              mobileLetterSpacing: 0
            },
            {
              deletable: "off",
              id: "abovetitle",
              title: "Above Title",
              fontFamily: "overpass",
              fontFamilyType: "google",
              fontSize: 13,
              fontSizeSuffix: "px",
              fontWeight: 700,
              lineHeight: 1.5,
              letterSpacing: 1.1,
              tabletFontSize: 13,
              tabletFontSizeSuffix: "px",
              tabletFontWeight: 700,
              tabletLineHeight: 1.5,
              tabletLetterSpacing: 1,
              mobileFontSize: 13,
              mobileFontSizeSuffix: "px",
              mobileFontWeight: 700,
              mobileLineHeight: 1.5,
              mobileLetterSpacing: 1
            },
            {
              deletable: "off",
              id: "heading1",
              title: "Heading 1",
              fontFamily: "overpass",
              fontFamilyType: "google",
              fontSize: 46,
              fontSizeSuffix: "px",
              fontWeight: 700,
              lineHeight: 1.3,
              letterSpacing: -1.5,
              tabletFontSize: 38,
              tabletFontSizeSuffix: "px",
              tabletFontWeight: 700,
              tabletLineHeight: 1.2,
              tabletLetterSpacing: -1,
              mobileFontSize: 36,
              mobileFontSizeSuffix: "px",
              mobileFontWeight: 700,
              mobileLineHeight: 1.3,
              mobileLetterSpacing: -1
            },
            {
              deletable: "off",
              id: "heading2",
              title: "Heading 2",
              fontFamily: "overpass",
              fontFamilyType: "google",
              fontSize: 36,
              fontSizeSuffix: "px",
              fontWeight: 700,
              lineHeight: 1.3,
              letterSpacing: -1.5,
              tabletFontSize: 30,
              tabletFontSizeSuffix: "px",
              tabletFontWeight: 700,
              tabletLineHeight: 1.2,
              tabletLetterSpacing: -1,
              mobileFontSize: 28,
              mobileFontSizeSuffix: "px",
              mobileFontWeight: 700,
              mobileLineHeight: 1.3,
              mobileLetterSpacing: -1
            },
            {
              deletable: "off",
              id: "heading3",
              title: "Heading 3",
              fontFamily: "overpass",
              fontFamilyType: "google",
              fontSize: 28,
              fontSizeSuffix: "px",
              fontWeight: 700,
              lineHeight: 1.4,
              letterSpacing: -1.5,
              tabletFontSize: 27,
              tabletFontSizeSuffix: "px",
              tabletFontWeight: 700,
              tabletLineHeight: 1.3,
              tabletLetterSpacing: -1,
              mobileFontSize: 22,
              mobileFontSizeSuffix: "px",
              mobileFontWeight: 700,
              mobileLineHeight: 1.3,
              mobileLetterSpacing: -0.5
            },
            {
              deletable: "off",
              id: "heading4",
              title: "Heading 4",
              fontFamily: "overpass",
              fontFamilyType: "google",
              fontSize: 22,
              fontSizeSuffix: "px",
              fontWeight: 700,
              lineHeight: 1.5,
              letterSpacing: -0.5,
              tabletFontSize: 22,
              tabletFontSizeSuffix: "px",
              tabletFontWeight: 700,
              tabletLineHeight: 1.4,
              tabletLetterSpacing: -0.5,
              mobileFontSize: 20,
              mobileFontSizeSuffix: "px",
              mobileFontWeight: 700,
              mobileLineHeight: 1.4,
              mobileLetterSpacing: 0
            },
            {
              deletable: "off",
              id: "heading5",
              title: "Heading 5",
              fontFamily: "overpass",
              fontFamilyType: "google",
              fontSize: 20,
              fontSizeSuffix: "px",
              fontWeight: 700,
              lineHeight: 1.6,
              letterSpacing: 0,
              tabletFontSize: 17,
              tabletFontSizeSuffix: "px",
              tabletFontWeight: 700,
              tabletLineHeight: 1.7,
              tabletLetterSpacing: 0,
              mobileFontSize: 17,
              mobileFontSizeSuffix: "px",
              mobileFontWeight: 700,
              mobileLineHeight: 1.8,
              mobileLetterSpacing: 0
            },
            {
              deletable: "off",
              id: "heading6",
              title: "Heading 6",
              fontFamily: "overpass",
              fontFamilyType: "google",
              fontSize: 16,
              fontSizeSuffix: "px",
              fontWeight: 700,
              lineHeight: 1.5,
              letterSpacing: 0,
              tabletFontSize: 16,
              tabletFontSizeSuffix: "px",
              tabletFontWeight: 700,
              tabletLineHeight: 1.5,
              tabletLetterSpacing: 0,
              mobileFontSize: 16,
              mobileFontSizeSuffix: "px",
              mobileFontWeight: 700,
              mobileLineHeight: 1.5,
              mobileLetterSpacing: 0
            },
            {
              deletable: "off",
              id: "button",
              title: "Button",
              fontFamily: "overpass",
              fontFamilyType: "google",
              fontSize: 15,
              fontSizeSuffix: "px",
              fontWeight: 700,
              lineHeight: 1.6,
              letterSpacing: 0,
              tabletFontSize: 17,
              tabletFontSizeSuffix: "px",
              tabletFontWeight: 700,
              tabletLineHeight: 1.6,
              tabletLetterSpacing: 0,
              mobileFontSize: 15,
              mobileFontSizeSuffix: "px",
              mobileFontWeight: 700,
              mobileLineHeight: 1.6,
              mobileLetterSpacing: 0
            }
          ]
        }
      ],
      extraFontStyles: []
    }
  },
  projectStatus: {
    locked: false,
    lockedBy: false
  },
  page: {
    data: {
      items: []
    }
  },
  globalBlocks: {},
  authorized: "connected",
  syncAllowed: false,
  fonts: {
    config: {
      data: [
        {
          kind: "webfonts#webfont",
          family: "Lato",
          category: "sans-serif",
          variants: [
            "100",
            "100italic",
            "300",
            "300italic",
            "regular",
            "italic",
            "700",
            "700italic",
            "900",
            "900italic"
          ],
          subsets: ["latin-ext", "latin"],
          version: "v15",
          lastModified: "2019-03-26",
          files: {
            "100":
              "http://fonts.gstatic.com/s/lato/v15/S6u8w4BMUTPHh30wWyWrFCbw7A.ttf",
            "300":
              "http://fonts.gstatic.com/s/lato/v15/S6u9w4BMUTPHh7USew-FGC_p9dw.ttf",
            "700":
              "http://fonts.gstatic.com/s/lato/v15/S6u9w4BMUTPHh6UVew-FGC_p9dw.ttf",
            "900":
              "http://fonts.gstatic.com/s/lato/v15/S6u9w4BMUTPHh50Xew-FGC_p9dw.ttf",
            "100italic":
              "http://fonts.gstatic.com/s/lato/v15/S6u-w4BMUTPHjxsIPy-vNiPg7MU0.ttf",
            "300italic":
              "http://fonts.gstatic.com/s/lato/v15/S6u_w4BMUTPHjxsI9w2PHA3s5dwt7w.ttf",
            regular:
              "http://fonts.gstatic.com/s/lato/v15/S6uyw4BMUTPHvxk6XweuBCY.ttf",
            italic:
              "http://fonts.gstatic.com/s/lato/v15/S6u8w4BMUTPHjxswWyWrFCbw7A.ttf",
            "700italic":
              "http://fonts.gstatic.com/s/lato/v15/S6u_w4BMUTPHjxsI5wqPHA3s5dwt7w.ttf",
            "900italic":
              "http://fonts.gstatic.com/s/lato/v15/S6u_w4BMUTPHjxsI3wiPHA3s5dwt7w.ttf"
          },
          brizyId: "uzrpsocdxtgrkbxjjxkchqcybpvpzsuvdlji"
        }
      ]
    }
  }
};

import cheerio from "cheerio";
import { classNamesToV2 } from "./index";

// +---------+----------------+---------------------+----------------+------------+--------------+----------------------+-----------------+
// |         | Old Typography |    New Typography   |     Change     |  onChange  | Intermediate | Empty classNames for |       Tags      |
// |         |    (brz-tp)    | brz-tp-lg brz-tp-sm | fs, fw, lh, ls | FontFamily |    styles    |                      | p, h1..., list, |
// |         |                |      brz-tp-xs      |                |            |              |      typography      |    pre, e.t.c   |
// |         |                |                     |                |            |              |                      |                 |
// +---------+----------------+---------------------+----------------+------------+--------------+----------------------+-----------------+
// | Desktop |        X       |          X          |        X       |      X     |     None     |         None         |        X        |
// +---------+----------------+---------------------+----------------+------------+--------------+----------------------+-----------------+
// | Tablet  |      None      |          X          |        X       |    None    |       X      |           X          |        X        |
// +---------+----------------+---------------------+----------------+------------+--------------+----------------------+-----------------+
// | Mobile  |      None      |          X          |        X       |    None    |       X      |           X          |        X        |
// +---------+----------------+---------------------+----------------+------------+--------------+----------------------+-----------------+

function generateElem(classNames: string[]) {
  const classNamesAsString = classNames.join(" ");
  const html = `<html><head></head><body class="brz"><div class="brz-rich-text"><p class="${classNamesAsString}"><span class="brz-cp-color7">Text</span></p></div></body></html>`;

  const $ = cheerio.load(html);
  return $("p");
}

describe("Old Typography", function () {
  test("old typography was set", () => {
    const $elem = generateElem(["brz-tp-header1"]);

    const { v } = classNamesToV2($elem.attr("class")?.split(" ") ?? []);

    expect(v).toEqual({
      typographyFontStyle: "header1",
      tabletTypographyFontStyle: null,
      mobileTypographyFontStyle: null,
      typographyFontFamily: "lato",
      typographyFontFamilyType: "google",
      typographyFontSize: 16,
      tabletTypographyFontSize: null,
      mobileTypographyFontSize: null,
      typographyFontSizeSuffix: "px",
      tabletTypographyFontSizeSuffix: null,
      mobileTypographyFontSizeSuffix: null,
      typographyFontWeight: 400,
      tabletTypographyFontWeight: null,
      mobileTypographyFontWeight: null,
      typographyLineHeight: 1.3,
      tabletTypographyLineHeight: null,
      mobileTypographyLineHeight: null,
      typographyLetterSpacing: 0,
      tabletTypographyLetterSpacing: null,
      mobileTypographyLetterSpacing: null,
      typographyVariableFontWeight: 400,
      tabletTypographyVariableFontWeight: null,
      mobileTypographyVariableFontWeight: null,
      typographyFontWidth: 100,
      tabletTypographyFontWidth: null,
      mobileTypographyFontWidth: null,
      typographyFontSoftness: 0,
      tabletTypographyFontSoftness: null,
      mobileTypographyFontSoftness: null,
      contentHorizontalAlign: "left",
      tabletContentHorizontalAlign: null,
      mobileContentHorizontalAlign: null,
      marginTop: 0,
      tabletMarginTop: null,
      mobileMarginTop: null,
      marginBottom: 0,
      tabletMarginBottom: null,
      mobileMarginBottom: null,
      "block-colorPalette": ""
    });
  });
});

describe("New Typography", function () {
  test("all typography was set", () => {
    const $elem = generateElem([
      "brz-tp-lg-paragraph",
      "brz-tp-sm-subtitle",
      "brz-tp-xs-abovetitle"
    ]);

    const { v } = classNamesToV2($elem.attr("class")?.split(" ") ?? []);

    expect(v).toEqual({
      typographyFontStyle: "paragraph",
      tabletTypographyFontStyle: "subtitle",
      mobileTypographyFontStyle: "abovetitle",
      typographyFontFamily: "lato",
      typographyFontFamilyType: "google",
      typographyFontSize: 16,
      tabletTypographyFontSize: null,
      mobileTypographyFontSize: null,
      typographyFontSizeSuffix: "px",
      tabletTypographyFontSizeSuffix: null,
      mobileTypographyFontSizeSuffix: null,
      typographyFontWeight: 400,
      tabletTypographyFontWeight: null,
      mobileTypographyFontWeight: null,
      typographyLineHeight: 1.3,
      tabletTypographyLineHeight: null,
      mobileTypographyLineHeight: null,
      typographyLetterSpacing: 0,
      tabletTypographyLetterSpacing: null,
      mobileTypographyLetterSpacing: null,
      typographyVariableFontWeight: 400,
      tabletTypographyVariableFontWeight: null,
      mobileTypographyVariableFontWeight: null,
      typographyFontWidth: 100,
      tabletTypographyFontWidth: null,
      mobileTypographyFontWidth: null,
      typographyFontSoftness: 0,
      tabletTypographyFontSoftness: null,
      mobileTypographyFontSoftness: null,
      contentHorizontalAlign: "left",
      tabletContentHorizontalAlign: null,
      mobileContentHorizontalAlign: null,
      marginTop: 0,
      tabletMarginTop: null,
      mobileMarginTop: null,
      marginBottom: 0,
      tabletMarginBottom: null,
      mobileMarginBottom: null,
      "block-colorPalette": ""
    });
  });

  test("Tablet typography was missing", () => {
    const $elem = generateElem(["brz-tp-lg-paragraph", "brz-tp-xs-abovetitle"]);

    const { v } = classNamesToV2($elem.attr("class")?.split(" ") ?? []);

    expect(v).toEqual({
      typographyFontStyle: "paragraph",
      tabletTypographyFontStyle: null,
      mobileTypographyFontStyle: "abovetitle",
      typographyFontFamily: "lato",
      typographyFontFamilyType: "google",
      typographyFontSize: 16,
      tabletTypographyFontSize: null,
      mobileTypographyFontSize: null,
      typographyFontSizeSuffix: "px",
      tabletTypographyFontSizeSuffix: null,
      mobileTypographyFontSizeSuffix: null,
      typographyFontWeight: 400,
      tabletTypographyFontWeight: null,
      mobileTypographyFontWeight: null,
      typographyLineHeight: 1.3,
      tabletTypographyLineHeight: null,
      mobileTypographyLineHeight: null,
      typographyLetterSpacing: 0,
      tabletTypographyLetterSpacing: null,
      mobileTypographyLetterSpacing: null,
      typographyVariableFontWeight: 400,
      tabletTypographyVariableFontWeight: null,
      mobileTypographyVariableFontWeight: null,
      typographyFontWidth: 100,
      tabletTypographyFontWidth: null,
      mobileTypographyFontWidth: null,
      typographyFontSoftness: 0,
      tabletTypographyFontSoftness: null,
      mobileTypographyFontSoftness: null,
      contentHorizontalAlign: "left",
      tabletContentHorizontalAlign: null,
      mobileContentHorizontalAlign: null,
      marginTop: 0,
      tabletMarginTop: null,
      mobileMarginTop: null,
      marginBottom: 0,
      tabletMarginBottom: null,
      mobileMarginBottom: null,
      "block-colorPalette": ""
    });
  });
});

describe("Change fs, fw, lh, ls, hA, mT, mB", function () {
  test("desktop styles were set", () => {
    const $elem = generateElem([
      "brz-text-lg-center",
      "brz-mt-lg-31",
      "brz-mb-lg-30",
      "brz-fs-lg-11",
      "brz-fss-lg-em",
      "brz-fw-lg-300",
      "brz-ls-lg-1_5",
      "brz-lh-lg-1",
      "brz-vfw-lg-300",
      "brz-fwdth-lg-100",
      "brz-fsft-lg-50"
    ]);

    const { v } = classNamesToV2($elem.attr("class")?.split(" ") ?? []);

    expect(v).toEqual({
      typographyFontStyle: "",
      tabletTypographyFontStyle: null,
      mobileTypographyFontStyle: null,
      typographyFontFamily: "lato",
      typographyFontFamilyType: "google",
      typographyFontSize: 11,
      tabletTypographyFontSize: null,
      mobileTypographyFontSize: null,
      typographyFontSizeSuffix: "em",
      tabletTypographyFontSizeSuffix: null,
      mobileTypographyFontSizeSuffix: null,
      typographyFontWeight: 300,
      tabletTypographyFontWeight: null,
      mobileTypographyFontWeight: null,
      typographyLineHeight: 1,
      tabletTypographyLineHeight: null,
      mobileTypographyLineHeight: null,
      typographyLetterSpacing: 1.5,
      tabletTypographyLetterSpacing: null,
      mobileTypographyLetterSpacing: null,
      typographyVariableFontWeight: 300,
      tabletTypographyVariableFontWeight: null,
      mobileTypographyVariableFontWeight: null,
      typographyFontWidth: 100,
      tabletTypographyFontWidth: null,
      mobileTypographyFontWidth: null,
      typographyFontSoftness: 50,
      tabletTypographyFontSoftness: null,
      mobileTypographyFontSoftness: null,
      contentHorizontalAlign: "center",
      tabletContentHorizontalAlign: null,
      mobileContentHorizontalAlign: null,
      marginTop: 31,
      tabletMarginTop: null,
      mobileMarginTop: null,
      marginBottom: 30,
      tabletMarginBottom: null,
      mobileMarginBottom: null,
      "block-colorPalette": ""
    });
  });
  test("ls, lh were set", () => {
    const $elem = generateElem(["brz-ls-lg-m_3_5", "brz-lh-lg-1_7"]);

    const { v } = classNamesToV2($elem.attr("class")?.split(" ") ?? []);

    expect(v).toEqual({
      typographyFontStyle: "",
      tabletTypographyFontStyle: null,
      mobileTypographyFontStyle: null,
      typographyFontFamily: "lato",
      typographyFontFamilyType: "google",
      typographyFontSize: 16,
      tabletTypographyFontSize: null,
      mobileTypographyFontSize: null,
      typographyFontSizeSuffix: "px",
      tabletTypographyFontSizeSuffix: null,
      mobileTypographyFontSizeSuffix: null,
      typographyFontWeight: 400,
      tabletTypographyFontWeight: null,
      mobileTypographyFontWeight: null,
      typographyLineHeight: 1.7,
      tabletTypographyLineHeight: null,
      mobileTypographyLineHeight: null,
      typographyLetterSpacing: -3.5,
      tabletTypographyLetterSpacing: null,
      mobileTypographyLetterSpacing: null,
      typographyVariableFontWeight: 400,
      tabletTypographyVariableFontWeight: null,
      mobileTypographyVariableFontWeight: null,
      typographyFontWidth: 100,
      tabletTypographyFontWidth: null,
      mobileTypographyFontWidth: null,
      typographyFontSoftness: 0,
      tabletTypographyFontSoftness: null,
      mobileTypographyFontSoftness: null,
      contentHorizontalAlign: "left",
      tabletContentHorizontalAlign: null,
      mobileContentHorizontalAlign: null,
      marginTop: 0,
      tabletMarginTop: null,
      mobileMarginTop: null,
      marginBottom: 0,
      tabletMarginBottom: null,
      mobileMarginBottom: null,
      "block-colorPalette": ""
    });
  });
  test("tablet & mobile fs, lh, mT, mB, hA were set", () => {
    const $elem = generateElem([
      "brz-tp-lg-paragraph",
      "brz-tp-sm-empty",
      "brz-fs-sm-21",
      "brz-fss-sm-px",
      "brz-fw-sm-300",
      "brz-ls-sm-m_2",
      "brz-lh-sm-1_1",
      "brz-text-sm-center",
      "brz-vfw-sm-200",
      "brz-fwdth-sm-70",
      "brz-fsft-sm-10",
      "brz-text-xs-right",
      "brz-tp-xs-empty",
      "brz-fs-xs-1",
      "brz-fss-xs-rem",
      "brz-fw-xs-900",
      "brz-ls-xs-1_5",
      "brz-lh-xs-2_4",
      "brz-vfw-xs-100",
      "brz-fwdth-xs-55",
      "brz-fsft-xs-30",
      "brz-mt-xs-41",
      "brz-mb-xs-36"
    ]);

    const { v } = classNamesToV2($elem.attr("class")?.split(" ") ?? []);

    expect(v).toEqual({
      typographyFontStyle: "paragraph",
      tabletTypographyFontStyle: "",
      mobileTypographyFontStyle: "",
      typographyFontFamily: "lato",
      typographyFontFamilyType: "google",
      typographyFontSize: 16,
      tabletTypographyFontSize: 21,
      mobileTypographyFontSize: 1,
      typographyFontSizeSuffix: "px",
      tabletTypographyFontSizeSuffix: "px",
      mobileTypographyFontSizeSuffix: "rem",
      typographyFontWeight: 400,
      tabletTypographyFontWeight: 300,
      mobileTypographyFontWeight: 900,
      typographyLineHeight: 1.3,
      tabletTypographyLineHeight: 1.1,
      mobileTypographyLineHeight: 2.4,
      typographyLetterSpacing: 0,
      tabletTypographyLetterSpacing: -2,
      mobileTypographyLetterSpacing: 1.5,
      typographyVariableFontWeight: 400,
      tabletTypographyVariableFontWeight: 200,
      mobileTypographyVariableFontWeight: 100,
      typographyFontWidth: 100,
      tabletTypographyFontWidth: 70,
      mobileTypographyFontWidth: 55,
      typographyFontSoftness: 0,
      tabletTypographyFontSoftness: 10,
      mobileTypographyFontSoftness: 30,
      contentHorizontalAlign: "left",
      tabletContentHorizontalAlign: "center",
      mobileContentHorizontalAlign: "right",
      marginTop: 0,
      tabletMarginTop: null,
      mobileMarginTop: 41,
      marginBottom: 0,
      tabletMarginBottom: null,
      mobileMarginBottom: 36,
      "block-colorPalette": ""
    });
  });
});

describe("Onchange FontFamily", function () {
  test("google font", () => {
    const $elem = generateElem([
      "brz-tp-lg-empty",
      "brz-ff-kaushan_script",
      "brz-ft-google"
    ]);

    const { v } = classNamesToV2($elem.attr("class")?.split(" ") ?? []);

    expect(v).toEqual({
      typographyFontStyle: "",
      tabletTypographyFontStyle: null,
      mobileTypographyFontStyle: null,
      typographyFontFamily: "kaushan_script",
      typographyFontFamilyType: "google",
      typographyFontSize: 16,
      tabletTypographyFontSize: null,
      mobileTypographyFontSize: null,
      typographyFontSizeSuffix: "px",
      tabletTypographyFontSizeSuffix: null,
      mobileTypographyFontSizeSuffix: null,
      typographyFontWeight: 400,
      tabletTypographyFontWeight: null,
      mobileTypographyFontWeight: null,
      typographyLineHeight: 1.3,
      tabletTypographyLineHeight: null,
      mobileTypographyLineHeight: null,
      typographyLetterSpacing: 0,
      tabletTypographyLetterSpacing: null,
      mobileTypographyLetterSpacing: null,
      typographyVariableFontWeight: 400,
      tabletTypographyVariableFontWeight: null,
      mobileTypographyVariableFontWeight: null,
      typographyFontWidth: 100,
      tabletTypographyFontWidth: null,
      mobileTypographyFontWidth: null,
      typographyFontSoftness: 0,
      tabletTypographyFontSoftness: null,
      mobileTypographyFontSoftness: null,
      contentHorizontalAlign: "left",
      tabletContentHorizontalAlign: null,
      mobileContentHorizontalAlign: null,
      marginTop: 0,
      tabletMarginTop: null,
      mobileMarginTop: null,
      marginBottom: 0,
      tabletMarginBottom: null,
      mobileMarginBottom: null,
      "block-colorPalette": ""
    });
  });
  test("custom font", () => {
    const $elem = generateElem([
      "brz-tp-lg-empty",
      "brz-ff-pxxvihvwkzmfnxotftttptfabebccbrejuyq",
      "brz-ft-upload"
    ]);

    const { v } = classNamesToV2($elem.attr("class")?.split(" ") ?? []);

    expect(v).toEqual({
      typographyFontStyle: "",
      tabletTypographyFontStyle: null,
      mobileTypographyFontStyle: null,
      typographyFontFamily: "pxxvihvwkzmfnxotftttptfabebccbrejuyq",
      typographyFontFamilyType: "upload",
      typographyFontSize: 16,
      tabletTypographyFontSize: null,
      mobileTypographyFontSize: null,
      typographyFontSizeSuffix: "px",
      tabletTypographyFontSizeSuffix: null,
      mobileTypographyFontSizeSuffix: null,
      typographyFontWeight: 400,
      tabletTypographyFontWeight: null,
      mobileTypographyFontWeight: null,
      typographyLineHeight: 1.3,
      tabletTypographyLineHeight: null,
      mobileTypographyLineHeight: null,
      typographyLetterSpacing: 0,
      tabletTypographyLetterSpacing: null,
      mobileTypographyLetterSpacing: null,
      typographyVariableFontWeight: 400,
      tabletTypographyVariableFontWeight: null,
      mobileTypographyVariableFontWeight: null,
      typographyFontWidth: 100,
      tabletTypographyFontWidth: null,
      mobileTypographyFontWidth: null,
      typographyFontSoftness: 0,
      tabletTypographyFontSoftness: null,
      mobileTypographyFontSoftness: null,
      contentHorizontalAlign: "left",
      tabletContentHorizontalAlign: null,
      mobileContentHorizontalAlign: null,
      marginTop: 0,
      tabletMarginTop: null,
      mobileMarginTop: null,
      marginBottom: 0,
      tabletMarginBottom: null,
      mobileMarginBottom: null,
      "block-colorPalette": ""
    });
  });
});

describe("Intermediate styles", function () {
  test("all intermediate classnames added", () => {
    const $elem = generateElem([
      "brz-ff-sanchez",
      "brz-ft-google",

      "brz-fs-lg-47",
      "brz-fw-lg-700",
      "brz-lh-lg-1_3",
      "brz-ls-lg-m_2_5",

      "brz-fs-sm-im-39",
      "brz-fw-sm-im-700",
      "brz-lh-sm-im-1_2",
      "brz-ls-sm-im-m_1",

      "brz-fs-xs-im-37",
      "brz-fw-xs-im-700",
      "brz-lh-xs-im-1_3",
      "brz-ls-xs-im-0"
    ]);

    const { v } = classNamesToV2($elem.attr("class")?.split(" ") ?? []);

    expect(v).toEqual({
      typographyFontStyle: "",
      tabletTypographyFontStyle: null,
      mobileTypographyFontStyle: null,
      typographyFontFamily: "sanchez",
      typographyFontFamilyType: "google",
      typographyFontSize: 47,
      tabletTypographyFontSize: 39,
      mobileTypographyFontSize: 37,
      typographyFontSizeSuffix: "px",
      tabletTypographyFontSizeSuffix: null,
      mobileTypographyFontSizeSuffix: null,
      typographyFontWeight: 700,
      tabletTypographyFontWeight: 700,
      mobileTypographyFontWeight: 700,
      typographyLineHeight: 1.3,
      tabletTypographyLineHeight: 1.2,
      mobileTypographyLineHeight: 1.3,
      typographyLetterSpacing: -2.5,
      tabletTypographyLetterSpacing: -1,
      mobileTypographyLetterSpacing: 0,
      typographyVariableFontWeight: 400,
      tabletTypographyVariableFontWeight: null,
      mobileTypographyVariableFontWeight: null,
      typographyFontWidth: 100,
      tabletTypographyFontWidth: null,
      mobileTypographyFontWidth: null,
      typographyFontSoftness: 0,
      tabletTypographyFontSoftness: null,
      mobileTypographyFontSoftness: null,
      contentHorizontalAlign: "left",
      tabletContentHorizontalAlign: null,
      mobileContentHorizontalAlign: null,
      marginTop: 0,
      tabletMarginTop: null,
      mobileMarginTop: null,
      marginBottom: 0,
      tabletMarginBottom: null,
      mobileMarginBottom: null,
      "block-colorPalette": ""
    });
  });
});

describe("Empty classNames", function () {
  test("tablet & mobile empty classnames", () => {
    const $elem = generateElem([
      "brz-tp-header1",
      "brz-tp-sm-empty",
      "brz-tp-xs-empty"
    ]);

    const { v } = classNamesToV2($elem.attr("class")?.split(" ") ?? []);

    expect(v).toEqual({
      typographyFontStyle: "header1",
      tabletTypographyFontStyle: "",
      mobileTypographyFontStyle: "",
      typographyFontFamily: "lato",
      typographyFontFamilyType: "google",
      typographyFontSize: 16,
      tabletTypographyFontSize: null,
      mobileTypographyFontSize: null,
      typographyFontSizeSuffix: "px",
      tabletTypographyFontSizeSuffix: null,
      mobileTypographyFontSizeSuffix: null,
      typographyFontWeight: 400,
      tabletTypographyFontWeight: null,
      mobileTypographyFontWeight: null,
      typographyLineHeight: 1.3,
      tabletTypographyLineHeight: null,
      mobileTypographyLineHeight: null,
      typographyLetterSpacing: 0,
      tabletTypographyLetterSpacing: null,
      mobileTypographyLetterSpacing: null,
      typographyVariableFontWeight: 400,
      tabletTypographyVariableFontWeight: null,
      mobileTypographyVariableFontWeight: null,
      typographyFontWidth: 100,
      tabletTypographyFontWidth: null,
      mobileTypographyFontWidth: null,
      typographyFontSoftness: 0,
      tabletTypographyFontSoftness: null,
      mobileTypographyFontSoftness: null,
      contentHorizontalAlign: "left",
      tabletContentHorizontalAlign: null,
      mobileContentHorizontalAlign: null,
      marginTop: 0,
      tabletMarginTop: null,
      mobileMarginTop: null,
      marginBottom: 0,
      tabletMarginBottom: null,
      mobileMarginBottom: null,
      "block-colorPalette": ""
    });
  });
});

describe("Tags p, h1, list", function () {
  test("h1 tag", () => {
    const html = `<html><head></head><body class="brz"><div class="brz-rich-text"><h1 class="brz-tp-header1"><span class="brz-cp-color7">Text</span></h1></div></body></html>`;
    const $ = cheerio.load(html);

    const { v } = classNamesToV2($("h1").attr("class")?.split(" ") ?? []);

    expect(v).toEqual({
      typographyFontStyle: "header1",
      tabletTypographyFontStyle: null,
      mobileTypographyFontStyle: null,
      typographyFontFamily: "lato",
      typographyFontFamilyType: "google",
      typographyFontSize: 16,
      tabletTypographyFontSize: null,
      mobileTypographyFontSize: null,
      typographyFontSizeSuffix: "px",
      tabletTypographyFontSizeSuffix: null,
      mobileTypographyFontSizeSuffix: null,
      typographyFontWeight: 400,
      tabletTypographyFontWeight: null,
      mobileTypographyFontWeight: null,
      typographyLineHeight: 1.3,
      tabletTypographyLineHeight: null,
      mobileTypographyLineHeight: null,
      typographyLetterSpacing: 0,
      tabletTypographyLetterSpacing: null,
      mobileTypographyLetterSpacing: null,
      typographyVariableFontWeight: 400,
      tabletTypographyVariableFontWeight: null,
      mobileTypographyVariableFontWeight: null,
      typographyFontWidth: 100,
      tabletTypographyFontWidth: null,
      mobileTypographyFontWidth: null,
      typographyFontSoftness: 0,
      tabletTypographyFontSoftness: null,
      mobileTypographyFontSoftness: null,
      contentHorizontalAlign: "left",
      tabletContentHorizontalAlign: null,
      mobileContentHorizontalAlign: null,
      marginTop: 0,
      tabletMarginTop: null,
      mobileMarginTop: null,
      marginBottom: 0,
      tabletMarginBottom: null,
      mobileMarginBottom: null,
      "block-colorPalette": ""
    });
  });

  test("list tag", () => {
    const html = `<ol><li class="brz-tp-lg-paragraph brz-bcp-color7"><span class="brz-cp-color7">The point of using dummy text for yo</span></li></ol>`;
    const $ = cheerio.load(html);

    const { v } = classNamesToV2($("li").attr("class")?.split(" ") ?? []);

    expect(v).toEqual({
      typographyFontStyle: "paragraph",
      tabletTypographyFontStyle: null,
      mobileTypographyFontStyle: null,
      typographyFontFamily: "lato",
      typographyFontFamilyType: "google",
      typographyFontSize: 16,
      tabletTypographyFontSize: null,
      mobileTypographyFontSize: null,
      typographyFontSizeSuffix: "px",
      tabletTypographyFontSizeSuffix: null,
      mobileTypographyFontSizeSuffix: null,
      typographyFontWeight: 400,
      tabletTypographyFontWeight: null,
      mobileTypographyFontWeight: null,
      typographyLineHeight: 1.3,
      tabletTypographyLineHeight: null,
      mobileTypographyLineHeight: null,
      typographyLetterSpacing: 0,
      tabletTypographyLetterSpacing: null,
      mobileTypographyLetterSpacing: null,
      typographyVariableFontWeight: 400,
      tabletTypographyVariableFontWeight: null,
      mobileTypographyVariableFontWeight: null,
      typographyFontWidth: 100,
      tabletTypographyFontWidth: null,
      mobileTypographyFontWidth: null,
      typographyFontSoftness: 0,
      tabletTypographyFontSoftness: null,
      mobileTypographyFontSoftness: null,
      contentHorizontalAlign: "left",
      tabletContentHorizontalAlign: null,
      mobileContentHorizontalAlign: null,
      marginTop: 0,
      tabletMarginTop: null,
      mobileMarginTop: null,
      marginBottom: 0,
      tabletMarginBottom: null,
      mobileMarginBottom: null,
      "block-colorPalette": "color7"
    });
  });

  test("2 classNames via comma", () => {
    const $elem = generateElem([
      "brz-tp-lg-paragraph",
      "brz-bcp-color2,color7"
    ]);

    const { v } = classNamesToV2($elem.attr("class")?.split(" ") ?? []);

    expect(v).toEqual({
      typographyFontStyle: "paragraph",
      tabletTypographyFontStyle: null,
      mobileTypographyFontStyle: null,
      typographyFontFamily: "lato",
      typographyFontFamilyType: "google",
      typographyFontSize: 16,
      tabletTypographyFontSize: null,
      mobileTypographyFontSize: null,
      typographyFontSizeSuffix: "px",
      tabletTypographyFontSizeSuffix: null,
      mobileTypographyFontSizeSuffix: null,
      typographyFontWeight: 400,
      tabletTypographyFontWeight: null,
      mobileTypographyFontWeight: null,
      typographyLineHeight: 1.3,
      tabletTypographyLineHeight: null,
      mobileTypographyLineHeight: null,
      typographyVariableFontWeight: 400,
      tabletTypographyVariableFontWeight: null,
      mobileTypographyVariableFontWeight: null,
      typographyFontWidth: 100,
      tabletTypographyFontWidth: null,
      mobileTypographyFontWidth: null,
      typographyFontSoftness: 0,
      tabletTypographyFontSoftness: null,
      mobileTypographyFontSoftness: null,
      typographyLetterSpacing: 0,
      tabletTypographyLetterSpacing: null,
      mobileTypographyLetterSpacing: null,
      contentHorizontalAlign: "left",
      tabletContentHorizontalAlign: null,
      mobileContentHorizontalAlign: null,
      marginTop: 0,
      tabletMarginTop: null,
      mobileMarginTop: null,
      marginBottom: 0,
      tabletMarginBottom: null,
      mobileMarginBottom: null,
      "block-colorPalette": "color2"
    });
  });
});

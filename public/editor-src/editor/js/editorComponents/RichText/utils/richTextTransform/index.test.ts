import cheerio from "cheerio";
import { getStyles } from "./index";
import { parseOutputCss, replacePlaceholders } from "visual/utils/cssStyle";
// import { getFontStyle } from "visual/utils/fonts";

jest.mock("visual/utils/fonts", () => ({
  getFontStyle: (style: "paragraph" | "heading1" | "abovetitle") => {
    switch (style) {
      case "paragraph":
        return {
          deletable: "off",
          fontFamily: "sanchez",
          fontFamilyType: "google",
          fontSize: 16,
          fontSizeSuffix: "em",
          fontWeight: 400,
          id: "paragraph",
          letterSpacing: 0,
          lineHeight: 1.9,
          mobileFontSize: 15,
          mobileFontSizeSuffix: "px",
          mobileFontWeight: 400,
          mobileLetterSpacing: 0,
          mobileLineHeight: 1.6,
          tabletFontSize: 15,
          tabletFontSizeSuffix: "vw",
          tabletFontWeight: 400,
          tabletLetterSpacing: 0,
          tabletLineHeight: 1.6,
          title: "Paragraph"
        };
      case "heading1":
        return {
          deletable: "off",
          fontFamily: "kaushan_script",
          fontFamilyType: "google",
          fontSize: 55,
          fontSizeSuffix: "em",
          fontWeight: 700,
          id: "heading1",
          letterSpacing: -1.5,
          lineHeight: 1.7,
          mobileFontSize: 40,
          mobileFontSizeSuffix: "px",
          mobileFontWeight: 300,
          mobileLetterSpacing: -1,
          mobileLineHeight: 1.3,
          tabletFontSize: 15,
          tabletFontSizeSuffix: "vw",
          tabletFontWeight: 500,
          tabletLetterSpacing: 6,
          tabletLineHeight: 3.6,
          title: "Heading 1"
        };
      case "abovetitle":
        return {
          deletable: "off",
          fontFamily: "overpass",
          fontFamilyType: "google",
          fontSize: 20,
          fontSizeSuffix: "em",
          fontWeight: 400,
          id: "abovetitle",
          letterSpacing: 3,
          lineHeight: 1.6,
          mobileFontSize: 23,
          mobileFontSizeSuffix: "px",
          mobileFontWeight: 600,
          mobileLetterSpacing: 0,
          mobileLineHeight: 2,
          tabletFontSize: 14,
          tabletFontSizeSuffix: "vw",
          tabletFontWeight: 100,
          tabletLetterSpacing: 1.5,
          tabletLineHeight: 1.8,
          title: "Above Title"
        };
    }
  },
  // ! todo Add Upload font
  getFontById: ({
    family
  }: {
    family: "sanchez" | "kaushan_script" | "overpass";
  }) => {
    switch (family) {
      case "sanchez":
        return {
          brizyId: "uvszogglrytbywwesensevgujkurgouwaett",
          family: "Sanchez, serif",
          id: "sanchez",
          title: "Sanchez",
          weights: [400]
        };
      case "kaushan_script":
        return {
          brizyId: "simpmqjphttgbnwqaobwxuxoavrdlbpdjgzc",
          family: "Kaushan Script, handwriting",
          id: "kaushan_script",
          title: "Kaushan Script",
          weights: [400]
        };
    }

    return {
      brizyId: "qwhwsomltrpyogspgbomkxquvqsqfdlvcnfo",
      family: "Overpass, sans-serif",
      id: "overpass",
      title: "Overpass",
      weights: [400, 100, 200, 300, 600, 700, 800, 900]
    };
  }
}));

function generateHTML(classNames: string[]) {
  return `<html><head></head><body class="brz"><div class="brz-rich-text"><p class="${classNames.join(
    " "
  )}"><span class="brz-cp-color7">Text</span></p></div></body></html>`;
}

describe("Testing 'changeRichTextFonts' function", function() {
  test("FontStyles for all devices was set", () => {
    const html = generateHTML([
      "brz-tp-lg-heading1",
      "brz-tp-sm-paragraph",
      "brz-tp-xs-abovetitle"
    ]);

    const $ = cheerio.load(html);
    const styles = getStyles("richText", $("p"));
    const cssText = replacePlaceholders(styles.css, styles.id);
    const css = parseOutputCss(cssText, styles.id);

    expect(css.desktop).toEqual({
      "font-family": "Kaushan Script, handwriting",
      "font-size": "55em",
      "line-height": "1.7",
      "font-weight": "700",
      "letter-spacing": "-1.5px",
      "margin-bottom": "0px !important",
      "margin-top": "0px !important",
      "text-align": "left"
    });

    expect(css.tablet).toEqual({
      "font-size": "15vw",
      "line-height": "1.6",
      "font-weight": "400",
      "letter-spacing": "0px",
      "margin-bottom": "0px !important",
      "margin-top": "0px !important",
      "text-align": "left"
    });

    expect(css.mobile).toEqual({
      "font-size": "23px",
      "line-height": "2",
      "font-weight": "600",
      "letter-spacing": "0px",
      "margin-bottom": "0px !important",
      "margin-top": "0px !important",
      "text-align": "left"
    });

    // expect(1).toBe(1);
  });

  test("Simple styles for all devices was set", () => {
    const html = generateHTML([
      "brz-ff-kaushan_script",
      "brz-ft-google",

      "brz-fs-lg-56",
      "brz-fss-lg-em",
      "brz-fw-lg-700",
      "brz-lh-lg-1_3",
      "brz-ls-lg-m_1_5",

      "brz-fs-sm-17",
      "brz-fss-sm-px",
      "brz-fw-sm-700",
      "brz-lh-sm-1_6",
      "brz-ls-sm-2",

      "brz-fs-xs-15",
      "brz-fss-xs-px",
      "brz-fw-xs-700",
      "brz-lh-xs-1_6",
      "brz-ls-xs-0"
    ]);

    const $ = cheerio.load(html);
    const styles = getStyles("richText", $("p"));
    const cssText = replacePlaceholders(styles.css, styles.id);
    const css = parseOutputCss(cssText, styles.id);

    expect(css.desktop).toEqual({
      "font-family": "Kaushan Script, handwriting",
      "font-size": "56em",
      "line-height": "1.3",
      "font-weight": "700",
      "letter-spacing": "-1.5px",
      "margin-bottom": "0px !important",
      "margin-top": "0px !important",
      "text-align": "left"
    });

    expect(css.tablet).toEqual({
      "font-size": "17px",
      "line-height": "1.6",
      "font-weight": "700",
      "letter-spacing": "2px",
      "margin-bottom": "0px !important",
      "margin-top": "0px !important",
      "text-align": "left"
    });

    expect(css.mobile).toEqual({
      "font-size": "15px",
      "line-height": "1.6",
      "font-weight": "700",
      "letter-spacing": "0px",
      "margin-bottom": "0px !important",
      "margin-top": "0px !important",
      "text-align": "left"
    });
  });

  test("Desktop, mobile - simple styles, tablet - typography", () => {
    const html = generateHTML([
      "brz-ff-kaushan_script",
      "brz-ft-google",

      "brz-fs-lg-56",
      "brz-fss-lg-em",
      "brz-fw-lg-700",
      "brz-lh-lg-1_3",
      "brz-ls-lg-m_1_5",

      "brz-tp-sm-heading1",

      "brz-fs-xs-15",
      "brz-fss-xs-px",
      "brz-fw-xs-700",
      "brz-lh-xs-1_6",
      "brz-ls-xs-0"
    ]);

    const $ = cheerio.load(html);
    const styles = getStyles("richText", $("p"));
    const cssText = replacePlaceholders(styles.css, styles.id);
    const css = parseOutputCss(cssText, styles.id);

    expect(css.desktop).toEqual({
      "font-family": "Kaushan Script, handwriting",
      "font-size": "56em",
      "line-height": "1.3",
      "font-weight": "700",
      "letter-spacing": "-1.5px",
      "margin-bottom": "0px !important",
      "margin-top": "0px !important",
      "text-align": "left"
    });

    expect(css.tablet).toEqual({
      "font-size": "15vw",
      "line-height": "3.6",
      "font-weight": "500",
      "letter-spacing": "6px",
      "margin-bottom": "0px !important",
      "margin-top": "0px !important",
      "text-align": "left"
    });

    expect(css.mobile).toEqual({
      "font-size": "15px",
      "line-height": "1.6",
      "font-weight": "700",
      "letter-spacing": "0px",
      "margin-bottom": "0px !important",
      "margin-top": "0px !important",
      "text-align": "left"
    });
  });

  // for legacy project
  test("Legacy typography was set", () => {
    const html = generateHTML([
      "brz-tp-paragraph",
      "brz-text-sm-right",
      "brz-mb-sm-84",
      "brz-mt-sm-17",
      "brz-text-lg-center",
      "brz-mb-lg-57",
      "brz-mt-lg-36"
    ]);

    const $ = cheerio.load(html);
    const styles = getStyles("richText", $("p"));
    const cssText = replacePlaceholders(styles.css, styles.id);
    const css = parseOutputCss(cssText, styles.id);

    expect(css.desktop).toEqual({
      "font-family": "Sanchez, serif",
      "font-size": "16em",
      "line-height": "1.9",
      "font-weight": "400",
      "letter-spacing": "0px",
      "margin-bottom": "57px !important",
      "margin-top": "36px !important",
      "text-align": "center"
    });

    expect(css.tablet).toEqual({
      "font-size": "15vw",
      "line-height": "1.6",
      "font-weight": "400",
      "letter-spacing": "0px",
      "margin-bottom": "84px !important",
      "margin-top": "17px !important",
      "text-align": "right"
    });

    expect(css.mobile).toEqual({
      "font-size": "15px",
      "line-height": "1.6",
      "font-weight": "400",
      "letter-spacing": "0px",
      "margin-bottom": "57px !important",
      "margin-top": "36px !important",
      "text-align": "center"
    });
  });

  // intermediate styles for legacy project
  test("Only legacy styles was set", () => {
    const html = generateHTML([
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

    const $ = cheerio.load(html);
    const styles = getStyles("richText", $("p"));
    const cssText = replacePlaceholders(styles.css, styles.id);
    const css = parseOutputCss(cssText, styles.id);

    expect(css.desktop).toEqual({
      "font-family": "Sanchez, serif",
      "font-size": "47px",
      "line-height": "1.3",
      "font-weight": "700",
      "letter-spacing": "-2.5px",
      "margin-bottom": "0px !important",
      "margin-top": "0px !important",
      "text-align": "left"
    });
    expect(css.tablet).toEqual({
      "font-size": "39px",
      "line-height": "1.2",
      "font-weight": "700",
      "letter-spacing": "-1px",
      "margin-bottom": "0px !important",
      "margin-top": "0px !important",
      "text-align": "left"
    });
    expect(css.mobile).toEqual({
      "font-size": "37px",
      "line-height": "1.3",
      "font-weight": "700",
      "letter-spacing": "0px",
      "margin-bottom": "0px !important",
      "margin-top": "0px !important",
      "text-align": "left"
    });
  });
});

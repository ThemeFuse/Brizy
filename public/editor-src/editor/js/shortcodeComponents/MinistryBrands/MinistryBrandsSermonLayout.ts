import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "MinistryBrandsSermonLayout",
    title: t("Sermon Layout"),
    icon: "t2-sermon-layout",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ministryBrands"],
        items: [
          {
            type: "MinistryBrandsSermonLayout",
            value: {
              _styles: ["ministryBrandsSermonLayout"],
              titleTypographyFontStyle: "heading4",
              titleColorPalette: "color3",
              hoverTitleColorPalette: "color4",
              typographyFontStyle: "heading6",
              colorPalette: "color7",
              detailButtonTypographyFontStyle: "button",
              detailButtonColorHex: "#ffffff",
              detailButtonColorPalette: "color8",
              detailButtonBgColorPalette: "color3",
              hoverDetailButtonBgColorOpacity: 0.8,
              paginationTypographyFontStyle: "heading6",
              paginationColorPalette: "color3",
              hoverPaginationColorPalette: "color4",
              activePaginationColorPalette: "color2",
              previewTypographyFontStyle: "paragraph",
              previewColorPalette: "color7",
              metaLinksColorPalette: "color3",
              hoverMetaLinksColorPalette: "color4",
              filterBgColorPalette: "color6"
            }
          }
        ]
      }
    }
  };
}

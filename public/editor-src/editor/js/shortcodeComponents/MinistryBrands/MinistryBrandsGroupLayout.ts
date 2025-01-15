import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "MinistryBrandsGroupLayout",
    title: t("Group Layout"),
    icon: "t2-group-layout",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ministryBrands"],
        items: [
          {
            type: "MinistryBrandsGroupLayout",
            value: {
              _styles: ["ministryBrandsGroupLayout"],
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
              previewTypographyFontStyle: "paragraph",
              previewColorPalette: "color7",
              paginationTypographyFontStyle: "heading6",
              paginationColorPalette: "color3",
              hoverPaginationColorPalette: "color4",
              activePaginationColorPalette: "color2",
              metaLinksColorPalette: "color4",
              metaLinksTypographyFontStyle: "heading6",
              filterBgColorPalette: "color6"
            }
          }
        ]
      }
    }
  };
}

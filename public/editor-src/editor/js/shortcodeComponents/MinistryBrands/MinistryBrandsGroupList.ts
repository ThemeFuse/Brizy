import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "MinistryBrandsGroupList",
    title: t("Group List"),
    icon: "t2-group-list",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ministryBrands"],
        items: [
          {
            type: "MinistryBrandsGroupList",
            value: {
              _styles: ["ministryBrandsGroupList"],
              typographyFontStyle: "heading6",
              colorPalette: "color7",
              previewTypographyFontStyle: "paragraph",
              previewColorPalette: "color7",
              metaLinksColorPalette: "color4",
              titleTypographyFontStyle: "heading4",
              titleColorPalette: "color3",
              hoverTitleColorPalette: "color4",
              detailButtonTypographyFontStyle: "button",
              detailButtonColorPalette: "color8",
              detailButtonBgColorPalette: "color3",
              hoverDetailButtonBgColorOpacity: 0.8,
              paginationTypographyFontStyle: "heading6",
              paginationColorPalette: "color3",
              hoverPaginationColorPalette: "color4",
              activePaginationColorPalette: "color2"
            }
          }
        ]
      }
    }
  };
}

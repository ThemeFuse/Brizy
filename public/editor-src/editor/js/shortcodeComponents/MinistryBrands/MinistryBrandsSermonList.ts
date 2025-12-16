import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "MinistryBrandsSermonList",
    title: t("Sermon List"),
    icon: "t2-sermon-list",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ministryBrands"],
        items: [
          {
            type: "MinistryBrandsSermonList",
            value: {
              _styles: ["ministryBrandsSermonList"],
              typographyFontStyle: "heading6",
              colorPalette: "color7",
              titleTypographyFontStyle: "heading4",
              titleColorPalette: "color3",
              hoverTitleColorPalette: "color4",
              previewTypographyFontStyle: "paragraph",
              previewColorPalette: "color7",
              detailButtonTypographyFontStyle: "button",
              detailButtonColorPalette: "color8",
              detailButtonBgColorPalette: "color3",
              hoverDetailButtonBgColorOpacity: 0.8,
              paginationTypographyFontStyle: "heading6",
              paginationColorPalette: "color3",
              hoverPaginationColorPalette: "color4",
              activePaginationColorPalette: "color2",
              metaLinksColorPalette: "color3",
              hoverMetaLinksColorPalette: "color4"
            }
          }
        ]
      }
    }
  };
}

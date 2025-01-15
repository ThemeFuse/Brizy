import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "MinistryBrandsGroupFeatured",
    title: t("Group Featured"),
    icon: "t2-group-featured",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ministryBrands"],
        items: [
          {
            type: "MinistryBrandsGroupFeatured",
            value: {
              _styles: ["ministryBrandsGroupFeatured"],
              titleTypographyFontStyle: "heading2",
              titleColorPalette: "color3",
              hoverTitleColorPalette: "color4",
              dateTypographyFontStyle: "heading5",
              dateColorPalette: "color7",
              typographyFontStyle: "heading6",
              colorPalette: "color7",
              detailButtonColorPalette: "color8",
              detailButtonBgColorPalette: "color3",
              hoverDetailButtonBgColorOpacity: 0.8,
              metaLinksTypographyFontStyle: "heading6",
              metaLinksColorPalette: "color4",
              previewTypographyFontStyle: "paragraph",
              previewColorPalette: "color7"
            }
          }
        ]
      }
    }
  };
}

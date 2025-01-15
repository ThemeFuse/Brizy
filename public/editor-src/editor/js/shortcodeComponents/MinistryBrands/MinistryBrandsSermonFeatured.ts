import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "MinistryBrandsSermonFeatured",
    title: t("Sermon Featured"),
    icon: "t2-sermon-featured",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ministryBrands"],
        items: [
          {
            type: "MinistryBrandsSermonFeatured",
            value: {
              _styles: ["ministryBrandsSermonFeatured"],
              titleTypographyFontStyle: "heading2",
              titleColorPalette: "color3",
              hoverTitleColorPalette: "color4",
              typographyFontStyle: "heading6",
              colorPalette: "color7",
              previewTypographyFontStyle: "paragraph",
              previewColorPalette: "color7",
              detailButtonTypographyFontStyle: "button",
              detailButtonColorPalette: "color8",
              detailButtonBgColorPalette: "color3",
              hoverDetailButtonBgColorOpacity: 0.8,
              metaLinksColorPalette: "color4"
            }
          }
        ]
      }
    }
  };
}

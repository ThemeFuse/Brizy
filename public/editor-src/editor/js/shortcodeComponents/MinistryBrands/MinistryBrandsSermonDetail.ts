import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "MinistryBrandsSermonDetail",
    title: t("Sermon Detail"),
    icon: "t2-sermon-detail",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ministryBrands"],
        items: [
          {
            type: "MinistryBrandsSermonDetail",
            value: {
              _styles: ["ministryBrandsSermonDetail"],
              titleTypographyFontStyle: "heading2",
              titleColorPalette: "color3",
              hoverTitleColorPalette: "color4",
              typographyFontStyle: "heading6",
              colorPalette: "color7",
              previewTypographyFontStyle: "paragraph",
              previewColorPalette: "color7",
              metaLinksColorPalette: "color4",
              detailButtonTypographyFontStyle: "button",
              detailButtonColorPalette: "color8",
              detailButtonBgColorPalette: "color3",
              hoverDetailButtonBgColorOpacity: 0.8
            }
          }
        ]
      }
    }
  };
}

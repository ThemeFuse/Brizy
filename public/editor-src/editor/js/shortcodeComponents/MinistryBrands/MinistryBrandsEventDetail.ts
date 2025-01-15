import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "MinistryBrandsEventDetail",
    title: t("Event Detail"),
    icon: "t2-event-detail",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ministryBrands"],
        items: [
          {
            type: "MinistryBrandsEventDetail",
            value: {
              _styles: ["ministryBrandsEventDetail"],
              titleTypographyFontStyle: "heading2",
              titleColorPalette: "color3",
              hoverTitleColorPalette: "color4",
              dateTypographyFontStyle: "heading5",
              dateColorPalette: "color7",
              typographyFontStyle: "heading6",
              colorPalette: "color7",
              detailButtonTypographyFontStyle: "button",
              detailButtonColorPalette: "color8",
              detailButtonBgColorPalette: "color3",
              hoverDetailButtonBgColorOpacity: 0.8,
              previewTypographyFontStyle: "paragraph",
              previewColorPalette: "color7",
              metaLinksColorPalette: "color4"
            }
          }
        ]
      }
    }
  };
}

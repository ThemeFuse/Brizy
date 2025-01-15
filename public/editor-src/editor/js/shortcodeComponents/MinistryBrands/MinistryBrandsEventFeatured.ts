import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "MinistryBrandsEventFeatured",
    title: t("Event Featured"),
    icon: "t2-event-featured",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ministryBrands"],
        items: [
          {
            type: "MinistryBrandsEventFeatured",
            value: {
              _styles: ["ministryBrandsEventFeatured"],
              titleTypographyFontStyle: "heading2",
              titleColorPalette: "color3",
              hoverTitleColorPalette: "color4",
              dateTypographyFontStyle: "heading5",
              dateColorPalette: "color7",
              typographyFontStyle: "heading6",
              colorPalette: "color7",
              previewTypographyFontStyle: "paragraph",
              previewColorPalette: "color7",
              metaLinksColorPalette: "color3",
              hoverMetaLinksColorPalette: "color4",
              detailButtonTypographyFontStyle: "button",
              detailButtonColorPalette: "color8",
              detailButtonBgColorPalette: "color3",
              hoverDetailButtonBgColorOpacity: 0.8,
              registerButtonTypographyFontStyle: "button",
              registerButtonColorPalette: "color8",
              registerButtonBgColorPalette: "color3",
              hoverRegisterButtonBgColorOpacity: 0.8
            }
          }
        ]
      }
    }
  };
}

import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "MinistryBrandsGroupSlider",
    title: t("Group Slider"),
    icon: "t2-group-slider",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ministryBrands"],
        items: [
          {
            type: "MinistryBrandsGroupSlider",
            value: {
              _styles: ["ministryBrandsGroupSlider"],
              titleTypographyFontStyle: "heading4",
              titleColorPalette: "color3",
              hoverTitleColorPalette: "color4",
              metaTypographyFontStyle: "heading6",
              metaColorPalette: "color7",
              buttonTypographyFontStyle: "button",
              buttonBgColorPalette: "color3",
              buttonColorPalette: "color8",
              hoverButtonBgColorOpacity: 0.8,
              arrowColorPalette: "color3",
              hoverArrowColorPalette: "color4",
              dotsBgColorPalette: "color4"
            }
          }
        ]
      }
    }
  };
}

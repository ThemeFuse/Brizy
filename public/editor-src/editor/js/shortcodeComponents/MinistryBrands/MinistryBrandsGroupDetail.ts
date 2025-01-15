import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "MinistryBrandsGroupDetail",
    title: t("Group Detail"),
    icon: "t2-group-detail",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ministryBrands"],
        items: [
          {
            type: "MinistryBrandsGroupDetail",
            value: {
              _styles: ["ministryBrandsGroupDetail"],
              titleTypographyFontStyle: "heading2",
              titleColorPalette: "color3",
              hoverTitleColorPalette: "color4",
              dateTypographyFontStyle: "heading5",
              dateColorPalette: "color7",
              typographyFontStyle: "heading6",
              colorPalette: "color7",
              metaLinksColorPalette: "color4",
              previewTypographyFontStyle: "paragraph",
              previewColorPalette: "color7",
              paragraphTypographyFontStyle: "paragraph",
              paragraphColorPalette: "color7",
              h4TypographyFontStyle: "heading4",
              h4ColorPalette: "color7",
              listTypographyFontStyle: "paragraph",
              listColorPalette: "color7"
            }
          }
        ]
      }
    }
  };
}

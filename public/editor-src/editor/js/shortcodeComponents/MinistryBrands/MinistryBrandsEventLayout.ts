import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "MinistryBrandsEventLayout",
    title: t("Event Layout"),
    icon: "t2-event-layout",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ministryBrands"],
        items: [
          {
            type: "MinistryBrandsEventLayout",
            value: {
              _styles: ["ministryBrandsEventLayout"],
              titleTypographyFontStyle: "heading5",
              titleColorPalette: "color3",
              hoverTitleColorPalette: "color4",
              dateTypographyFontStyle: "paragraph",
              dateColorPalette: "color7",
              eventsTypographyFontStyle: "heading6",
              eventsColorPalette: "color3",
              hoverEventsColorPalette: "color4",
              layoutViewTypographyFontStyle: "paragraph",
              viewColorPalette: "color3",
              viewBgColorPalette: "color8",
              viewBgColorOpacity: 1,
              hoverViewColorOpacity: 0.5,
              activeViewColorPalette: "color4",
              activeViewBgColorPalette: "color6",
              filterBgColorPalette: "color6",
              listPaginationTypographyFontStyle: "heading5",
              listPaginationColorPalette: "color1",
              hoverListPaginationColorPalette: "color4",
              listTitleTypographyFontStyle: "heading3",
              listTitleColorPalette: "color1",
              listItemTitleTypographyFontStyle: "heading5",
              listItemTitleColorPalette: "color3",
              hoverListItemTitleColorOpacity: 0.5,
              listItemDateTypographyFontStyle: "heading6",
              listItemDateBgColorPalette: "color4",
              listItemMetaTypographyFontStyle: "paragraph",
              listItemMetaColorPalette: "color5",
              calendarHeadingTypographyFontStyle: "heading6",
              calendarHeadingColorPalette: "color1",
              calendarDaysColorPalette: "color4",
              hoverCalendarDaysColorPalette: "color3"
            }
          }
        ]
      }
    }
  };
}

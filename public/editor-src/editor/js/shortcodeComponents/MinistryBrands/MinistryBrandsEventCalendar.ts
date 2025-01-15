import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "MinistryBrandsEventCalendar",
    title: t("Event Calendar"),
    icon: "t2-event-calendar",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper-ministryBrands"],
        items: [
          {
            type: "MinistryBrandsEventCalendar",
            value: {
              _styles: ["ministryBrandsEventCalendar"],
              paginationTypographyFontStyle: "heading5",
              paginationColorPalette: "color1",
              titleTypographyFontStyle: "heading6",
              titleColorPalette: "color3",
              hoverTitleColorPalette: "color4",
              weekdaysColorPalette: "color1",
              dayColorPalette: "color4",
              hoverDayColorPalette: "color3",
              dayBorderColorPalette: "color6",
              dayBorderStyle: "solid",
              dayBorderColorOpacity: 1,
              dayBorderWidth: 1,
              tableBorderColorPalette: "color6",
              subscribeToCalendarTypographyFontStyle: "button",
              arrowColorPalette: "color1"
            }
          }
        ]
      }
    }
  };
}

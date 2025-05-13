import {
  getAlignFn,
  getSpacingFn
} from "visual/editorComponents/Ecwid/EcwidFavorites/css";
import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import {
  refineBySelector,
  searchResultsSelector,
  searchResultsWrapperSelector
} from "./css/selectors";
import type { Value } from "./types";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const searchResults = getColorToolbar(
    dvv("searchResultsPalette"),
    dvv("searchResultsHex"),
    dvv("searchResultsOpacity")
  );

  return [
    {
      id: "toolbarTypographySearchResults",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 10,
      options: [
        {
          id: "searchResultsTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          },
          selector: `${searchResultsSelector}, ${refineBySelector}`
        }
      ]
    },
    {
      id: "toolbarSearchResultsColor",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: searchResults
          }
        }
      },
      devices: "desktop",
      position: 20,
      options: [
        {
          id: "searchResultsColor",
          type: "colorPicker",
          states: [NORMAL, HOVER],
          selector: `${searchResultsSelector}, ${refineBySelector}`
        }
      ]
    },
    {
      id: "searchResultsHorizontalAlign",
      type: "toggle",
      position: 30,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        {
          icon: "nc-text-align-center",
          title: t("Align"),
          value: "center"
        },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ],
      style: getAlignFn(searchResultsWrapperSelector)
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: { icon: "nc-cog", title: t("Settings") },
      devices: "desktop",
      position: 40,
      options: [
        {
          id: "searchResultsSpacing",
          label: t("Spacing"),
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          },
          style: getSpacingFn(searchResultsWrapperSelector)
        }
      ]
    }
  ];
};

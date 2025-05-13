import { getSpacingFn } from "visual/editorComponents/Ecwid/EcwidFavorites/css";
import { dropdownTitleAlignCSS } from "visual/editorComponents/Ecwid/EcwidSearch/css";
import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import {
  dropdownTitleSelector,
  dropdownTitleTextSelector,
  filtersResultsHeadSelector,
  filtersResultsSelector
} from "./css/selectors";
import { Value } from "./types";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const dropdownTitleColor = getColorToolbar(
    dvv("dropdownTitleColorPalette"),
    dvv("dropdownTitleColorHex"),
    dvv("dropdownTitleColorOpacity")
  );

  return [
    {
      id: "toolbarTypographyTitle",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 10,
      options: [
        {
          id: "dropdownTitleTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          },
          selector: `${dropdownTitleTextSelector}, ${filtersResultsSelector}`
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: dropdownTitleColor
          }
        }
      },
      devices: "desktop",
      position: 20,
      options: [
        {
          id: "dropdownTitleColor",
          type: "colorPicker",
          states: [NORMAL, HOVER],
          selector: `${dropdownTitleTextSelector}, ${filtersResultsSelector}`
        }
      ]
    },
    {
      id: "dropdownTitleHorizontalAlign",
      type: "toggle",
      position: 30,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ],
      style: dropdownTitleAlignCSS
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: { icon: "nc-cog", title: t("Settings") },
      devices: "desktop",
      position: 40,
      options: [
        {
          id: "dropdownTitleSpacing",
          label: t("Spacing"),
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          },
          style: getSpacingFn(
            `${dropdownTitleSelector}, ${filtersResultsHeadSelector}`
          )
        }
      ]
    }
  ];
};

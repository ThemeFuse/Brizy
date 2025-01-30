import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { getAlignFn, getSpacingFn } from "./css";
import { priceSelector } from "./css/selectors";
import type { Value } from "./types";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const priceColor = getColorToolbar(
    dvv("priceColorPalette"),
    dvv("priceColorHex"),
    dvv("priceColorOpacity")
  );

  return [
    {
      id: "toolbarTypographyPrice",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 10,
      options: [
        {
          id: "priceTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          },
          selector: priceSelector
        }
      ]
    },
    {
      id: "toolbarColorPrice",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: priceColor
          }
        }
      },
      devices: "desktop",
      position: 20,
      options: [
        {
          id: "priceColor",
          type: "colorPicker",
          states: [NORMAL, HOVER],
          selector: priceSelector
        }
      ]
    },
    {
      id: "priceHorizontalAlign",
      type: "toggle",
      position: 30,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ],
      style: getAlignFn(priceSelector)
    },
    {
      id: "toolbarPriceSettings",
      type: "popover",
      config: { icon: "nc-cog", title: t("Settings") },
      devices: "desktop",
      position: 40,
      options: [
        {
          id: "priceSpacing",
          label: t("Spacing"),
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          },
          style: getSpacingFn(priceSelector)
        }
      ]
    }
  ];
};

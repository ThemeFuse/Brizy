import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { Value } from "./index";

export const getItems = ({
  v,
  device
}: {
  v: Value;
  device: ResponsiveMode;
}): ToolbarItemType[] => {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state: "normal" });

  const buttonColorOpacity = dvv("buttonColorOpacity") as number;
  const textColorOpacity = dvv("titleColorOpacity") as number;

  const { hex: buttonColorHex } = getOptionColorHexByPalette(
    dvv("buttonColorHex"),
    dvv("buttonColorPalette")
  );
  const { hex: textColorHex } = getOptionColorHexByPalette(
    dvv("textColorHex"),
    dvv("textColorPalette")
  );

  return [
    {
      id: "toolbarAutomizelyOT",
      type: "popover",
      config: {
        size: "auto",
        title: t("Content"),
        icon: "nc-shopify-logo"
      },
      devices: "desktop",
      position: 10,
      options: [
        {
          id: "lookupOption",
          label: t("Lookup Options"),
          type: "select",
          choices: [
            { title: "Tracking Number", value: "tracking-number" },
            { title: "Order Number & Email", value: "order-number-and-email" },
            { title: "Both", value: "both" }
          ]
        },
        {
          id: "buttonText",
          label: t("Button text"),
          type: "inputText"
        },
        {
          id: "domain",
          label: t("Tracking Page URL"),
          type: "inputText",
          helper: {
            content: t(
              "Get your tracking page URL in the Tracking pages section of AfterShip application."
            )
          }
        },
        {
          id: "hideIcon",
          label: t("Hide Aftership Icon"),
          type: "switch"
        },
        {
          id: "size",
          label: t("Size"),
          type: "radioGroup",
          choices: [
            { value: "small", icon: "nc-small" },
            { value: "medium", icon: "nc-medium" },
            { value: "large", icon: "nc-large" }
          ]
        }
      ]
    },
    {
      id: "popoverColor",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor:
              buttonColorOpacity > 0
                ? hexToRgba(buttonColorHex, buttonColorOpacity)
                : hexToRgba(textColorHex, textColorOpacity)
          }
        }
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabButton",
              label: t("Button"),
              options: [
                {
                  id: "buttonColor",
                  type: "colorPicker"
                }
              ]
            },
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "textColor",
                  type: "colorPicker"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      devices: "desktop",
      position: 110,
      title: t("Settings")
    }
  ];
};

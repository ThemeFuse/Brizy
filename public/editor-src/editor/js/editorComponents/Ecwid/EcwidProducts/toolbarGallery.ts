import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { State } from "visual/utils/stateMode";
import { Value } from "./types/Value";

export function getItems({
  v,
  device,
  state
}: {
  v: Value;
  device: ResponsiveMode;
  state: State;
}): ToolbarItemType[] {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const disableLabel = dvv("editLabel") === "off";

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      config: {
        icon: "nc-woo-gallery",
        title: t("Gallery")
      },
      position: 10,
      options: [
        {
          id: "editLabel",
          label: t("Label"),
          type: "switch-dev"
        },
        {
          id: "displayMode",
          label: t("Display Mode"),
          type: "select-dev",
          choices: [
            { value: "AUTO", title: "Auto" },
            { value: "COVER", title: "Cover" },
            { value: "FIT", title: "Fit" }
          ]
        },
        {
          id: "ratio",
          label: t("Ratio"),
          type: "select-dev",
          choices: [
            { value: "PORTRAIT_0667", title: "2:3" },
            { value: "PORTRAIT_075", title: "3:4" },
            { value: "SQUARE", title: "1:1" },
            { value: "LANDSCAPE_1333", title: "4:3" },
            { value: "LANDSCAPE_15", title: "3:2" }
          ]
        },
        {
          id: "groupSize",
          type: "group-dev",
          options: [
            {
              id: "galleryWidth",
              label: t("Size"),
              type: "radioGroup-dev",
              choices: [
                { value: "SMALL", icon: "nc-small" },
                { value: "MEDIUM", icon: "nc-medium" },
                { value: "LARGE", icon: "nc-large" },
                { value: "custom", icon: "nc-more" }
              ]
            },
            {
              id: "galleryCustomSize",
              disabled: dvv("galleryWidth") !== "custom",
              type: "slider-dev",
              config: {
                min: 1,
                max: 6
              }
            }
          ]
        }
      ]
    },
    {
      id: "popoverTypography",
      type: "popover-dev",
      disabled: disableLabel,
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 20,
      options: [
        {
          id: "labelTypography",
          type: "typography-dev",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: { icon: "nc-cog", title: t("Settings") },
      position: 30,
      options: [
        {
          id: "galleryBottomSpacing",
          label: t("Spacing"),
          type: "slider-dev",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "styles",
          type: "sidebarTabsButton-dev",
          disabled: disableLabel,
          devices: "desktop",
          config: {
            tabId: "styles",
            text: t("Styling"),
            icon: "nc-cog",
            align: "left"
          }
        }
      ]
    }
  ];
}

import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { Slug, Value } from "./types";

export const getItems: GetItems<Value> = ({ v, device }) => {
  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });

  const iconsColor = getColorToolbar(
    dvv("iconsColorPalette"),
    dvv("iconsColorHex"),
    dvv("iconsColorOpacity")
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "nc-wp-post-info",
        title: t("Post info")
      },
      position: 60,
      options: [
        {
          id: "postElements",
          type: "multiSelect",
          label: t("Elements"),
          placeholder: t("0 Selected"),
          devices: "desktop",
          choices: [
            { value: Slug.Author, title: t("Author") },
            { value: Slug.Date, title: t("Date") },
            { value: Slug.Time, title: t("Time") }
          ]
        },
        {
          id: "orientation",
          label: t("Orientation"),
          type: "radioGroup",
          devices: "desktop",
          choices: [
            { value: "inline", icon: "nc-horizontal-items" },
            { value: "column", icon: "nc-vertical-items" }
          ]
        },
        {
          id: "textSpacing",
          label: t("Spacing"),
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        }
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: iconsColor
          }
        }
      },
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "color",
                  type: "colorPicker",
                  devices: "desktop"
                }
              ]
            },
            {
              id: "colorIcons",
              label: t("Icons"),
              options: [
                {
                  id: "iconsColor",
                  type: "colorPicker",
                  devices: "desktop"
                }
              ]
            }
          ]
        }
      ]
    },
    { id: "horizontalAlign", type: "toggle", disabled: true, choices: [] },
    {
      id: "contentHorizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      devices: "desktop",
      position: 150
    }
  ];
};

import { t } from "visual/utils/i18n";
import * as types from "./types/index";
import { defaultValueKey } from "visual/utils/onChange";
import {
  toolbarElementForm2Type,
  toolbarElementForm2Required,
  toolbarSizeWidthWidthPercent,
  toolbarSizeHeightHeightPx,
  toolbarElementForm2RadioCheckboxOptions,
  toolbarElementForm2DateTimeOptions,
  toolbarElementForm2FileUploadOptions,
  toolbarElementForm2SelectOptions,
  toolbarElementForm2NumberOptions
} from "visual/utils/toolbar";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const isCheckboxes = v.type === "Checkbox" || v.type === "Radio";
  const toolbarColor = isCheckboxes ? "toolbarColor" : "toolbarColorCheckbox";
  const toolbarTypography = isCheckboxes
    ? "toolbarTypography"
    : "toolbarTypographyCheckbox";

  return [
    {
      id: dvk("toolbarCurrentElement"),
      type: "popover",
      icon: "nc-form-left",
      title: t("Field"),
      roles: ["admin"],
      position: 60,
      options: [
        {
          id: "currentShortcodeTabs",
          type: "tabs",
          tabs: [
            {
              id: dvk("field"),
              label: t("Field"),
              options: [
                ...toolbarElementForm2Type({
                  v,
                  device,
                  types,
                  state: "normal",
                  devices: "desktop"
                }),
                ...toolbarElementForm2DateTimeOptions({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop"
                }),
                ...toolbarElementForm2RadioCheckboxOptions({
                  v,
                  device,
                  state: "normal"
                }),
                ...toolbarElementForm2FileUploadOptions({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop"
                }),
                ...toolbarElementForm2SelectOptions({
                  v,
                  device: "test",
                  state: "normal",
                  devices: "desktop"
                }),
                ...toolbarElementForm2NumberOptions({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop"
                }),
                ...toolbarElementForm2Required({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop"
                })
              ]
            },
            {
              id: dvk("advanced"),
              label: t("Advanced"),
              options: [
                ...(isCheckboxes
                  ? [{ id: dvk("placeholder"), type: "switch", disabled: true }]
                  : [])
              ]
            },
            {
              id: dvk("background"),
              label: t("Background"),
              options: [
                ...(isCheckboxes
                  ? [
                      { id: dvk("size"), type: "radioGroup", disabled: true },
                      {
                        id: dvk("borderRadius"),
                        type: "slider",
                        disabled: true
                      }
                    ]
                  : [])
              ]
            }
          ]
        },
        ...(isCheckboxes
          ? [{ id: dvk("size"), type: "radioGroup", disabled: true }]
          : [])
      ]
    },
    {
      id: dvk(toolbarColor),
      type: "popover",
      disabled: true
    },
    {
      id: dvk(toolbarTypography),
      type: "popover",
      disabled: true
    },
    {
      id: dvk("toolbarSettings"),
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        toolbarSizeWidthWidthPercent({
          v,
          device,
          state: "normal",
          position: 30
        }),
        toolbarSizeHeightHeightPx({
          v,
          device,
          devices: "desktop",
          disabled: v.type !== "Paragraph" || isCheckboxes,
          state: "normal",
          position: 40,
          config: {
            slider: {
              min: 1,
              max: 300
            }
          }
        })
      ]
    }
  ];
}

import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { toolbarPaddingFourFieldsPxSuffix } from "visual/utils/toolbar";

export function getItems({ v, device, state }) {
  return defaultValueValue({ v, device, state, key: "mMenu" }) === "on"
    ? getItemsMMenu({ v, device, state })
    : getItemsSimple({ v, device, state });
}

export function getItemsSimple({ v, device }) {
  const isBorderRadiusGrouped = v.borderRadiusType === "grouped";
  return [
    {
      id: "settingsTabs",
      type: "tabs-dev",
      config: {
        align: "start"
      },
      devices: "desktop",
      tabs: [
        {
          id: "settingsStyling",
          label: t("Styling"),
          icon: "nc-styling",
          options: []
        },
        {
          id: "moreSettingsAdvanced",
          label: t("Advanced"),
          icon: "nc-cog",
          options: []
        }
      ]
    },
    {
      id: "borderRadiusPicker",
      type: "group-dev",
      devices: "desktop",
      options: [
        {
          id: "borderRadiusType",
          label: t("Corner dev"),
          type: "radioGroup-dev",
          choices: [
            { value: "grouped", icon: "nc-corners-all" },
            { value: "ungrouped", icon: "nc-corners-individual" }
          ]
        },
        {
          id: "borderRadius",
          type: "slider",
          disabled: !isBorderRadiusGrouped,
          slider: {
            min: 0,
            max: 100
          },
          input: {
            show: true,
            min: 0
          },
          suffix: {
            show: true,
            choices: [{ title: "px", value: "px" }]
          },
          value: {
            value: v.borderRadius
          },
          onChange: ({ value: borderRadius }, { sliderDragEnd }) => {
            return {
              borderRadius,
              borderTopLeftRadius: borderRadius,
              borderTopRightRadius: borderRadius,
              borderBottomLeftRadius: borderRadius,
              borderBottomRightRadius: borderRadius,

              tempBorderRadius: sliderDragEnd
                ? borderRadius
                : v.tempBorderRadius,

              tempBorderTopLeftRadius:
                borderRadius > 0 && sliderDragEnd
                  ? borderRadius
                  : v.tempBorderTopLeftRadius,

              tempBorderTopRightRadius:
                borderRadius > 0 && sliderDragEnd
                  ? borderRadius
                  : v.tempBorderTopRightRadius,

              tempBorderBottomRightRadius:
                borderRadius > 0 && sliderDragEnd
                  ? borderRadius
                  : v.tempBorderBottomRightRadius,

              tempBorderBottomLeftRadius:
                borderRadius > 0 && sliderDragEnd
                  ? borderRadius
                  : v.tempBorderBottomLeftRadius
            };
          }
        },
        {
          id: "borderTopLeftRadius",
          icon: "nc-corners-top-left",
          type: "slider",
          disabled: isBorderRadiusGrouped,
          slider: {
            min: 0,
            max: 100
          },
          input: {
            show: true,
            min: 0
          },
          suffix: {
            show: true,
            choices: [{ title: "px", value: "px" }]
          },
          value: {
            value: v.borderTopLeftRadius
          },
          onChange: ({ value: borderTopLeftRadius }, { sliderDragEnd }) => {
            return {
              borderTopLeftRadius,

              borderTopRightRadius:
                borderTopLeftRadius > 0
                  ? v.tempBorderTopRightRadius
                  : v.borderTopRightRadius,

              borderBottomLeftRadius:
                borderTopLeftRadius > 0
                  ? v.tempBorderBottomLeftRadius
                  : v.borderBottomLeftRadius,

              borderBottomRightRadius:
                borderTopLeftRadius > 0
                  ? v.tempBorderBottomRightRadius
                  : v.borderBottomRightRadius,

              borderRadius:
                borderTopLeftRadius === v.borderTopRightRadius &&
                borderTopLeftRadius === v.borderBottomRightRadius &&
                borderTopLeftRadius === v.borderBottomLeftRadius
                  ? borderTopLeftRadius
                  : v.borderRadius,

              tempBorderTopLeftRadius: borderTopLeftRadius,

              tempBorderRadius:
                sliderDragEnd &&
                borderTopLeftRadius === v.borderTopRightRadius &&
                borderTopLeftRadius === v.borderBottomRightRadius &&
                borderTopLeftRadius === v.borderBottomLeftRadius
                  ? borderTopLeftRadius
                  : v.tempBorderRadius
            };
          }
        },
        {
          id: "borderTopRightRadius",
          icon: "nc-corners-top-right",
          type: "slider",
          disabled: isBorderRadiusGrouped,
          slider: {
            min: 0,
            max: 100
          },
          input: {
            show: true,
            min: 0
          },
          suffix: {
            show: true,
            choices: [{ title: "px", value: "px" }]
          },
          value: {
            value: v.borderTopRightRadius
          },
          onChange: ({ value: borderTopRightRadius }, { sliderDragEnd }) => {
            return {
              borderTopRightRadius,

              borderTopLeftRadius:
                borderTopRightRadius > 0
                  ? v.tempBorderTopLeftRadius
                  : v.borderTopLeftRadius,

              borderBottomLeftRadius:
                borderTopRightRadius > 0
                  ? v.tempBorderBottomLeftRadius
                  : v.borderBottomLeftRadius,

              borderBottomRightRadius:
                borderTopRightRadius > 0
                  ? v.tempBorderBottomRightRadius
                  : v.borderBottomRightRadius,

              borderRadius:
                borderTopRightRadius === v.borderTopLeftRadius &&
                borderTopRightRadius === v.borderBottomRightRadius &&
                borderTopRightRadius === v.borderBottomLeftRadius
                  ? borderTopRightRadius
                  : v.borderRadius,

              tempBorderTopRightRadius: borderTopRightRadius,

              tempBorderRadius:
                sliderDragEnd &&
                borderTopRightRadius === v.borderTopLeftRadius &&
                borderTopRightRadius === v.borderBottomRightRadius &&
                borderTopRightRadius === v.borderBottomLeftRadius
                  ? borderTopRightRadius
                  : v.tempBorderRadius
            };
          }
        },
        {
          id: "borderBottomRightRadius",
          icon: "nc-corners-bottom-right",
          type: "slider",
          disabled: isBorderRadiusGrouped,
          slider: {
            min: 0,
            max: 100
          },
          input: {
            show: true,
            min: 0
          },
          suffix: {
            show: true,
            choices: [{ title: "px", value: "px" }]
          },
          value: {
            value: v.borderBottomRightRadius
          },
          onChange: ({ value: borderBottomRightRadius }, { sliderDragEnd }) => {
            return {
              borderBottomRightRadius,

              borderTopLeftRadius:
                borderBottomRightRadius > 0
                  ? v.tempBorderTopLeftRadius
                  : v.borderTopLeftRadius,

              borderBottomLeftRadius:
                borderBottomRightRadius > 0
                  ? v.tempBorderBottomLeftRadius
                  : v.borderBottomLeftRadius,

              borderTopRightRadius:
                borderBottomRightRadius > 0
                  ? v.tempBorderTopRightRadius
                  : v.borderTopRightRadius,

              borderRadius:
                borderBottomRightRadius === v.borderTopLeftRadius &&
                borderBottomRightRadius === v.borderTopRightRadius &&
                borderBottomRightRadius === v.borderBottomLeftRadius
                  ? borderBottomRightRadius
                  : v.borderRadius,

              tempBorderBottomRightRadius: borderBottomRightRadius,

              tempBorderRadius:
                sliderDragEnd &&
                borderBottomRightRadius === v.borderTopLeftRadius &&
                borderBottomRightRadius === v.borderTopRightRadius &&
                borderBottomRightRadius === v.borderBottomLeftRadius
                  ? borderBottomRightRadius
                  : v.tempBorderRadius
            };
          }
        },
        {
          id: "borderBottomLeftRadius",
          icon: "nc-corners-bottom-left",
          type: "slider",
          disabled: isBorderRadiusGrouped,
          slider: {
            min: 0,
            max: 100
          },
          input: {
            show: true,
            min: 0
          },
          suffix: {
            show: true,
            choices: [{ title: "px", value: "px" }]
          },
          value: {
            value: v.borderBottomLeftRadius
          },
          onChange: ({ value: borderBottomLeftRadius }, { sliderDragEnd }) => {
            return {
              borderBottomLeftRadius,

              borderTopLeftRadius:
                borderBottomLeftRadius > 0
                  ? v.tempBorderTopLeftRadius
                  : v.borderTopLeftRadius,

              borderBottomRightRadius:
                borderBottomLeftRadius > 0
                  ? v.tempBorderBottomRightRadius
                  : v.borderBottomRightRadius,

              borderTopRightRadius:
                borderBottomLeftRadius > 0
                  ? v.tempBorderTopRightRadius
                  : v.borderTopRightRadius,

              borderRadius:
                borderBottomLeftRadius === v.borderTopLeftRadius &&
                borderBottomLeftRadius === v.borderTopRightRadius &&
                borderBottomLeftRadius === v.borderBottomRightRadius
                  ? borderBottomLeftRadius
                  : v.borderRadius,

              tempBorderBottomLeftRadius: borderBottomLeftRadius,

              tempBorderRadius:
                sliderDragEnd &&
                borderBottomLeftRadius === v.borderTopLeftRadius &&
                borderBottomLeftRadius === v.borderTopRightRadius &&
                borderBottomLeftRadius === v.borderBottomRightRadius
                  ? borderBottomLeftRadius
                  : v.tempBorderRadius
            };
          }
        }
      ]
    },
    toolbarPaddingFourFieldsPxSuffix({
      v,
      device,
      prefix: "menu",
      state: "normal",
      onChangeGrouped: ["onChangePaddingGrouped"],
      onChangeUngrouped: ["onChangePaddingUngrouped"]
    })
  ];
}

export function getItemsMMenu({ v, device }) {
  return [
    toolbarPaddingFourFieldsPxSuffix({
      v,
      device,
      prefix: "mMenu",
      state: "normal",
      onChangeGrouped: ["onChangePaddingGrouped"],
      onChangeUngrouped: ["onChangePaddingUngrouped"]
    })
  ];
}

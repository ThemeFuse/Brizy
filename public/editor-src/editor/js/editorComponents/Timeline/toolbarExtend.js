import { defaultValueValue } from "visual/utils/onChange";
import { t } from "visual/utils/i18n";

export function getItems({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device });

  const vertical = dvv("verticalMode") === "off";

  const maxBorderRadius = Math.round(
    (v.customSize + v.tempPadding * 2 + v.tempBorderWidth * 2) / 2
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-timeline",
        title: t("Timeline")
      },
      position: 70,
      options: [
        {
          id: "currentShortcodeTabs",
          className: "",
          type: "tabs-dev",
          tabs: [
            {
              id: "currentShortcodeTimeline",
              label: t("Timeline"),
              position: 40,
              options: [
                {
                  id: "verticalMode",
                  label: t("Orientation"),
                  type: "radioGroup-dev",
                  choices: [
                    { value: "on", icon: "nc-vertical-items" },
                    { value: "off", icon: "nc-horizontal-items" }
                  ]
                },
                {
                  id: "timelineStyle",
                  label: t("Style"),
                  type: "radioGroup-dev",
                  choices: [
                    ...(vertical
                      ? [
                          { value: "style-1", icon: "nc-timeline-style-2" },
                          { value: "style-2", icon: "nc-timeline-style-1" },
                          { value: "style-3", icon: "nc-timeline-style-3" }
                        ]
                      : [
                          { value: "style-1", icon: "nc-timeline-style-4" },
                          { value: "style-2", icon: "nc-timeline-style-5" },
                          { value: "style-3", icon: "nc-timeline-style-6" }
                        ])
                  ]
                },
                {
                  id: "enableText",
                  label: t("Titles"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "tabsCount",
                  label: t("Columns"),
                  type: "slider-dev",
                  disabled: v.verticalMode === "on",
                  config: {
                    min: 1,
                    max: 6
                  }
                },
                {
                  id: "spacing",
                  label: t("Spacing"),
                  type: "slider-dev",
                  config: {
                    min: 0,
                    max: 100
                  }
                }
              ]
            },
            {
              id: "currentShortcodeTab",
              label: t("Icon"),
              position: 60,
              options: [
                {
                  id: "iconImage",
                  label: t("Icon"),
                  type: "iconSetter",
                  devices: "desktop",
                  value: {
                    name: v.name,
                    type: v.type
                  },
                  onChange: ({ name, type }) => ({
                    name: name,
                    type: type
                  })
                },
                {
                  id: "groupSize",
                  type: "group-dev",
                  options: [
                    {
                      id: "size",
                      label: t("Size"),
                      type: "radioGroup",
                      choices: [
                        { value: "small", icon: "nc-32" },
                        { value: "medium", icon: "nc-48" },
                        { value: "large", icon: "nc-64" },
                        { value: "custom", icon: "nc-more" }
                      ],
                      value: v.size,
                      onChange: size => {
                        const borderRadius = Math.round(
                          (v.borderRadius /
                            Math.round(
                              v[`${v.size}Size`] +
                                v.padding * 2 +
                                v.iconBorderWidth * 2
                            )) *
                            Math.round(
                              v[`${size}Size`] +
                                v.padding * 2 +
                                v.iconBorderWidth * 2
                            )
                        );

                        return {
                          size,
                          customSize:
                            size !== "custom" ? v[`${size}Size`] : v.customSize,
                          borderRadius:
                            size !== "custom" ? borderRadius : v.borderRadius
                        };
                      }
                    },
                    {
                      id: "customSize",
                      type: "slider",
                      disabled: v.size !== "custom",
                      slider: {
                        min: 14,
                        max: 180
                      },
                      input: {
                        show: true
                      },
                      suffix: {
                        show: true,
                        choices: [{ title: "px", value: "px" }]
                      },
                      value: {
                        value: v.customSize
                      },
                      onChange: ({ value: customSize }) => {
                        const borderRadius = Math.round(
                          (v.borderRadius /
                            Math.round(
                              v.customSize +
                                v.padding * 2 +
                                v.iconBorderWidth * 2
                            )) *
                            Math.round(
                              customSize + v.padding * 2 + v.iconBorderWidth * 2
                            )
                        );

                        return {
                          customSize,
                          borderRadius
                        };
                      }
                    }
                  ]
                }
              ]
            },
            {
              id: "iconBackground",
              label: t("Background"),
              position: 80,
              options: [
                {
                  id: "groupBorderRadius",
                  type: "group-dev",
                  options: [
                    {
                      id: "borderRadiusType",
                      label: t("Corner"),
                      type: "radioGroup",
                      devices: "desktop",
                      choices: [
                        { value: "square", icon: "nc-corners-square" },
                        { value: "rounded", icon: "nc-corners-round" },
                        { value: "custom", icon: "nc-more" }
                      ],
                      value: v.borderRadiusType,
                      onChange: borderRadiusType => {
                        return {
                          borderRadiusType,

                          tempBorderRadiusType:
                            borderRadiusType !== ""
                              ? borderRadiusType
                              : v.tempBorderRadiusType,

                          borderRadius:
                            borderRadiusType === "square"
                              ? v.tempBorderRadius
                              : borderRadiusType === "rounded"
                              ? maxBorderRadius
                              : v.borderRadius,

                          iconBorderWidth:
                            borderRadiusType !== ""
                              ? v.tempBorderWidth
                              : v.iconBorderWidth,

                          padding:
                            borderRadiusType !== "" ? v.tempPadding : v.padding
                        };
                      }
                    },
                    {
                      id: "borderRadius",
                      type: "slider",
                      devices: "desktop",
                      disabled: v.borderRadiusType !== "custom",
                      slider: {
                        min: 0,
                        max: maxBorderRadius
                      },
                      input: {
                        show: true
                      },
                      suffix: {
                        show: true,
                        choices: [{ title: "px", value: "px" }]
                      },
                      value: { value: v.borderRadius },
                      onChange: ({ value: borderRadius }) => ({
                        borderRadius,
                        tempBorderRadius: borderRadius
                      })
                    }
                  ]
                },
                {
                  id: "padding",
                  label: t("Size"),
                  type: "slider",
                  slider: {
                    min: 0,
                    max: 180
                  },
                  input: {
                    show: true
                  },
                  suffix: {
                    show: true,
                    choices: [
                      {
                        title: "px",
                        value: "px"
                      }
                    ]
                  },
                  value: {
                    value: v.iconPadding
                  },
                  onChange: ({ value: iconPadding }) => {
                    return {
                      iconPadding,
                      tempPadding: iconPadding,
                      borderRadius:
                        v.borderRadiusType === "rounded"
                          ? Math.round(
                              (v.customSize +
                                iconPadding * 2 +
                                v.iconBorderWidth * 2) /
                                2
                            )
                          : v.borderRadius,

                      iconBorderWidth:
                        iconPadding > 0 ? v.tempBorderWidth : v.iconBorderWidth,

                      borderRadiusType:
                        iconPadding > 0
                          ? v.tempBorderRadiusType
                          : v.borderRadiusType,

                      borderColorOpacity:
                        iconPadding > 0
                          ? v.tempBorderColorOpacity
                          : v.borderColorOpacity,

                      borderColorPalette:
                        iconPadding > 0
                          ? v.tempBorderColorPalette
                          : v.borderColorPalette
                    };
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors")
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "color",
          type: "tabs-dev",
          tabs: [
            {
              id: "lineBorder",
              label: t("Line"),
              options: [
                {
                  id: "lineBorder",
                  type: "border-dev"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 0,
            max: 1000,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "advancedSettings",
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog",
          devices: "desktop"
        }
      ]
    }
  ];
}

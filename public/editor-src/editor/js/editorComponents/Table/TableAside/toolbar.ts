import { ElementModel } from "visual/component/Elements/Types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { State } from "visual/utils/stateMode";

const getItems =
  (isFirstItem: boolean | undefined, widthType: string, isFromBody: boolean) =>
  ({
    v,
    device,
    state
  }: {
    v: ElementModel;
    device: ResponsiveMode;
    state: State;
  }): ToolbarItemType[] => {
    const dvv = (key: string) => defaultValueValue({ v, key, device, state });

    const isIconSet = dvv("name") === "" && dvv("type") === "";

    const disableIconOptions = (): ToolbarItemType[] => [
      {
        id: "iconPosition",
        type: "radioGroup-dev",
        disabled: true,
        choices: []
      },
      {
        id: "groupIconSize",
        type: "group-dev",
        disabled: true,
        options: []
      },
      {
        id: "iconSpacing",
        type: "slider-dev",
        disabled: true
      }
    ];

    return [
      {
        id: "toolbarCurrentShortcode",
        type: "popover-dev",
        config: {
          icon: "nc-star",
          title: t("Table")
        },
        position: 50,
        options: [
          {
            id: "currentShortcodeTabs",
            className: "",
            type: "tabs-dev",
            tabs: [
              {
                id: "currentShortcodeTab",
                label: t("Icon"),
                position: 60,
                options: [
                  {
                    id: "",
                    label: t("Icon"),
                    type: "iconSetter-dev",
                    devices: "desktop",
                    config: { canDelete: true }
                  },
                  ...(isIconSet ? disableIconOptions() : [])
                ]
              }
            ]
          }
        ]
      },
      //@ts-expect-error Old option doesn't work
      ...(isFirstItem
        ? [
            {
              id: "toolbarSettings",
              type: "popover-dev",
              disabled: true
            },
            {
              id: "advancedSettings",
              type: "advancedSettings",
              sidebarLabel: t("More Settings"),
              roles: ["admin"],
              position: 110,
              icon: "nc-cog",
              devices: "desktop",
              title: t("Settings")
            }
          ]
        : [
            {
              id: "toolbarSettings",
              type: "popover-dev",
              config: {
                icon: "nc-cog",
                title: t("Settings")
              },
              roles: ["admin"],
              position: 110,
              options: [
                {
                  id: "headerWidth",
                  label: t("Width"),
                  type: "slider-dev",
                  position: 100,
                  disabled: widthType === "off" || isFromBody,
                  config: {
                    min: 1,
                    max: 1000,
                    units: [{ value: "px", title: "px" }]
                  }
                },
                !!isFromBody && {
                  id: "widthType",
                  type: "select-dev",
                  disabled: true
                },
                !isFromBody && {
                  id: "asideWidth",
                  type: "slider-dev",
                  disabled: true
                }
              ]
            }
          ])
    ];
  };

export default (
  isFirstItem: boolean,
  widthType: string,
  isFromBody: boolean
) => ({
  getItems: getItems(isFirstItem, widthType, isFromBody)
});

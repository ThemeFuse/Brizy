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
    const headerWidthSuffix = dvv("headerWidthSuffix");

    const disableIconOptions = (): ToolbarItemType[] => [
      {
        id: "iconPosition",
        type: "radioGroup",
        disabled: true,
        choices: []
      },
      {
        id: "groupIconSize",
        type: "group",
        disabled: true,
        options: []
      },
      {
        id: "iconSpacing",
        type: "slider",
        disabled: true
      }
    ];

    return [
      {
        id: "toolbarCurrentShortcode",
        type: "popover",
        config: {
          icon: "nc-star",
          title: t("Table")
        },
        position: 50,
        options: [
          {
            id: "currentShortcodeTabs",
            className: "",
            type: "tabs",
            tabs: [
              {
                id: "currentShortcodeTab",
                label: t("Icon"),
                position: 60,
                options: [
                  {
                    id: "",
                    label: t("Icon"),
                    type: "iconSetter",
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
      ...getExtraToolbarItems(
        widthType,
        isFromBody,
        isFirstItem ?? false,
        headerWidthSuffix
      )
    ];
  };

const getExtraToolbarItems = (
  widthType: string,
  isFromBody: boolean,
  isFirstItem: boolean,
  headerWidthSuffix: string
): ToolbarItemType[] =>
  isFirstItem
    ? [
        {
          id: "toolbarSettings",
          type: "popover",
          disabled: true
        },
        {
          id: "advancedSettings",
          type: "advancedSettings",
          roles: ["admin"],
          position: 110,
          devices: "desktop",
          title: t("Settings")
        }
      ]
    : [
        {
          id: "toolbarSettings",
          type: "popover",
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
              type: "slider",
              position: 100,
              disabled: widthType === "off" || isFromBody,
              config: {
                min: 1,
                max: headerWidthSuffix === "px" ? 1000 : 100,
                units: [
                  { value: "px", title: "px" },
                  { value: "%", title: "%" }
                ]
              }
            },
            isFromBody
              ? {
                  id: "widthType",
                  type: "select",
                  disabled: true,
                  choices: []
                }
              : ({} as ToolbarItemType),
            !isFromBody
              ? {
                  id: "asideWidth",
                  type: "slider",
                  disabled: true
                }
              : ({} as ToolbarItemType)
          ]
        }
      ];

export default (
  isFirstItem: boolean,
  widthType: string,
  isFromBody: boolean
) => ({
  getItems: getItems(isFirstItem, widthType, isFromBody)
});

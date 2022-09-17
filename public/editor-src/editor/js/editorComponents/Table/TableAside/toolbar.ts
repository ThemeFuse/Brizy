import { ElementModel } from "visual/component/Elements/Types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { State } from "visual/utils/stateMode";

export function getItems({
  v,
  device,
  state
}: {
  v: ElementModel;
  device: ResponsiveMode;
  state: State;
}): ToolbarItemType[] {
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
                  id: "iconImage",
                  label: t("Icon"),
                  //@ts-expect-error: Old option
                  type: "iconSetter",
                  devices: "desktop",
                  canDelete: true,
                  value: {
                    name: dvv("name"),
                    type: dvv("type")
                  },
                  onChange: ({
                    name,
                    type
                  }: {
                    name: string;
                    type: string;
                  }) => ({
                    name: name,
                    type: type
                  })
                },
                ...(isIconSet ? disableIconOptions() : [])
              ]
            }
          ]
        }
      ]
    }
  ];
}

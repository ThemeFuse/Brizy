import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { State } from "visual/utils/stateMode";
import { EditorComponentContextValue } from "../EditorComponent/EditorComponentContext";
import { Value } from "./index";

export function getItems({
  v,
  device,
  state,
  context
}: {
  v: Value;
  device: ResponsiveMode;
  state: State;
  context: EditorComponentContextValue;
}): ToolbarItemType[] {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const twitter = dvv("twitter");
  const twitterType = dvv("twitterType");
  const embedTwitterType = twitterType === "embed";

  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText
  });

  const choicesTwitterType =
    twitter === "embed"
      ? [
          {
            title: t("Embed"),
            value: "embed"
          }
        ]
      : [
          {
            title: t("Follow"),
            value: "followButton"
          },
          {
            title: t("Mention"),
            value: "mentionButton"
          }
        ];

  const enableToolbarSettings = (): ToolbarItemType[] => [
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: { icon: "nc-cog", title: t("Settings") },
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: "height",
          label: t("Height"),
          type: "slider-dev",
          config: {
            min: 200,
            max: 700,
            inputMin: 0,
            inputMax: 9999,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "grid",
          type: "grid-dev",
          config: { separator: true },
          columns: [
            {
              id: "grid-settings",
              size: 1,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton-dev",
                  config: {
                    tabId: "styles",
                    text: t("Styling"),
                    icon: "nc-cog"
                  }
                }
              ]
            },
            {
              id: "grid-effects",
              size: 1,
              options: [
                {
                  id: "effects",
                  type: "sidebarTabsButton-dev",
                  config: {
                    tabId: "effects",
                    text: t("Effects"),
                    icon: "nc-flash"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  const disableToolbarSetting = (): ToolbarItemType[] => [
    {
      id: "toolbarSettings",
      type: "popover-dev",
      devices: "all",
      disabled: true
    }
  ];

  const disableAdvancedSettings = (): ToolbarItemType[] => [
    {
      id: "advancedSettings",
      // @ts-expect-error old option
      type: "advancedSettings",
      disabled: true
    }
  ];

  const enableAdvancedSettings = (): ToolbarItemType[] => [
    {
      id: "advancedSettings",
      // @ts-expect-error old option
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      roles: ["admin"],
      position: 110,
      devices: "desktop",
      icon: "nc-cog"
    }
  ];

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-twitter",
        title: t("Twitter")
      },
      devices: "desktop",
      position: 60,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Twitter"),
              options: [
                {
                  id: "twitterUsername",
                  label: t("Username"),
                  type: "inputText-dev",
                  devices: "desktop",
                  placeholder: "username",
                  population: richTextDC
                },
                {
                  id: "twitter",
                  label: t("Twitter"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: [
                    {
                      title: t("Embed"),
                      value: "embed"
                    },
                    {
                      title: t("Button"),
                      value: "button"
                    }
                  ]
                },

                {
                  id: "twitterType",
                  label: t("Type"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: choicesTwitterType,
                  disabled: choicesTwitterType.length <= 1
                },

                {
                  id: "twitterTheme",
                  label: t("Theme"),
                  type: "select-dev",
                  devices: "desktop",
                  disabled: twitter !== "embed",
                  choices: [
                    { title: t("Light"), value: "light" },
                    { title: t("Dark"), value: "dark" }
                  ]
                }
              ]
            },
            {
              id: "tabAdvanced",
              label: t("Advanced"),
              options: [
                {
                  id: "buttonLarge",
                  label: t("Button Size"),
                  type: "radioGroup-dev",
                  disabled:
                    twitterType !== "followButton" &&
                    twitterType !== "mentionButton",
                  position: 10,
                  choices: [
                    { value: "small", icon: "nc-small" },
                    { value: "large", icon: "nc-large" }
                  ]
                },
                {
                  id: "buttonShowCount",
                  label: t("Followers"),
                  type: "switch-dev",
                  disabled: twitterType !== "followButton",
                  devices: "desktop"
                },
                {
                  id: "buttonShowScreenName",
                  label: t("Handle"),
                  type: "switch-dev",
                  disabled: twitterType !== "followButton",
                  devices: "desktop"
                },
                {
                  id: "tweet",
                  label: t("Tweet"),
                  type: "inputText-dev",
                  disabled: twitterType !== "mentionButton",
                  devices: "desktop",
                  placeholder: "this is my tweet"
                }
              ]
            }
          ]
        }
      ]
    },
    ...(embedTwitterType ? enableToolbarSettings() : disableToolbarSetting()),
    ...(embedTwitterType ? disableAdvancedSettings() : enableAdvancedSettings())
  ];
}

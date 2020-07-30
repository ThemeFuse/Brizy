import { t } from "visual/utils/i18n";
import { getDynamicContentChoices } from "visual/utils/options";
import { defaultValueKey } from "visual/utils/onChange";
import {
  toolbarElementTwitter,
  toolbarDisabledToolbarSettings,
  toolbarDisabledAdvancedSettings
} from "visual/utils/toolbar";

export function getItems({ v, device, state }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvkn = key => defaultValueKey({ key, device });

  const choicesTwitterType =
    v.twitter === "embed"
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
  const richTextDC = getDynamicContentChoices("richText", true);

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
                toolbarElementTwitter({
                  v,
                  device,
                  devices: "desktop",
                  state
                }),
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
                  disabled: v.twitterType !== "embed",
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
                    v.twitterType !== "followButton" &&
                    v.twitterType !== "mentionButton",
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
                  disabled: v.twitterType !== "followButton",
                  devices: "desktop"
                },
                {
                  id: "buttonShowScreenName",
                  label: t("Handle"),
                  type: "switch-dev",
                  disabled: v.twitterType !== "followButton",
                  devices: "desktop"
                },
                {
                  id: "tweet",
                  label: t("Tweet"),
                  type: "inputText-dev",
                  disabled: v.twitterType !== "mentionButton",
                  devices: "desktop",
                  placeholder: "this is my tweet"
                }
              ]
            }
          ]
        }
      ]
    },

    v.twitterType === "embed"
      ? {
          id: "toolbarSettings",
          type: "popover-dev",
          config: {
            icon: "nc-cog",
            title: t("Settings")
          },
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
              id: dvk("advancedSettings"),
              type: "advancedSettings",
              label: t("More Settings"),
              icon: "nc-cog"
            }
          ]
        }
      : toolbarDisabledToolbarSettings({ device }),
    v.twitterType === "embed"
      ? toolbarDisabledAdvancedSettings({ device })
      : {
          id: dvkn("advancedSettings"),
          type: "advancedSettings",
          sidebarLabel: t("More Settings"),
          roles: ["admin"],
          position: 110,
          icon: "nc-cog"
        }
  ];
}

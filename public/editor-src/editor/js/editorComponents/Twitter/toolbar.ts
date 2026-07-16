import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { State } from "visual/utils/stateMode";
import { EditorComponentContextValue } from "../EditorComponent/EditorComponentContext";
import { Value } from "./types";

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

  const twitterType = dvv("twitterType");

  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText
  });

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "nc-twitter",
        title: t("Twitter")
      },
      devices: "desktop",
      position: 60,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Twitter"),
              options: [
                {
                  id: "twitterUsername",
                  label: t("Username"),
                  type: "inputText",
                  devices: "desktop",
                  placeholder: t("username"),
                  population: richTextDC
                },
                {
                  id: "twitterType",
                  label: t("Type"),
                  type: "select",
                  devices: "desktop",
                  choices: [
                    {
                      title: t("Follow"),
                      value: "followButton"
                    },
                    {
                      title: t("Mention"),
                      value: "mentionButton"
                    }
                  ]
                },
              ]
            },
            {
              id: "tabAdvanced",
              label: t("Advanced"),
              options: [
                {
                  id: "buttonLarge",
                  label: t("Button Size"),
                  type: "radioGroup",
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
                  type: "switch",
                  disabled: twitterType !== "followButton",
                  devices: "desktop"
                },
                {
                  id: "buttonShowScreenName",
                  label: t("Handle"),
                  type: "switch",
                  disabled: twitterType !== "followButton",
                  devices: "desktop"
                },
                {
                  id: "tweet",
                  label: t("Tweet"),
                  type: "inputText",
                  disabled: twitterType !== "mentionButton",
                  devices: "desktop",
                  placeholder: t("this is my tweet")
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      devices: "all",
      disabled: true
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      roles: ["admin"],
      position: 110,
      devices: "desktop"
    }
  ];
}

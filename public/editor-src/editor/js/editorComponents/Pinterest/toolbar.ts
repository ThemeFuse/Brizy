import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { buttonSizeCss, contentAlignCss } from "./css";
import { AddonType, Value } from "./types";

export const getItems: GetItems<Value> = ({ v }) => {
  const { addonType } = v;

  const isFollowButton = addonType === AddonType.FollowButton;

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "nc-pinterest",
        title: t("Pinterest")
      },
      position: 10,
      devices: "desktop",
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Pinterest"),
              options: [
                {
                  id: "addonType",
                  type: "select",
                  label: t("Display"),
                  choices: [
                    {
                      title: t("Follow Button"),
                      value: AddonType.FollowButton
                    },
                    {
                      title: t("Pin Widget"),
                      value: AddonType.PinWidget
                    },
                    {
                      title: t("Board Widget"),
                      value: AddonType.BoardWidget
                    },
                    {
                      title: t("Profile Widget"),
                      value: AddonType.ProfileWidget
                    }
                  ]
                },
                {
                  id: "url",
                  type: "inputText",
                  label: t("URL"),
                  placeholder: t("Pinterest URL (profile, board or pin)"),
                  helper: {
                    content: t(
                      "Paste your Pinterest profile, board or pin URL depending on the add-on type."
                    )
                  }
                }
              ]
            },
            {
              id: "tabAdvanced",
              label: t("Advanced"),
              options: [
                {
                  id: "buttonSize",
                  label: t("Button Size"),
                  type: "radioGroup",
                  disabled: !isFollowButton,
                  position: 10,
                  style: buttonSizeCss,
                  choices: [
                    { value: "small", icon: "nc-small" },
                    { value: "medium", icon: "nc-medium" },
                    { value: "large", icon: "nc-large" }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle",
      disabled: true,
      choices: []
    },
    {
      id: "contentHorizontalAlign",
      type: "toggle",
      position: 100,
      style: contentAlignCss,
      choices: [
        {
          icon: "nc-text-align-left",
          title: t("Align"),
          value: "left"
        },
        {
          icon: "nc-text-align-center",
          title: t("Align"),
          value: "center"
        },
        {
          icon: "nc-text-align-right",
          title: t("Align"),
          value: "right"
        }
      ]
    }
  ];
};

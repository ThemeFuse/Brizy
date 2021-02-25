import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { toolbarLinkAnchor, toolbarLinkExternal } from "visual/utils/toolbar";
import { IS_GLOBAL_POPUP } from "visual/utils/models";

export function getItems({ v, device, component }) {
  const dvk = key => defaultValueKey({ v, key, device });
  const dvv = key => defaultValueValue({ v, key, device });
  const inPopup = Boolean(component.props.meta.sectionPopup);
  const inPopup2 = Boolean(component.props.meta.sectionPopup2);

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-lottie",
        title: t("Lottie")
      },
      devices: "desktop",
      position: 70,
      options: [
        {
          id: "animationLink",
          label: t("Lottie Link"),
          type: "inputText-dev",
          devices: "desktop",
          placeholder: "lottie link",
          disabled: dvv("animationFile") !== "",
          config: {
            size: "medium"
          },
          helper: {
            content: t(
              "This is Lottie .json URL. Get more from LottieFiles.com."
            )
          }
        },
        {
          id: dvk("animationFile"),
          label: t("Lottie File"),
          type: "fileUpload",
          acceptedExtensions: [".json"],
          devices: "desktop",
          value: dvv("animationFile")
        },
        {
          id: "autoplay",
          label: t("Auto play"),
          type: "switch-dev"
        },
        {
          id: "direction",
          label: t("Reverse"),
          type: "switch-dev",
          disabled: v.autoplay === "off",
          config: {
            on: "-1",
            off: "1"
          }
        },
        {
          id: "loop",
          label: t("Loop"),
          type: "switch-dev",
          disabled: v.autoplay === "off"
        },
        {
          id: "speed",
          type: "slider-dev",
          label: t("Speed"),
          devices: "desktop",
          config: {
            min: 0.1,
            max: 5,
            step: 0.1
          }
        }
      ]
    },
    {
      id: "toolbarLink",
      type: "popover-dev",
      config: {
        icon: "nc-link",
        size: "medium",
        title: t("Link")
      },
      position: 90,
      disabled: device === "dekstop",
      options: [
        {
          id: "linkType",
          type: "tabs-dev",
          config: {
            saveTab: true
          },
          tabs: [
            {
              id: "external",
              label: t("URL"),
              options: [
                toolbarLinkExternal({ v }),
                {
                  id: "linkExternalBlank",
                  label: t("Open In New Tab"),
                  type: "switch-dev"
                },
                {
                  id: "linkExternalRel",
                  label: t("Make it Nofollow"),
                  type: "switch-dev"
                }
              ]
            },
            {
              id: "anchor",
              label: t("Block"),
              options: [toolbarLinkAnchor({ v, disabled: IS_GLOBAL_POPUP })]
            },
            {
              id: "popup",
              label: t("Popup"),
              options: [
                {
                  id: "linkPopup",
                  type: "promptAddPopup",
                  disabled: inPopup || inPopup2 || IS_GLOBAL_POPUP,
                  label: t("Popup"),
                  popupKey: `${component.getId()}_${v.linkPopup}`,
                  value: {
                    value: v.linkPopup,
                    popups: v.popups
                  },
                  onChange: ({ value, popups }) => ({
                    linkPopup: value,
                    popups
                  })
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
        icon: "nc-cog"
      },
      title: t("Settings"),
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 1,
            max: dvv("widthSuffix") === "px" ? 1000 : 100,
            units: [
              { value: "px", title: "px" },
              { value: "%", title: "%" }
            ]
          }
        },
        {
          id: "advancedSettings",
          type: "advancedSettings",
          devices: "desktop",
          label: t("More Settings"),
          icon: "nc-cog"
        }
      ]
    }
  ];
}

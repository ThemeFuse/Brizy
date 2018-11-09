import { t } from "visual/utils/i18n";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

export function getItemsForDesktop(v) {
  return [
    {
      id: "toolbarSoundCloud",
      type: "popover",
      icon: "nc-sound-cloud",
      title: t("SoundCloud"),
      position: 90,
      options: [
        {
          id: "url",
          label: t("Link"),
          type: "input",
          placeholder: t("SoundCloud Link"),
          value: {
            value: v.url
          },
          onChange: ({ value: url }) => ({
            url
          })
        },
        {
          id: "autoPlay",
          label: t("Auto Play"),
          type: "switch",
          value: v.autoPlay
        },
        {
          type: "multiPicker",
          roles: ["admin"],
          picker: {
            id: "style",
            label: t("Style"),
            type: "radioGroup",
            choices: [
              {
                value: "basic",
                icon: "nc-sndcloud-style-1"
              },
              {
                value: "artwork",
                icon: "nc-sndcloud-style-2"
              }
            ],
            value: v.style,
            onChange: style => ({
              style,
              showArtwork: style === "basic" ? "off" : "on",
              height:
                style === "basic"
                  ? v.mediumHeight
                  : style === "artwork"
                    ? v.largeHeight
                    : v.height
            })
          }
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider",
          slider: {
            min: 1,
            max: 100
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: v.width
          },
          onChange: ({ value: width }) => ({ width })
        },
        {
          id: "height",
          label: t("Height"),
          type: "slider",
          slider: {
            min: v.smallHeight,
            max: v.showArtwork === "on" ? v.largeHeight : v.mediumHeight
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
            value: v.height
          },
          onChange: ({ value: height }) => ({ height })
        }
      ]
    }
  ];
}

export function getItemsForTablet(v) {
  return [
    {
      id: "tabletToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "tabletWidth",
          label: t("Width"),
          type: "slider",
          slider: {
            min: 1,
            max: 100
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: tabletSyncOnChange(v, "width")
          },
          onChange: ({ value: tabletWidth }) => ({ tabletWidth })
        },
        {
          id: "tabletHeight",
          label: t("Height"),
          type: "slider",
          slider: {
            min: v.smallHeight,
            max: v.showArtwork === "on" ? v.largeHeight : v.mediumHeight
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
            value: tabletSyncOnChange(v, "height")
          },
          onChange: ({ value: tabletHeight }) => ({ tabletHeight })
        }
      ]
    }
  ];
}

export function getItemsForMobile(v) {
  return [
    {
      id: "mobileToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "mobileWidth",
          label: t("Width"),
          type: "slider",
          slider: {
            min: 1,
            max: 100
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: mobileSyncOnChange(v, "width")
          },
          onChange: ({ value: mobileWidth }) => ({ mobileWidth })
        },
        {
          id: "mobileHeight",
          label: t("Height"),
          type: "slider",
          slider: {
            min: v.smallHeight,
            max: v.showArtwork === "on" ? v.largeHeight : v.mediumHeight
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
            value: mobileSyncOnChange(v, "height")
          },
          onChange: ({ value: mobileHeight }) => ({ mobileHeight })
        }
      ]
    }
  ];
}

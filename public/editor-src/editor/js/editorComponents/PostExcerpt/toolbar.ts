import { Component } from "react";
import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";
import {
  toolbarLinkAnchor,
  toolbarLinkExternal,
  toolbarLinkPopup
} from "visual/utils/toolbar";
import { IS_GLOBAL_POPUP } from "visual/utils/models";
import { NORMAL, HOVER } from "visual/utils/stateMode";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { ToolbarItemType } from "../ToolbarItemType";
import { ElementModel } from "visual/component/Elements/Types";

export function getItems({
  v,
  device,
  component
}: {
  v: ElementModel;
  device: ResponsiveMode;
  component: Component;
}): ToolbarItemType[] {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state: "normal" });

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );
  //@ts-expect-error meta doesnt exist
  const inPopup = Boolean(component.props.meta.sectionPopup);
  //@ts-expect-error meta doesnt exist
  const inPopup2 = Boolean(component.props.meta.sectionPopup2);

  return [
    {
      id: "posts",
      type: "popover-dev",
      config: {
        icon: "nc-wp-post-excerpt",
        size: "auto",
        title: t("Context")
      },
      position: 70,
      disabled: v.type === "wp",
      options: [
        {
          id: "sourceType",
          type: "select-dev",
          label: t("Context Type"),
          devices: "desktop",
          placeholder: "Options",
          choices: [
            { value: "auto", title: "Auto" },
            { value: "profile", title: "Profile" }
          ]
        }
      ]
    },
    {
      id: "popoverTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "",
          type: "typography-dev",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(colorHex, dvv("colorOpacity"))
          }
        }
      },
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
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
      options: [
        {
          id: "linkType",
          type: "tabs-dev",
          config: {
            saveTab: true,
            showSingle: true
          },
          tabs: [
            {
              id: "external",
              label: t("URL"),
              options: [
                // @ts-expect-error: need to transform to new option
                toolbarLinkExternal({
                  v,
                  config: component.context.dynamicContent.config,
                  devices: "desktop"
                }),
                {
                  id: "linkExternalBlank",
                  label: t("Open In New Tab"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "linkExternalRel",
                  label: t("Make it Nofollow"),
                  type: "switch-dev",
                  devices: "desktop"
                }
              ]
            },
            {
              id: "anchor",
              label: t("Block"),
              options: [
                // @ts-expect-error: need to transform to new option
                toolbarLinkAnchor({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal",
                  disabled: IS_GLOBAL_POPUP
                })
              ]
            },
            {
              id: "popup",
              label: t("Popup"),
              options: [
                // @ts-expect-error: need to transform to new option
                toolbarLinkPopup({
                  v,
                  device,
                  component,
                  state: "normal",
                  canDelete: device === "desktop",
                  disabled:
                    device === "desktop"
                      ? inPopup || inPopup2 || IS_GLOBAL_POPUP
                      : dvv("linkType") !== "popup" || dvv("linkPopup") === ""
                })
              ]
            }
          ]
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      choices: [],
      disabled: true
    },
    {
      id: "contentHorizontalAlign",
      type: "toggle-dev",
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" },
        { icon: "nc-text-align-justify", title: t("Align"), value: "justify" }
      ]
    },
    {
      id: "advancedSettings",
      // @ts-expect-error: need to transform to new option
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      position: 110,
      title: t("Settings"),
      roles: ["admin"],
      devices: "desktop",
      icon: "nc-cog"
    }
  ];
}

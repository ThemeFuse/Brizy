import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { ToolbarItemType } from "../../ToolbarItemType";
import { Value } from "./index";

export function getItems({
  v,
  device
}: {
  v: Value;
  device: ResponsiveMode;
}): ToolbarItemType[] {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, state: "normal", device });

  const badgeType = dvv("badgeType");
  const starColorOpacity = dvv("starColorOpacity") as number;
  const starColorHex = dvv("starColorHex");
  const titleColorHex = dvv("titleColorHex");
  const titleColorOpacity = dvv("titleColorOpacity") as number;

  return [
    {
      id: "toolbarStampedBadges",
      type: "popover-dev",
      position: 10,
      devices: "desktop",
      config: {
        icon: "nc-shopify-logo",
        title: t("Badges")
      },
      options: [
        {
          id: "badgeType",
          type: "select-dev",
          label: t("Badge Type"),
          choices: [
            { title: "Standard", value: "standard" },
            { title: "Minimal", value: "minimal" }
          ]
        },
        {
          id: "feedHeight",
          type: "slider-dev",
          label: t("Height"),
          disabled: badgeType !== "standard",
          config: {
            min: 100,
            max: 1000,
            step: 1,
            units: [{ title: "px", value: "px" }]
          }
        },
        {
          id: "headerTitle",
          label: t("Text"),
          type: "inputText-dev",
          placeholder: t("Insert Text...")
        },
        {
          id: "sizeGroup",
          type: "group-dev",
          label: t("Size"),
          options: [
            {
              id: "textSize",
              type: "slider-dev",
              label: t("Text"),
              config: {
                min: 10,
                max: 100,
                step: 1,
                units: [{ title: "px", value: "px" }]
              }
            },
            {
              id: "starSize",
              type: "slider-dev",
              label: t("Star"),
              disabled: badgeType === "standard",
              config: {
                min: 10,
                max: 100,
                step: 1,
                units: [{ title: "px", value: "px" }]
              }
            }
          ]
        },
        {
          id: "reviewIDs",
          label: t("Review IDs"),
          type: "inputText-dev",
          placeholder: t("Insert IDs..."),
          helper: { content: t("Filter by multiple review IDs") }
        },
        {
          id: "productIDs",
          label: t("Product IDs"),
          type: "inputText-dev",
          placeholder: t("Insert IDs..."),
          helper: { content: t("Filter by multiple product IDs") }
        },
        {
          id: "productType",
          label: t("Product Type"),
          type: "inputText-dev",
          placeholder: t("Insert Type..."),
          helper: { content: t("Filter by product category") }
        },
        {
          id: "productVendor",
          label: t("Product Vendor"),
          type: "inputText-dev",
          placeholder: t("Insert Vendor..."),
          helper: { content: t("Filter by product vendor") }
        },
        {
          id: "feedTags",
          label: t("Feed Tags"),
          type: "inputText-dev",
          placeholder: t("Insert Types..."),
          helper: { content: t("Filter by reviews tags") }
        },
        {
          id: "limitWords",
          type: "slider-dev",
          label: t("Limit Words"),
          helper: {
            content: t("Limit the max number of words for review body")
          },
          config: {
            min: 1,
            max: 100000,
            step: 1
          }
        },
        {
          id: "minimumRating",
          type: "select-dev",
          label: t("Minimum Rating"),
          helper: {
            content: t("Show only reviews above the selected minimum rating")
          },
          choices: [
            { title: "1 star", value: "1" },
            { title: "2 stars", value: "2" },
            { title: "3 stars", value: "3" },
            { title: "4 stars", value: "4" },
            { title: "5 stars", value: "5" }
          ]
        },
        {
          id: "fillEmpty",
          type: "switch-dev",
          label: t("Fill Empty"),
          helper: {
            content: t(
              "If filtered results is empty, fill widget with other reviews"
            )
          }
        },
        {
          id: "randomizer",
          type: "switch-dev",
          label: t("Random"),
          helper: {
            content: t("Randomize the reviews results")
          }
        }
      ]
    },
    {
      id: "popoverColor",
      type: "popover-dev",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor:
              starColorOpacity > 0
                ? hexToRgba(starColorHex, starColorOpacity)
                : hexToRgba(titleColorHex, titleColorOpacity)
          }
        }
      },
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
                  id: "textColor",
                  type: "colorPicker-dev"
                }
              ]
            },
            {
              id: "tabStar",
              label: t("Star"),
              options: [
                {
                  id: "starColor",
                  type: "colorPicker-dev"
                }
              ]
            },
            {
              id: "tabRibbon",
              label: t("Ribbon"),
              options: [
                {
                  id: "ribbonColor",
                  type: "colorPicker-dev",
                  disabled: badgeType !== "standard"
                }
              ]
            },
            {
              id: "tabBadgeInner",
              label: t("Badge Inner"),
              options: [
                {
                  id: "ribbonInnerColor",
                  type: "colorPicker-dev",
                  disabled: badgeType !== "standard"
                }
              ]
            },
            {
              id: "tabBadgeOutter",
              label: t("Badge Outter"),
              options: [
                {
                  id: "ribbonOuterColor",
                  type: "colorPicker-dev",
                  disabled: badgeType !== "standard"
                }
              ]
            }
          ]
        }
      ]
    },
    { id: "horizontalAlign", type: "toggle-dev", disabled: true, choices: [] },
    {
      id: "advancedSettings",
      // @ts-expect-error: Old option
      type: "advancedSettings",
      devices: "desktop",
      sidebarLabel: t("More Settings"),
      position: 110,
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
}

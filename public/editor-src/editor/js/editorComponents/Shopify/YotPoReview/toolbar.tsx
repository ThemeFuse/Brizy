import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { Value } from "./index";

export function getItems({ v }: { v: Value }): ToolbarItemType[] {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, state: "normal" });
  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );
  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );

  const bgColorOpacity = dvv("bgColorOpacity") as number;
  const reviewType = dvv("reviewType");
  const autoPlay = dvv("autoPlay");
  const headerCustomisation = dvv("headerCustomisation");
  const colorOpacity = dvv("colorOpacity");
  const bgColorSwitch = dvv("bgColorSwitch");

  return [
    {
      id: "toolbarYotPoReview",
      type: "popover",
      position: 10,
      devices: "desktop",
      config: {
        icon: "nc-shopify-logo",
        title: t("Reviews")
      },
      options: [
        {
          id: "reviewType",
          type: "select",
          label: t("Reviews Type"),
          config: {
            size: "large"
          },
          choices: [
            { title: "Main Widget", value: "yotpo-main-widget" },
            { title: "Q & A", value: "brz yotpo-main-widget" },
            { title: "Star Rating", value: "bottomLine" },
            { title: "Highlight", value: "yotpo-shoppers-say" },
            { title: "Carousel", value: "yotpo-reviews-carousel" },
            { title: "Badge", value: "yotpo-badge" }
          ]
        },
        {
          id: "appKey",
          label: t("Application Key"),
          type: "inputText",
          disabled: reviewType !== "bottomLine",
          placeholder: t("Insert AppKey"),
          helper: {
            content: t(
              "Find your AppKey in www.yotpo.com -> Settings -> General Settings"
            )
          }
        },
        {
          id: "reviewLogic",
          type: "select",
          label: t("Review Logic"),
          disabled: reviewType !== "yotpo-reviews-carousel",
          choices: [
            { title: "Top Rated", value: "top_rated" },
            { title: "Most Recent", value: "most_recent" }
          ]
        },
        {
          id: "showReviews",
          type: "select",
          label: t("Show"),
          disabled: reviewType !== "yotpo-reviews-carousel",
          choices: [
            { title: "Site Reviews", value: "site" },
            { title: "Site & Products Reviews", value: "both" },
            { title: "P.R - All Products", value: "product" },
            { title: "P.R - Product Page", value: "per_product" }
          ]
        },
        {
          id: "reviewsNumber",
          type: "slider",
          label: t("Number of Reviews"),
          disabled: reviewType !== "yotpo-reviews-carousel",
          config: {
            min: 1,
            max: 9,
            step: 1
          }
        },
        {
          id: "showTotalReviewsCount",
          type: "switch",
          label: t("Show Total Reviews"),
          helper: {
            content: t("Show Total Reviews Count And Average Ratings")
          },
          disabled: reviewType !== "yotpo-reviews-carousel"
        },
        {
          id: "groupSettings",
          type: "group",
          disabled: reviewType !== "yotpo-reviews-carousel",
          options: [
            {
              id: "autoPlay",
              type: "switch",
              label: t("Autoplay")
            },
            {
              id: "autoplaySpeed",
              type: "slider",
              label: t("Speed"),
              disabled: autoPlay === "off",
              config: {
                min: 500,
                max: 20000,
                step: 500
              }
            }
          ]
        },
        {
          id: "showNavigation",
          type: "switch",
          label: t("Show Navigation"),
          disabled: reviewType !== "yotpo-reviews-carousel"
        },
        {
          id: "bgColorSwitch",
          type: "switch",
          label: t("Enable Background Color"),
          disabled: reviewType !== "yotpo-reviews-carousel"
        },
        {
          id: "headerCustomisation",
          type: "switch",
          label: t("Header Customisation"),
          disabled: reviewType !== "yotpo-reviews-carousel"
        },
        {
          id: "headerText",
          type: "inputText",
          label: t("Text"),
          disabled:
            reviewType !== "yotpo-reviews-carousel" ||
            headerCustomisation === "off",
          placeholder: t("Enter text here...")
        },
        {
          id: "fontSize",
          type: "slider",
          label: t("Font Size"),
          disabled:
            reviewType !== "yotpo-reviews-carousel" ||
            headerCustomisation === "off",
          config: {
            min: 1,
            max: 40,
            step: 1,
            units: [{ title: "px", value: "px" }]
          }
        },
        {
          id: "textAlign",
          type: "select",
          label: t("Align Text"),
          disabled:
            reviewType !== "yotpo-reviews-carousel" ||
            headerCustomisation === "off",
          choices: [
            { title: "Left", value: "left" },
            { title: "Center", value: "center" }
          ]
        }
      ]
    },
    {
      id: "popoverColor",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor:
              bgColorOpacity > 0
                ? hexToRgba(bgColorHex, bgColorOpacity)
                : hexToRgba(colorHex, colorOpacity)
          }
        }
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabBackground",
              label: t("Background"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker",
                  disabled:
                    reviewType !== "yotpo-reviews-carousel" ||
                    bgColorSwitch === "off"
                }
              ]
            },
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "color",
                  type: "colorPicker",
                  disabled:
                    headerCustomisation === "off" ||
                    reviewType !== "yotpo-reviews-carousel"
                }
              ]
            }
          ]
        }
      ]
    },
    { id: "horizontalAlign", type: "toggle", disabled: true, choices: [] },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      devices: "desktop",
      position: 110,
      title: t("Settings")
    }
  ];
}

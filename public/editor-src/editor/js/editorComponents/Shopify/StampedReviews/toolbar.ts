import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
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
    defaultValueValue({ v, key, device, state: "normal" });

  const { hex: starColorHex } = getOptionColorHexByPalette(
    dvv("starColorHex"),
    dvv("starColorPalette")
  );
  const { hex: titleColorHex } = getOptionColorHexByPalette(
    dvv("titleColorHex"),
    dvv("titleColorPalette")
  );

  const starColorOpacity = dvv("starColorOpacity") as number;
  const reviewType = dvv("reviewType");
  const titleColorOpacity = dvv("titleColorOpacity");
  const feedType = dvv("feedType");

  const IS_SIMPLE = reviewType === "standard" || reviewType === "starRating";

  const IS_STRICT_CAROUSEL =
    reviewType === "standard" ||
    reviewType === "starRating" ||
    reviewType === "wallPhotos" ||
    reviewType === "fullPage" ||
    reviewType === "topRated" ||
    (reviewType === "visualGallery" && feedType !== "carousel");

  return [
    {
      id: "toolbarStampedReview",
      type: "popover-dev",
      position: 10,
      devices: "desktop",
      config: {
        icon: "nc-shopify-logo",
        title: t("Reviews")
      },
      options: [
        {
          id: "reviewType",
          type: "select-dev",
          label: t("Reviews Type"),
          choices: [
            { title: "Main Widget", value: "standard" },
            { title: "Carousel", value: "carousel" },
            { title: "Full Page", value: "fullPage" },
            { title: "Top Rated", value: "topRated" },
            { title: "Star Rating", value: "starRating" },
            { title: "Visual Gallery", value: "visualGallery" },
            { title: "Wall Photos", value: "wallPhotos" }
          ]
        },
        {
          id: "feedType",
          type: "select-dev",
          label: t("Feed Type"),
          placeholder: t("Feed Type"),
          disabled: reviewType !== "visualGallery",
          choices: [
            { title: "Carousel", value: "carousel" },
            { title: "Gallery", value: "feed" }
          ]
        },
        {
          id: "feedHeight",
          type: "slider-dev",
          label: t("Height"),
          disabled: reviewType !== "visualGallery" || feedType !== "carousel",
          config: {
            min: 100,
            max: 1000,
            step: 1,
            units: [{ title: "px", value: "px" }]
          }
        },
        {
          id: "hoverOpacity",
          type: "slider-dev",
          label: t("Hover Opacity"),
          disabled:
            reviewType !== "visualGallery" && reviewType !== "wallPhotos",
          config: {
            min: 1,
            max: 100,
            step: 1
          }
        },
        {
          id: "carouselTitle",
          label: t("Title"),
          type: "inputText-dev",
          disabled: reviewType !== "carousel",
          placeholder: t("Insert Title...")
        },
        {
          id: "labelSubtitle",
          label: t("Label Subtitle"),
          type: "inputText-dev",
          disabled: reviewType !== "fullPage",
          placeholder: t("Based on Reviews")
        },
        {
          id: "productImage",
          type: "switch-dev",
          label: t("Show Product Image"),
          disabled: reviewType !== "fullPage"
        },
        {
          id: "groupOptions",
          type: "group-dev",
          disabled: IS_STRICT_CAROUSEL,
          options: [
            {
              id: "autoSlide",
              type: "switch-dev",
              label: t("Auto Slide")
            },
            {
              id: "autoPlaySpeed",
              type: "slider-dev",
              label: t("Interval"),
              config: {
                min: 300,
                max: 5000,
                step: 1
              }
            }
          ]
        },
        {
          id: "reviewIDs",
          label: t("Review IDs"),
          type: "inputText-dev",
          disabled: IS_SIMPLE,
          placeholder: t("Insert IDs..."),
          helper: { content: t("Filter by multiple review IDs") }
        },
        {
          id: "productIDs",
          label: t("Product IDs"),
          type: "inputText-dev",
          disabled: reviewType === "standard",
          placeholder: t("Insert IDs..."),
          helper: { content: t("Filter by multiple product IDs") }
        },
        {
          id: "productType",
          label: t("Product Type"),
          type: "inputText-dev",
          disabled: IS_SIMPLE,
          placeholder: t("Insert Type..."),
          helper: { content: t("Filter by product category") }
        },
        {
          id: "productVendor",
          label: t("Product Vendor"),
          type: "inputText-dev",
          disabled: IS_SIMPLE,
          placeholder: t("Insert Vendor..."),
          helper: { content: t("Filter by product vendor") }
        },
        {
          id: "feedTags",
          label: t("Feed Tags"),
          type: "inputText-dev",
          disabled: IS_SIMPLE,
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
          disabled: IS_SIMPLE,
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
          disabled: IS_SIMPLE,
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
          disabled: IS_SIMPLE,
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
          },
          disabled: IS_SIMPLE
        }
      ]
    },
    {
      id: "popoverColor",
      type: "popover-dev",
      disabled: IS_SIMPLE,
      config: {
        size: "auto",
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
              id: "tabTitle",
              label: t("Title"),
              options: [
                {
                  id: "titleColor",
                  type: "colorPicker-dev",
                  disabled: reviewType !== "carousel"
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
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "textColor",
                  type: "colorPicker-dev",
                  disabled:
                    reviewType === "visualGallery" ||
                    reviewType === "wallPhotos" ||
                    reviewType === "topRated"
                }
              ]
            },
            {
              id: "tabLink",
              label: t("Link"),
              options: [
                {
                  id: "linkColor",
                  type: "colorPicker-dev",
                  disabled:
                    reviewType === "visualGallery" ||
                    reviewType === "wallPhotos"
                }
              ]
            },
            {
              id: "tabVerified",
              label: t("Verified"),
              options: [
                {
                  id: "verifiedColor",
                  type: "colorPicker-dev",
                  disabled: reviewType !== "fullPage"
                }
              ]
            },
            {
              id: "tabHover",
              label: t("Hover"),
              options: [
                {
                  id: "hoverColor",
                  type: "colorPicker-dev",
                  disabled:
                    reviewType !== "visualGallery" &&
                    reviewType !== "wallPhotos"
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

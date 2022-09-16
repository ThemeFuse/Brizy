import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { Value } from "./index";

export const getItems = ({ v }: { v: Value }): ToolbarItemType[] => {
  const dvv = (key: string) =>
    defaultValueValue({ v, key, device: "desktop", state: "normal" });

  const reviewType = dvv("reviewType");
  const showHeader = dvv("showHeader");
  return [
    {
      id: "toolbarOkendoReview",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Reviews"),
        icon: "nc-shopify-logo"
      },
      devices: "desktop",
      position: 10,
      options: [
        {
          id: "reviewType",
          label: t("Review Type"),
          type: "select-dev",
          choices: [
            { title: "Stars", value: "star" },
            { title: "Widget", value: "widget" },
            { title: "Carousel", value: "reviewCarousel" },
            { title: "Media Carousel", value: "mediaCarousel" },
            { title: "Media Grid", value: "mediaGrid" },
            { title: "Badge", value: "badge" }
          ]
        },
        {
          id: "includeQA",
          label: t("Include Q & A"),
          type: "switch-dev",
          disabled: reviewType !== "widget",
          helper: { content: t("Works if PRO Plan") }
        },
        {
          id: "showHeader",
          label: t("Show Heading"),
          type: "switch-dev",
          disabled: reviewType !== "reviewCarousel"
        },
        {
          id: "headingText",
          label: t("Heading Text"),
          config: { size: "medium" },
          type: "inputText-dev",
          disabled: reviewType !== "reviewCarousel" || showHeader !== "on"
        },
        {
          id: "autoPlay",
          label: "Autoplay",
          type: "switch-dev",
          disabled: reviewType !== "mediaCarousel"
        },
        {
          id: "arrowPosition",
          label: t("Arrow Position"),
          type: "toggle-dev",
          disabled: reviewType !== "mediaCarousel",
          choices: [
            { title: t("Inside"), icon: "nc-position-in", value: "inside" },
            { title: t("Outside"), icon: "nc-position-out", value: "outside" }
          ]
        },
        {
          id: "imageLinkText",
          label: t("Image Link Text"),
          type: "inputText-dev",
          config: { size: "medium" },
          disabled: reviewType !== "mediaCarousel",
          placeholder: t("Enter text here...")
        },
        {
          id: "slideSize",
          label: t("Slide Size"),
          type: "select-dev",
          disabled: reviewType !== "mediaCarousel",
          choices: [
            { title: t("Extra Small"), value: "x-small" },
            { title: t("Small"), value: "small" },
            { title: t("Medium"), value: "medium" },
            { title: t("Large"), value: "large" },
            { title: t("Extra Large"), value: "x-large" }
          ]
        },
        {
          id: "linkText",
          label: t("Link Text"),
          type: "inputText-dev",
          config: { size: "medium" },
          disabled: reviewType !== "mediaGrid",
          placeholder: t("Enter text here...")
        },
        {
          id: "gapSize",
          label: t("Gap Size"),
          type: "slider-dev",
          disabled: reviewType !== "mediaGrid",
          config: {
            min: 0,
            max: 200,
            step: 1,
            units: [{ title: "px", value: "px" }]
          }
        },
        {
          id: "hideLoadMoreArrow",
          label: t("Hide Load More Arrow"),
          type: "switch-dev",
          disabled: reviewType !== "mediaGrid"
        },
        {
          id: "loadMoreOnScoll",
          label: t("Load More On Scroll"),
          type: "switch-dev",
          disabled: reviewType !== "mediaGrid"
        },
        {
          id: "desktopGridStyle",
          label: t("Desktop Grid Style"),
          type: "select-dev",
          disabled: reviewType !== "mediaGrid",
          choices: [
            { title: t("Default"), value: "default" },
            { title: t("Large Centered"), value: "large-centred" },
            { title: t("Extra Large"), value: "x-large" },
            { title: t("Two Heroes"), value: "two-heroes" }
          ]
        },
        {
          id: "mobileGridStyle",
          label: t("Mobile Grid Style"),
          type: "select-dev",
          disabled: reviewType !== "mediaGrid",
          choices: [
            { title: t("Default"), value: "default-mobile" },
            { title: t("Alternate Mobile"), value: "alternate-mobile" },
            { title: t("Extra Large"), value: "hero-three-mobile" }
          ]
        },
        {
          id: "badgePosition",
          label: t("Badge Position"),
          type: "radioGroup-dev",
          disabled: reviewType !== "badge",
          choices: [
            { value: "left", icon: "nc-align-left" },
            { value: "center", icon: "nc-align-middle" },
            { value: "right", icon: "nc-align-right" }
          ]
        },
        {
          id: "badgeSize",
          label: t("Badge Size"),
          type: "radioGroup-dev",
          disabled: reviewType !== "badge",
          choices: [
            { value: "large", icon: "nc-large" },
            { value: "small", icon: "nc-small" }
          ]
        },
        {
          id: "linkToPage",
          label: t("Link To Page"),
          type: "inputText-dev",
          config: { size: "medium" },
          disabled: reviewType !== "badge",
          placeholder: t("Enter text here...")
        }
      ]
    },
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
};

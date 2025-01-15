import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";
import { EcwidProductThumb, Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const borderColor = getColor(
    dvv("thumbnailBorderColorPalette"),
    dvv("thumbnailBorderColorHex"),
    dvv("thumbnailBorderColorOpacity")
  );
  const thumbStyle = dvv("thumbStyle");

  const imageFeed = thumbStyle === EcwidProductThumb.ImgFeed;
  const thumbVertical = thumbStyle === EcwidProductThumb.ImgThumbVertical;
  const thumbHorizontal = thumbStyle === EcwidProductThumb.ImgThumbHorizontal;

  const spacingLabel = thumbHorizontal || imageFeed ? t("Top") : t("Right");

  return [
    {
      id: "toolbarGalleryThumbnail",
      type: "popover",
      position: 10,
      config: { title: t("Thumbnail"), icon: "nc-woo-gallery" },
      devices: "desktop",
      options: [
        {
          id: "galleryHoverZoom",
          label: t("Hover Zoom"),
          type: "switch",
          helper: {
            content:
              "Enable or disable on hover zoom of a main product image in product details pages."
          }
        },
        {
          id: "carouselImage",
          label: t("Carousel Image"),
          type: "switch",
          helper: {
            content:
              "Adds the ability to scroll product images without opening full-screen image viewer."
          }
        },
        {
          id: "previewAdditionalImages",
          label: t("Preview additional Images"),
          type: "switch",
          helper: {
            content:
              "Shows the additional product image in the place of main product image when clicking on gallery thumbnail."
          }
        },
        {
          id: "thumbStyle",
          label: t("Style"),
          type: "radioGroup",
          choices: [
            { value: EcwidProductThumb.ImgFeed, icon: "nc-grid-45" },
            {
              value: EcwidProductThumb.ImgThumbHorizontal,
              icon: "nc-woo-gallery-bottom"
            },
            {
              value: EcwidProductThumb.ImgThumbVertical,
              icon: "nc-woo-gallery-left"
            }
          ]
        },
        {
          id: "thumbnailAspectRatio",
          label: t("Ratio"),
          type: "select",
          choices: [
            { value: "AUTO", title: "Auto" },
            { value: "PORTRAIT_0667", title: "2:3" },
            { value: "PORTRAIT_075", title: "3:4" },
            { value: "SQUARE_1", title: "1:1" },
            { value: "LANDSCAPE_1333", title: "4:3" },
            { value: "LANDSCAPE_15", title: "3:2" }
          ]
        },
        {
          id: "thumbSpacing",
          label: spacingLabel,
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "betweenThumbnail",
          label: t("Between"),
          disabled: imageFeed,
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: borderColor
          }
        }
      },
      position: 30,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "thumbnailBorder",
                  type: "border",
                  devices: "desktop",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "thumbnailBoxShadow",
                  type: "boxShadow",
                  devices: "desktop",
                  states: [NORMAL, HOVER, ACTIVE]
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
      config: { icon: "nc-cog", title: t("Settings") },
      devices: "desktop",
      disabled: imageFeed || thumbVertical,
      position: 40,
      options: [
        {
          id: "thumbnailWidthSpacing",
          label: t("Width"),
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: "styles",
          type: "sidebarTabsButton",
          devices: "desktop",
          config: {
            tabId: "styles",
            text: t("Styling"),
            icon: "nc-cog",
            align: "left"
          }
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      disabled: !imageFeed && !thumbVertical,
      position: 40,
      devices: "desktop",
      title: t("Settings")
    }
  ];
};

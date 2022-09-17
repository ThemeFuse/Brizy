import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { ACTIVE, HOVER, NORMAL, State } from "visual/utils/stateMode";
import { EcwidProductThumb, Value } from "./types/Value";

export function getItems({
  v,
  device,
  state
}: {
  v: Value;
  device: ResponsiveMode;
  state: State;
}): ToolbarItemType[] {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const { hex: borderColorHex } = getOptionColorHexByPalette(
    dvv("thumbnailBorderColorHex"),
    dvv("thumbnailBorderColorPalette")
  );
  const thumbStyle = dvv("thumbStyle");

  const imageFeed = thumbStyle === EcwidProductThumb.ImgFeed;
  const thumbVertical = thumbStyle === EcwidProductThumb.ImgThumbVertical;
  const thumbHorizontal = thumbStyle === EcwidProductThumb.ImgThumbHorizontal;

  const spacingLabel = thumbHorizontal || imageFeed ? t("Top") : t("Right");

  return [
    {
      id: "toolbarGalleryThumbnail",
      type: "popover-dev",
      position: 10,
      config: { title: t("Thumbnail"), icon: "nc-woo-gallery" },
      devices: "desktop",
      options: [
        {
          id: "galleryHoverZoom",
          label: t("Hover Zoom"),
          type: "switch-dev",
          helper: {
            content:
              "Enable or disable on hover zoom of a main product image in product details pages."
          }
        },
        {
          id: "carouselImage",
          label: t("Carousel Image"),
          type: "switch-dev",
          helper: {
            content:
              "Adds the ability to scroll product images without opening full-screen image viewer."
          }
        },
        {
          id: "previewAdditionalImages",
          label: t("Preview additional Images"),
          type: "switch-dev",
          helper: {
            content:
              "Shows the additional product image in the place of main product image when clicking on gallery thumbnail."
          }
        },
        {
          id: "thumbStyle",
          label: t("Style"),
          type: "radioGroup-dev",
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
          type: "select-dev",
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
          type: "slider-dev",
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
          type: "slider-dev",
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
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(
              borderColorHex,
              dvv("thumbnailBorderColorOpacity")
            )
          }
        }
      },
      position: 30,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "thumbnailBorder",
                  type: "border-dev",
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
                  type: "boxShadow-dev",
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
      type: "popover-dev",
      config: { icon: "nc-cog", title: t("Settings") },
      devices: "desktop",
      disabled: imageFeed || thumbVertical,
      position: 40,
      options: [
        {
          id: "thumbnailWidthSpacing",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: "styles",
          type: "sidebarTabsButton-dev",
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
      //@ts-expect-error Old option doesn't work
      type: "advancedSettings",
      disabled: !imageFeed && !thumbVertical,
      position: 40,
      icon: "nc-cog",
      devices: "desktop",
      title: t("Settings")
    }
  ];
}

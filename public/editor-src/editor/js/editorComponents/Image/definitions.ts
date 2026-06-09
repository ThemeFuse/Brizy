import { z } from "zod";
import { withColorDefaults } from "visual/ai/adapters/prop-defaults";
import {
  colorPalette,
  hexColor,
  onOff,
  opacity
} from "visual/ai/adapters/schema-primitives";
import type { AddToolConfig, UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";

export const imagePropsSchema = z.object({
  // content
  imageSrc: z.string().url().optional(),
  alt: z.string().optional(),
  zoom: z.number().min(100).max(200).optional(),
  enableLazyLoad: onOff.optional(),

  // sizing
  sizeType: z.enum(["custom", "original"]).optional(),
  width: z.number().min(1).optional(),
  widthSuffix: z.enum(["px", "%"]).optional(),
  height: z.number().min(1).optional(),
  heightSuffix: z.enum(["px", "%"]).optional(),
  size: z.number().min(5).max(100).optional(),

  // cropping
  positionX: z.number().min(0).max(100).optional(),
  positionY: z.number().min(0).max(100).optional(),

  // link
  linkType: z.enum(["external", "lightBox"]).optional(),
  linkExternal: z.string().optional(),
  linkExternalBlank: onOff.optional(),
  linkExternalRel: onOff.optional(),
  linkLightBox: onOff.optional(),

  // border
  borderStyle: z.enum(["solid", "dashed", "dotted", "none"]).optional(),
  borderWidth: z.number().min(0).optional(),
  borderColorHex: hexColor,
  borderColorOpacity: opacity,
  borderColorPalette: colorPalette,
  borderRadiusType: z.enum(["square", "rounded", "custom"]).optional(),
  borderRadius: z.number().min(0).optional(),

  // background overlay
  bgColorType: z.enum(["solid", "gradient", "none"]).optional(),
  bgColorHex: hexColor,
  bgColorOpacity: opacity,
  bgColorPalette: colorPalette,
  gradientType: z.enum(["linear", "radial"]).optional(),
  gradientColorHex: hexColor,
  gradientColorOpacity: opacity,
  gradientColorPalette: colorPalette,
  gradientLinearDegree: z.number().min(0).max(360).optional(),
  gradientStartPointer: z.number().min(0).max(100).optional(),
  gradientFinishPointer: z.number().min(0).max(100).optional(),

  // box shadow
  boxShadow: z.enum(["on", "none"]).optional(),
  boxShadowColorHex: hexColor,
  boxShadowColorOpacity: opacity,
  boxShadowColorPalette: colorPalette,
  boxShadowBlur: z.number().min(0).optional(),
  boxShadowSpread: z.number().optional(),
  boxShadowVertical: z.number().optional(),
  boxShadowHorizontal: z.number().optional(),

  // image filters
  imageBrightness: z.number().min(0).max(200).optional(),
  imageHue: z.number().min(0).max(360).optional(),
  imageSaturation: z.number().min(0).max(200).optional(),
  imageContrast: z.number().min(0).max(200).optional(),
  imageOpacity: z.number().min(0).max(100).optional(),

  // blend mode
  blendMode: z
    .enum([
      "normal",
      "multiply",
      "screen",
      "overlay",
      "darken",
      "lighten",
      "color-dodge",
      "color-burn",
      "hard-light",
      "soft-light",
      "difference",
      "exclusion",
      "hue",
      "saturation"
    ])
    .optional(),

  // mask
  maskShape: z
    .enum([
      "none",
      "circle",
      "rhombus",
      "star",
      "flower",
      "square",
      "triangle",
      "hexagon",
      "blob1",
      "blob2",
      "blob3",
      "blob4",
      "brush1",
      "brush2",
      "brush3",
      "brush4",
      "poly1",
      "poly2",
      "poly3",
      "poly4"
    ])
    .optional(),
  maskSize: z.enum(["contain", "cover", "custom"]).optional(),
  maskPosition: z
    .enum([
      "center center",
      "center left",
      "center right",
      "top center",
      "top right",
      "top left",
      "bottom center",
      "bottom left",
      "bottom right"
    ])
    .optional(),
  maskRepeat: z
    .enum(["no-repeat", "repeat", "repeat-x", "repeat-y", "space", "round"])
    .optional(),
  maskScale: z.number().optional(),

  // hover
  hoverTransition: z.number().min(0).max(99).optional()
});

export type ImageProps = z.infer<typeof imagePropsSchema>;

type Props = Record<string, unknown>;

// borderRadius requires borderRadiusType:"custom" to render
const inferBorderRadiusType = <T extends Props>(props: T): T =>
  "borderRadius" in props &&
  props.borderRadius !== undefined &&
  !("borderRadiusType" in props)
    ? { ...props, borderRadiusType: "custom" }
    : props;

// custom width/height requires sizeType:"custom" to take effect
const inferCustomSizeType = <T extends Props>(props: T): T =>
  !("sizeType" in props) &&
  (("width" in props && props.width !== undefined) ||
    ("height" in props && props.height !== undefined))
    ? { ...props, sizeType: "custom" }
    : props;

// boxShadow properties require boxShadow:"on" to render
const BOX_SHADOW_KEYS = [
  "boxShadowColorHex",
  "boxShadowColorOpacity",
  "boxShadowBlur",
  "boxShadowSpread",
  "boxShadowVertical",
  "boxShadowHorizontal"
];

const inferBoxShadowOn = <T extends Props>(props: T): T =>
  !("boxShadow" in props) &&
  BOX_SHADOW_KEYS.some((k) => k in props && props[k] !== undefined)
    ? { ...props, boxShadow: "on" }
    : props;

// borderWidth requires borderStyle to be set
const inferBorderStyle = <T extends Props>(props: T): T =>
  "borderWidth" in props &&
  props.borderWidth !== undefined &&
  !("borderStyle" in props)
    ? { ...props, borderStyle: "solid" }
    : props;

// imageType: "external" is required for external URLs to work
const inferExternalImageType = <T extends Props>(props: T): T =>
  "imageSrc" in props && props.imageSrc !== undefined
    ? { ...props, imageType: "external" }
    : props;

export const withImageDefaults = pipe(
  withColorDefaults,
  inferBorderRadiusType,
  inferCustomSizeType,
  inferBoxShadowOn,
  inferBorderStyle,
  inferExternalImageType
);

// Shared image property definitions for tool parameters
const imagePropertyDefinitions = {
  // Content
  imageSrc: {
    type: "string",
    description:
      "Valid public image URL starting with https:// (e.g., 'https://images.unsplash.com/photo.jpg'). Must be a real accessible URL, not a placeholder or UID."
  },
  alt: {
    type: "string",
    description: "Alt text for accessibility and SEO"
  },
  zoom: {
    type: "number",
    description: "Image zoom level percentage (100=normal, 200=2x zoom)",
    minimum: 100,
    maximum: 200
  },
  enableLazyLoad: {
    type: "string",
    enum: ["on", "off"],
    description: "Enable lazy loading for performance"
  },

  // Sizing
  sizeType: {
    type: "string",
    enum: ["custom", "original"],
    description:
      "Size mode. 'custom' uses width/height values, 'original' uses size percentage. Auto-set to 'custom' when width/height provided."
  },
  width: {
    type: "number",
    description:
      "Image width value. Requires sizeType: 'custom' (auto-set when width provided).",
    minimum: 1
  },
  widthSuffix: {
    type: "string",
    enum: ["px", "%"],
    description: "Width unit"
  },
  height: {
    type: "number",
    description:
      "Image height value. Requires sizeType: 'custom' (auto-set when height provided).",
    minimum: 1
  },
  heightSuffix: {
    type: "string",
    enum: ["px", "%"],
    description: "Height unit"
  },
  size: {
    type: "number",
    description:
      "Size percentage when sizeType is 'original' (5-100). Not used with sizeType: 'custom'.",
    minimum: 5,
    maximum: 100
  },

  // Cropping
  positionX: {
    type: "number",
    description:
      "Horizontal crop position percentage (0=left, 50=center, 100=right)",
    minimum: 0,
    maximum: 100
  },
  positionY: {
    type: "number",
    description:
      "Vertical crop position percentage (0=top, 50=center, 100=bottom)",
    minimum: 0,
    maximum: 100
  },

  // Link
  linkType: {
    type: "string",
    enum: ["external", "lightBox"],
    description:
      "Link behavior. 'external' = navigate to URL, 'lightBox' = open image in lightbox overlay"
  },
  linkExternal: {
    type: "string",
    description: "URL to navigate when clicked (requires linkType: 'external')"
  },
  linkExternalBlank: {
    type: "string",
    enum: ["on", "off"],
    description: "Open link in new tab ('on') or same tab ('off')"
  },
  linkExternalRel: {
    type: "string",
    enum: ["on", "off"],
    description: "Add nofollow rel attribute to link"
  },
  linkLightBox: {
    type: "string",
    enum: ["on", "off"],
    description:
      "Open image in lightbox when clicked (requires linkType: 'lightBox')"
  },

  // Border
  borderStyle: {
    type: "string",
    enum: ["solid", "dashed", "dotted", "none"],
    description:
      "Border line style. Auto-set to 'solid' when borderWidth is provided."
  },
  borderWidth: {
    type: "number",
    description: "Border width in pixels",
    minimum: 0
  },
  borderColorHex: {
    type: "string",
    description:
      "Border color hex (e.g., '#000000'). Palette is auto-cleared when hex is provided."
  },
  borderColorOpacity: {
    type: "number",
    description: "Border color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  borderColorPalette: {
    type: "string",
    description:
      "Set to '' when using borderColorHex. For palette colors use 'color1'-'color8'."
  },
  borderRadiusType: {
    type: "string",
    enum: ["square", "rounded", "custom"],
    description:
      "Corner style. 'square' = no rounding, 'rounded' = fully rounded, 'custom' = use borderRadius value."
  },
  borderRadius: {
    type: "number",
    description:
      "Border radius in pixels. Auto-sets borderRadiusType to 'custom' if not specified.",
    minimum: 0
  },

  // Background overlay
  bgColorType: {
    type: "string",
    enum: ["solid", "gradient", "none"],
    description:
      "Image overlay type. 'solid' = flat color overlay, 'gradient' = gradient overlay, 'none' = no overlay."
  },
  bgColorHex: {
    type: "string",
    description:
      "Overlay color hex. Palette is auto-cleared when hex is provided."
  },
  bgColorOpacity: {
    type: "number",
    description: "Overlay color opacity (0=transparent, 1=opaque)",
    minimum: 0,
    maximum: 1
  },
  bgColorPalette: {
    type: "string",
    description:
      "Set to '' when using bgColorHex. For palette colors use 'color1'-'color8'."
  },
  gradientType: {
    type: "string",
    enum: ["linear", "radial"],
    description: "Gradient direction type (requires bgColorType: 'gradient')"
  },
  gradientColorHex: {
    type: "string",
    description:
      "Gradient end color hex (start color is bgColorHex). Palette is auto-cleared."
  },
  gradientColorOpacity: {
    type: "number",
    description: "Gradient end color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  gradientColorPalette: {
    type: "string",
    description:
      "Set to '' when using gradientColorHex. For palette colors use 'color1'-'color8'."
  },
  gradientLinearDegree: {
    type: "number",
    description: "Linear gradient angle in degrees (0=up, 90=right, 180=down)",
    minimum: 0,
    maximum: 360
  },
  gradientStartPointer: {
    type: "number",
    description: "Gradient start position as percentage (0-100)",
    minimum: 0,
    maximum: 100
  },
  gradientFinishPointer: {
    type: "number",
    description: "Gradient end position as percentage (0-100)",
    minimum: 0,
    maximum: 100
  },

  // Box shadow
  boxShadow: {
    type: "string",
    enum: ["on", "none"],
    description:
      "Enable box shadow. MUST be 'on' for shadow properties to render. Auto-set when shadow properties provided."
  },
  boxShadowColorHex: {
    type: "string",
    description: "Shadow color hex. Palette is auto-cleared."
  },
  boxShadowColorOpacity: {
    type: "number",
    description: "Shadow color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  boxShadowBlur: {
    type: "number",
    description: "Shadow blur radius in pixels",
    minimum: 0
  },
  boxShadowSpread: {
    type: "number",
    description: "Shadow spread in pixels (negative for inset shrink)"
  },
  boxShadowVertical: {
    type: "number",
    description: "Shadow vertical offset in pixels (positive = down)"
  },
  boxShadowHorizontal: {
    type: "number",
    description: "Shadow horizontal offset in pixels (positive = right)"
  },

  // Image filters
  imageBrightness: {
    type: "number",
    description:
      "Image brightness percentage (100=normal, 0=black, 200=very bright)",
    minimum: 0,
    maximum: 200
  },
  imageHue: {
    type: "number",
    description: "Hue rotation in degrees (0-360)",
    minimum: 0,
    maximum: 360
  },
  imageSaturation: {
    type: "number",
    description: "Saturation percentage (100=normal, 0=grayscale, 200=vivid)",
    minimum: 0,
    maximum: 200
  },
  imageContrast: {
    type: "number",
    description: "Contrast percentage (100=normal, 0=flat, 200=high contrast)",
    minimum: 0,
    maximum: 200
  },
  imageOpacity: {
    type: "number",
    description: "Image opacity percentage (0=transparent, 100=opaque)",
    minimum: 0,
    maximum: 100
  },

  // Blend mode
  blendMode: {
    type: "string",
    enum: [
      "normal",
      "multiply",
      "screen",
      "overlay",
      "darken",
      "lighten",
      "color-dodge",
      "color-burn",
      "hard-light",
      "soft-light",
      "difference",
      "exclusion",
      "hue",
      "saturation"
    ],
    description: "CSS blend mode for the image"
  },

  // Mask
  maskShape: {
    type: "string",
    enum: [
      "none",
      "circle",
      "rhombus",
      "star",
      "flower",
      "square",
      "triangle",
      "hexagon",
      "blob1",
      "blob2",
      "blob3",
      "blob4",
      "brush1",
      "brush2",
      "brush3",
      "brush4",
      "poly1",
      "poly2",
      "poly3",
      "poly4"
    ],
    description: "Mask shape preset. 'none' disables masking."
  },
  maskSize: {
    type: "string",
    enum: ["contain", "cover", "custom"],
    description:
      "Mask size mode. 'cover' fills element, 'contain' fits inside, 'custom' uses maskScale."
  },
  maskPosition: {
    type: "string",
    enum: [
      "center center",
      "center left",
      "center right",
      "top center",
      "top right",
      "top left",
      "bottom center",
      "bottom left",
      "bottom right"
    ],
    description: "Mask position within the element"
  },
  maskRepeat: {
    type: "string",
    enum: ["no-repeat", "repeat", "repeat-x", "repeat-y", "space", "round"],
    description: "Mask repeat mode"
  },
  maskScale: {
    type: "number",
    description: "Mask scale value"
  },

  // Hover
  hoverTransition: {
    type: "number",
    description: "Hover transition duration in tenths of a second (0-99)",
    minimum: 0,
    maximum: 99
  }
} as const;

export const addImageDefinition: ToolDefinition = {
  name: "addImage",
  strict: true,
  description:
    "Add an Image to an EXISTING Section. For modifying pages, not creating new sections. For new sections use generateBlock.",
  category: "element",
  parameters: {
    type: "object",
    properties: {
      containerId: {
        type: "string",
        description: "ID of the Section or Column container"
      },
      insertIndex: {
        type: "number",
        description: "Position in container (0-indexed). Omit to add at end.",
        minimum: 0
      },
      ...imagePropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateImageDefinition: ToolDefinition = {
  name: "updateImage",
  strict: true,
  description:
    "Update an Image element. Use searchElements({type:'Image'}) to find image IDs first.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the image to update"
      },
      ...imagePropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addImageConfig: AddToolConfig = {
  kind: "add",
  definition: addImageDefinition,
  elementType: ElementTypes.Image,
  schema: imagePropsSchema,
  defaults: withImageDefaults
};

export const updateImageConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateImageDefinition,
  elementType: ElementTypes.Image,
  schema: imagePropsSchema,
  defaults: withImageDefaults
};

import { z } from "zod";
import type { ToolDefinition } from "visual/ai/entities/models";
import type { AddToolConfig, UpdateToolConfig } from "visual/ai/adapters/types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import {
  hexColor,
  opacity,
  colorPalette,
  onOff
} from "visual/ai/adapters/schema-primitives";
import { pipe } from "visual/utils/fp/pipe";
import { withColorDefaults } from "visual/ai/adapters/prop-defaults";

export const imageComparisonPropsSchema = z.object({
  // content
  imageSrc: z.string().url().optional(),
  hoverImageSrc: z.string().url().optional(),
  alt: z.string().optional(),
  enableLazyLoad: onOff.optional(),
  sliderType: z.enum(["horizontal", "vertical"]).optional(),

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

  // border
  borderStyle: z.enum(["solid", "dashed", "dotted", "none"]).optional(),
  borderWidthType: z.enum(["grouped", "ungrouped"]).optional(),
  borderWidth: z.number().min(0).optional(),
  borderTopWidth: z.number().min(0).optional(),
  borderRightWidth: z.number().min(0).optional(),
  borderBottomWidth: z.number().min(0).optional(),
  borderLeftWidth: z.number().min(0).optional(),
  borderColorHex: hexColor,
  borderColorOpacity: opacity,
  borderColorPalette: colorPalette,
  borderRadiusType: z.enum(["square", "rounded", "custom"]).optional(),
  borderRadius: z.number().min(0).optional(),
  borderTopLeftRadius: z.number().min(0).optional(),
  borderTopRightRadius: z.number().min(0).optional(),
  borderBottomRightRadius: z.number().min(0).optional(),
  borderBottomLeftRadius: z.number().min(0).optional(),
  borderRadiusSuffix: z.enum(["px", "%"]).optional(),
  borderTopLeftRadiusSuffix: z.enum(["px", "%"]).optional(),
  borderTopRightRadiusSuffix: z.enum(["px", "%"]).optional(),
  borderBottomRightRadiusSuffix: z.enum(["px", "%"]).optional(),
  borderBottomLeftRadiusSuffix: z.enum(["px", "%"]).optional(),

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
  gradientRadialDegree: z.number().min(0).max(360).optional(),
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
      "difference",
      "exclusion",
      "hue",
      "saturation",
      "luminosity"
    ])
    .optional(),

  // thumb arrow colors
  thumbArrowColorHex: hexColor,
  thumbArrowColorOpacity: opacity,
  thumbArrowColorPalette: colorPalette,
  thumbArrowBgColorHex: hexColor,
  thumbArrowBgColorOpacity: opacity,
  thumbArrowBgColorPalette: colorPalette,

  // hover
  hoverTransition: z.number().min(0).max(99).optional()
});

export type ImageComparisonProps = z.infer<typeof imageComparisonPropsSchema>;

type Props = Record<string, unknown>;

const BORDER_RADIUS_KEYS = [
  "borderRadius",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomRightRadius",
  "borderBottomLeftRadius"
];

const inferBorderRadiusType = <T extends Props>(props: T): T =>
  !("borderRadiusType" in props) &&
  BORDER_RADIUS_KEYS.some((k) => k in props && props[k] !== undefined)
    ? { ...props, borderRadiusType: "custom" }
    : props;

const inferCustomSizeType = <T extends Props>(props: T): T =>
  !("sizeType" in props) &&
  (("width" in props && props.width !== undefined) ||
    ("height" in props && props.height !== undefined))
    ? { ...props, sizeType: "custom" }
    : props;

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

const PER_SIDE_BORDER_WIDTH_KEYS = [
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth"
];

const inferBorderWidthType = <T extends Props>(props: T): T =>
  !("borderWidthType" in props) &&
  PER_SIDE_BORDER_WIDTH_KEYS.some((k) => k in props && props[k] !== undefined)
    ? { ...props, borderWidthType: "ungrouped" }
    : props;

const inferBorderStyle = <T extends Props>(props: T): T => {
  if ("borderStyle" in props) return props;
  const hasBorderWidth =
    ("borderWidth" in props && props.borderWidth !== undefined) ||
    PER_SIDE_BORDER_WIDTH_KEYS.some(
      (k) => k in props && props[k] !== undefined
    );
  return hasBorderWidth ? { ...props, borderStyle: "solid" } : props;
};

const inferExternalImageType = <T extends Props>(props: T): T =>
  ("imageSrc" in props && props.imageSrc !== undefined) ||
  ("hoverImageSrc" in props && props.hoverImageSrc !== undefined)
    ? { ...props, imageType: "external" }
    : props;

export const withImageComparisonDefaults = pipe(
  withColorDefaults,
  inferBorderRadiusType,
  inferCustomSizeType,
  inferBoxShadowOn,
  inferBorderWidthType,
  inferBorderStyle,
  inferExternalImageType
);

const imageComparisonPropertyDefinitions = {
  // Content
  imageSrc: {
    type: "string",
    description:
      "Valid public image URL starting with https:// for the first (before) image. Must be a real accessible URL."
  },
  hoverImageSrc: {
    type: "string",
    description:
      "Valid public image URL starting with https:// for the second (after) image. Must be a real accessible URL."
  },
  alt: {
    type: "string",
    description: "Alt text for accessibility and SEO"
  },
  enableLazyLoad: {
    type: "string",
    enum: ["on", "off"],
    description: "Enable lazy loading for performance"
  },
  sliderType: {
    type: "string",
    enum: ["horizontal", "vertical"],
    description:
      "Comparison slider direction. 'horizontal' = left/right, 'vertical' = top/bottom."
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

  // Border
  borderStyle: {
    type: "string",
    enum: ["solid", "dashed", "dotted", "none"],
    description:
      "Border line style. Auto-set to 'solid' when borderWidth is provided."
  },
  borderWidthType: {
    type: "string",
    enum: ["grouped", "ungrouped"],
    description:
      "Border width mode. 'grouped' = same width all sides (use borderWidth), 'ungrouped' = per-side widths. Auto-set to 'ungrouped' when per-side widths provided."
  },
  borderWidth: {
    type: "number",
    description:
      "Border width in pixels (all sides when borderWidthType is 'grouped')",
    minimum: 0
  },
  borderTopWidth: {
    type: "number",
    description:
      "Top border width in pixels. Sets borderWidthType to 'ungrouped' automatically.",
    minimum: 0
  },
  borderRightWidth: {
    type: "number",
    description:
      "Right border width in pixels. Sets borderWidthType to 'ungrouped' automatically.",
    minimum: 0
  },
  borderBottomWidth: {
    type: "number",
    description:
      "Bottom border width in pixels. Sets borderWidthType to 'ungrouped' automatically.",
    minimum: 0
  },
  borderLeftWidth: {
    type: "number",
    description:
      "Left border width in pixels. Sets borderWidthType to 'ungrouped' automatically.",
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
      "Border radius in pixels (all corners). Auto-sets borderRadiusType to 'custom' if not specified.",
    minimum: 0
  },
  borderTopLeftRadius: {
    type: "number",
    description:
      "Top-left corner radius in pixels. Auto-sets borderRadiusType to 'custom'.",
    minimum: 0
  },
  borderTopRightRadius: {
    type: "number",
    description:
      "Top-right corner radius in pixels. Auto-sets borderRadiusType to 'custom'.",
    minimum: 0
  },
  borderBottomRightRadius: {
    type: "number",
    description:
      "Bottom-right corner radius in pixels. Auto-sets borderRadiusType to 'custom'.",
    minimum: 0
  },
  borderBottomLeftRadius: {
    type: "number",
    description:
      "Bottom-left corner radius in pixels. Auto-sets borderRadiusType to 'custom'.",
    minimum: 0
  },
  borderRadiusSuffix: {
    type: "string",
    enum: ["px", "%"],
    description: "Border radius unit for all corners"
  },
  borderTopLeftRadiusSuffix: {
    type: "string",
    enum: ["px", "%"],
    description: "Top-left corner radius unit"
  },
  borderTopRightRadiusSuffix: {
    type: "string",
    enum: ["px", "%"],
    description: "Top-right corner radius unit"
  },
  borderBottomRightRadiusSuffix: {
    type: "string",
    enum: ["px", "%"],
    description: "Bottom-right corner radius unit"
  },
  borderBottomLeftRadiusSuffix: {
    type: "string",
    enum: ["px", "%"],
    description: "Bottom-left corner radius unit"
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
    description:
      "Linear gradient angle in degrees (0=up, 90=right, 180=down)",
    minimum: 0,
    maximum: 360
  },
  gradientRadialDegree: {
    type: "number",
    description: "Radial gradient angle in degrees",
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
  boxShadowColorPalette: {
    type: "string",
    description:
      "Set to '' when using boxShadowColorHex. For palette colors use 'color1'-'color8'."
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
    description:
      "Saturation percentage (100=normal, 0=grayscale, 200=vivid)",
    minimum: 0,
    maximum: 200
  },
  imageContrast: {
    type: "number",
    description:
      "Contrast percentage (100=normal, 0=flat, 200=high contrast)",
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
      "difference",
      "exclusion",
      "hue",
      "saturation",
      "luminosity"
    ],
    description: "CSS blend mode for the image"
  },

  // Thumb arrow colors
  thumbArrowColorHex: {
    type: "string",
    description:
      "Comparison slider arrow color hex (e.g., '#ffffff'). Palette is auto-cleared."
  },
  thumbArrowColorOpacity: {
    type: "number",
    description: "Slider arrow color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  thumbArrowColorPalette: {
    type: "string",
    description:
      "Set to '' when using thumbArrowColorHex. For palette colors use 'color1'-'color8'."
  },
  thumbArrowBgColorHex: {
    type: "string",
    description:
      "Comparison slider arrow background color hex (e.g., '#000000'). Palette is auto-cleared."
  },
  thumbArrowBgColorOpacity: {
    type: "number",
    description: "Slider arrow background opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  thumbArrowBgColorPalette: {
    type: "string",
    description:
      "Set to '' when using thumbArrowBgColorHex. For palette colors use 'color1'-'color8'."
  },

  // Hover
  hoverTransition: {
    type: "number",
    description: "Hover transition duration in tenths of a second (0-99)",
    minimum: 0,
    maximum: 99
  }
} as const;

export const addImageComparisonDefinition: ToolDefinition = {
  name: "addImageComparison",
  strict: true,
  description:
    "Add an Image Comparison (before/after slider) to an EXISTING Section. Shows two images with a draggable slider to compare them. For new sections use generateBlock.",
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
      ...imageComparisonPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateImageComparisonDefinition: ToolDefinition = {
  name: "updateImageComparison",
  strict: true,
  description:
    "Update an Image Comparison element's properties. Use searchElements({type:'ImageComparison'}) to find IDs.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the ImageComparison to update"
      },
      ...imageComparisonPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addImageComparisonConfig: AddToolConfig = {
  kind: "add",
  definition: addImageComparisonDefinition,
  elementType: ElementTypes.ImageComparison,
  schema: imageComparisonPropsSchema,
  defaults: withImageComparisonDefaults
};

export const updateImageComparisonConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateImageComparisonDefinition,
  elementType: ElementTypes.ImageComparison,
  schema: imageComparisonPropsSchema,
  defaults: withImageComparisonDefaults
};

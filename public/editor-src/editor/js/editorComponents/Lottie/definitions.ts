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

export const lottiePropsSchema = z.object({
  // content
  animationLink: z.string().optional(),

  // playback
  trigger: z.enum(["onLoad", "onHover", "onClick", "onScroll"]).optional(),
  renderer: z.enum(["svg", "canvas"]).optional(),
  speed: z.number().min(0.1).max(5).optional(),
  loop: onOff.optional(),
  autoplay: onOff.optional(),
  lazyload: onOff.optional(),
  direction: z.union([z.literal(1), z.literal(-1)]).optional(),

  // background color
  bgColorHex: hexColor,
  bgColorOpacity: opacity,
  bgColorPalette: colorPalette,

  // sizing
  width: z.number().min(1).optional(),
  widthSuffix: z.enum(["%", "px"]).optional()
});

export type LottieProps = z.infer<typeof lottiePropsSchema>;

export const withLottieDefaults = withColorDefaults;

const lottiePropertyDefinitions = {
  animationLink: {
    type: "string",
    description:
      "Lottie animation JSON URL (e.g., from LottieFiles.com). Must be a direct .json URL."
  },
  trigger: {
    type: "string",
    enum: ["onLoad", "onHover", "onClick", "onScroll"],
    description:
      "Animation trigger: 'onLoad' (default), 'onHover', 'onClick', 'onScroll'"
  },
  renderer: {
    type: "string",
    enum: ["svg", "canvas"],
    description: "Render engine: 'svg' (default, sharper) or 'canvas' (faster)"
  },
  speed: {
    type: "number",
    description: "Playback speed multiplier (0.1–5, default 1)",
    minimum: 0.1,
    maximum: 5
  },
  loop: {
    type: "string",
    enum: ["on", "off"],
    description: "Loop animation continuously"
  },
  autoplay: {
    type: "string",
    enum: ["on", "off"],
    description: "Auto-play animation on load"
  },
  lazyload: {
    type: "string",
    enum: ["on", "off"],
    description: "Lazy load animation (defer until visible)"
  },
  direction: {
    type: "number",
    enum: [1, -1],
    description: "Play direction: 1 = forward (default), -1 = reverse"
  },
  bgColorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using bgColorHex. For palette colors use 'color1'-'color8'."
  },
  bgColorHex: {
    type: "string",
    description:
      "Background color hex (e.g., '#FF0000'). Palette is auto-cleared when hex is provided."
  },
  bgColorOpacity: {
    type: "number",
    description: "Background color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  width: {
    type: "number",
    description:
      "Width value (use with widthSuffix). Max 1000 for px, 100 for %.",
    minimum: 1
  },
  widthSuffix: {
    type: "string",
    enum: ["%", "px"],
    description: "Width unit: '%' (default) or 'px'"
  }
} as const;

export const addLottieDefinition: ToolDefinition = {
  name: "addLottie",
  strict: true,
  description:
    "Add a Lottie animation to an EXISTING Section. Provide an animationLink to a Lottie JSON URL. For new sections use generateBlock.",
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
      ...lottiePropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateLottieDefinition: ToolDefinition = {
  name: "updateLottie",
  strict: true,
  description:
    "Update a Lottie animation element. Use searchElements({type:'Lottie'}) to find IDs first.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the Lottie element to update"
      },
      ...lottiePropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addLottieConfig: AddToolConfig = {
  kind: "add",
  definition: addLottieDefinition,
  elementType: ElementTypes.Lottie,
  schema: lottiePropsSchema,
  defaults: withLottieDefaults
};

export const updateLottieConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateLottieDefinition,
  elementType: ElementTypes.Lottie,
  schema: lottiePropsSchema,
  defaults: withLottieDefaults
};

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

export const soundCloudPropsSchema = z.object({
  // content
  url: z.string().optional(),
  style: z.enum(["basic", "artwork"]).optional(),
  autoPlay: onOff.optional(),
  showArtwork: onOff.optional(),

  // border color
  borderColorHex: hexColor,
  borderColorOpacity: opacity,
  borderColorPalette: colorPalette,

  // border style
  borderStyle: z
    .enum(["solid", "dashed", "dotted", "double", "none"])
    .optional(),
  borderWidth: z.number().min(0).optional(),
  borderRadius: z.number().min(0).optional(),

  // box shadow
  boxShadow: z.enum(["", "on"]).optional(),
  boxShadowColorHex: hexColor,
  boxShadowColorOpacity: opacity,
  boxShadowColorPalette: colorPalette,
  boxShadowBlur: z.number().min(0).optional(),
  boxShadowSpread: z.number().optional(),
  boxShadowVertical: z.number().optional(),
  boxShadowHorizontal: z.number().optional(),

  // sizing
  width: z.number().min(1).max(100).optional(),
  height: z.number().min(5).optional()
});

export type SoundCloudProps = z.infer<typeof soundCloudPropsSchema>;

type Props = Record<string, unknown>;

export function withSoundCloudDefaults<T extends Props>(props: T): T {
  // Apply standard color defaults (border, boxShadow)
  let result = withColorDefaults(props);

  // Auto-enable boxShadow when shadow props are provided
  if (
    !("boxShadow" in result) &&
    (("boxShadowBlur" in result && result.boxShadowBlur !== undefined) ||
      ("boxShadowSpread" in result && result.boxShadowSpread !== undefined) ||
      ("boxShadowVertical" in result &&
        result.boxShadowVertical !== undefined) ||
      ("boxShadowHorizontal" in result &&
        result.boxShadowHorizontal !== undefined))
  ) {
    result = { ...result, boxShadow: "on" };
  }

  return result;
}

const soundCloudPropertyDefinitions = {
  // content
  url: {
    type: "string",
    description: "SoundCloud track or playlist URL"
  },
  style: {
    type: "string",
    enum: ["basic", "artwork"],
    description:
      "Player display style: 'basic' for minimal compact player, 'artwork' for player with cover art (taller)"
  },
  autoPlay: {
    type: "string",
    enum: ["on", "off"],
    description: "Auto-start playback on load"
  },
  showArtwork: {
    type: "string",
    enum: ["on", "off"],
    description: "Show cover artwork in the player"
  },

  // border color
  borderColorPalette: {
    type: "string",
    description:
      "Set to '' when using borderColorHex. For palette colors use 'color1'-'color8'."
  },
  borderColorHex: {
    type: "string",
    description:
      "Border color hex. Palette is auto-cleared when hex is provided."
  },
  borderColorOpacity: {
    type: "number",
    description: "Border color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },

  // border style
  borderStyle: {
    type: "string",
    enum: ["solid", "dashed", "dotted", "double", "none"],
    description: "Border line style"
  },
  borderWidth: {
    type: "number",
    description: "Border width in pixels",
    minimum: 0
  },
  borderRadius: {
    type: "number",
    description: "Border radius in pixels",
    minimum: 0
  },

  // box shadow
  boxShadow: {
    type: "string",
    enum: ["", "on"],
    description:
      "Enable box shadow. MUST be 'on' for shadow properties to render. '' disables shadow. Auto-enabled when shadow values are provided."
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
    description: "Shadow spread in pixels"
  },
  boxShadowVertical: {
    type: "number",
    description: "Shadow vertical offset in pixels (positive = down)"
  },
  boxShadowHorizontal: {
    type: "number",
    description: "Shadow horizontal offset in pixels (positive = right)"
  },

  // sizing
  width: {
    type: "number",
    description: "Width in percent (1-100)",
    minimum: 1,
    maximum: 100
  },
  height: {
    type: "number",
    description:
      "Height in pixels. For 'basic' style max is 175, for 'artwork' style max is 350.",
    minimum: 5
  }
} as const;

export const addSoundCloudDefinition: ToolDefinition = {
  name: "addSoundCloud",
  strict: true,
  description:
    "Add a SoundCloud embed player to an EXISTING Section. Embeds a SoundCloud track or playlist. For new sections use generateBlock.",
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
      ...soundCloudPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateSoundCloudDefinition: ToolDefinition = {
  name: "updateSoundCloud",
  strict: true,
  description:
    "Update a SoundCloud element. Use searchElements({type:'SoundCloud'}) to find SoundCloud IDs first.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the SoundCloud element to update"
      },
      ...soundCloudPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addSoundCloudConfig: AddToolConfig = {
  kind: "add",
  definition: addSoundCloudDefinition,
  elementType: ElementTypes.SoundCloud,
  schema: soundCloudPropsSchema,
  defaults: withSoundCloudDefaults
};

export const updateSoundCloudConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateSoundCloudDefinition,
  elementType: ElementTypes.SoundCloud,
  schema: soundCloudPropsSchema,
  defaults: withSoundCloudDefaults
};

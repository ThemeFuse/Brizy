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

export const audioPropsSchema = z.object({
  // content
  type: z.enum(["soundcloud", "custom"]).optional(),
  url: z.string().optional(),
  style: z.enum(["basic", "artwork"]).optional(),
  autoPlay: onOff.optional(),
  loop: onOff.optional(),

  // SoundCloud appearance
  artWork: onOff.optional(),
  comments: onOff.optional(),
  playCounts: onOff.optional(),
  username: onOff.optional(),

  // SoundCloud buttons
  likeButton: onOff.optional(),
  buyButton: onOff.optional(),
  downloadButton: onOff.optional(),
  shareButton: onOff.optional(),

  // display toggles (custom type)
  showTitle: onOff.optional(),
  showCurrentTime: onOff.optional(),
  showDurationTime: onOff.optional(),
  showProgressBarTrack: onOff.optional(),
  showProgressBarVolume: onOff.optional(),

  // icon (custom type)
  iconSize: z.enum(["small", "medium", "large", "custom"]).optional(),
  iconCustomSize: z.number().min(1).max(100).optional(),

  // colors - background
  bgColorHex: hexColor,
  bgColorOpacity: opacity,
  bgColorPalette: colorPalette,

  // colors - icon/text
  colorHex: hexColor,
  colorOpacity: opacity,
  colorPalette: colorPalette,

  // colors - progress/slider
  bg2ColorHex: hexColor,
  bg2ColorOpacity: opacity,
  bg2ColorPalette: colorPalette,

  // colors - border
  borderColorHex: hexColor,
  borderColorOpacity: opacity,
  borderColorPalette: colorPalette,

  // colors - SoundCloud controls
  controlsHex: hexColor,
  controlsOpacity: opacity,
  controlsPalette: colorPalette,

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
  width: z.number().min(1).optional(),
  widthSuffix: z.enum(["%", "px"]).optional(),
  height: z.number().min(40).max(300).optional()
});

export type AudioProps = z.infer<typeof audioPropsSchema>;

type Props = Record<string, unknown>;

const AUDIO_COLOR_PAIRS: Array<{ hex: string; palette: string }> = [
  { hex: "bg2ColorHex", palette: "bg2ColorPalette" },
  { hex: "controlsHex", palette: "controlsPalette" }
];

export function withAudioDefaults<T extends Props>(props: T): T {
  // Apply standard color defaults (bg, color, border, boxShadow)
  let result = withColorDefaults(props);

  // Apply audio-specific color defaults (bg2, controls)
  for (const { hex, palette } of AUDIO_COLOR_PAIRS) {
    if (hex in result && result[hex] !== undefined && !(palette in result)) {
      (result as Props)[palette] = "";
    }
  }

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

const audioPropertyDefinitions = {
  // content
  type: {
    type: "string",
    enum: ["soundcloud", "custom"],
    description:
      "(PRO ONLY — requires Brizy Pro) Audio source type. 'soundcloud' embeds a SoundCloud player (default), 'custom' enables local audio file playback."
  },
  url: {
    type: "string",
    description: "SoundCloud track or playlist URL"
  },
  style: {
    type: "string",
    enum: ["basic", "artwork"],
    description:
      "SoundCloud player display style: 'basic' for minimal player, 'artwork' for player with cover art"
  },
  autoPlay: {
    type: "string",
    enum: ["on", "off"],
    description: "Auto-start playback on load"
  },
  loop: {
    type: "string",
    enum: ["on", "off"],
    description:
      "(PRO ONLY — requires Brizy Pro) Loop playback (custom audio type only, ignored for SoundCloud)"
  },

  // SoundCloud appearance
  artWork: {
    type: "string",
    enum: ["on", "off"],
    description: "Show artwork in SoundCloud player"
  },
  comments: {
    type: "string",
    enum: ["on", "off"],
    description: "Show comments section in SoundCloud player"
  },
  playCounts: {
    type: "string",
    enum: ["on", "off"],
    description: "Show play count in SoundCloud player"
  },
  username: {
    type: "string",
    enum: ["on", "off"],
    description: "Show artist username in SoundCloud player"
  },

  // SoundCloud buttons
  likeButton: {
    type: "string",
    enum: ["on", "off"],
    description: "Show like button in SoundCloud player"
  },
  buyButton: {
    type: "string",
    enum: ["on", "off"],
    description: "Show buy button in SoundCloud player"
  },
  downloadButton: {
    type: "string",
    enum: ["on", "off"],
    description: "Show download button in SoundCloud player"
  },
  shareButton: {
    type: "string",
    enum: ["on", "off"],
    description: "Show share button in SoundCloud player"
  },

  // display toggles (custom audio type)
  showTitle: {
    type: "string",
    enum: ["on", "off"],
    description:
      "(PRO ONLY — requires Brizy Pro) Show audio title (custom audio type only)"
  },
  showCurrentTime: {
    type: "string",
    enum: ["on", "off"],
    description:
      "(PRO ONLY — requires Brizy Pro) Show current time counter (custom audio type only)"
  },
  showDurationTime: {
    type: "string",
    enum: ["on", "off"],
    description:
      "(PRO ONLY — requires Brizy Pro) Show total duration (custom audio type only)"
  },
  showProgressBarTrack: {
    type: "string",
    enum: ["on", "off"],
    description:
      "(PRO ONLY — requires Brizy Pro) Show progress bar background (custom audio type only)"
  },
  showProgressBarVolume: {
    type: "string",
    enum: ["on", "off"],
    description:
      "(PRO ONLY — requires Brizy Pro) Show volume bar (custom audio type only)"
  },

  // icon (custom audio type)
  iconSize: {
    type: "string",
    enum: ["small", "medium", "large", "custom"],
    description:
      "(PRO ONLY — requires Brizy Pro) Play/pause icon size preset. Set to 'custom' to use iconCustomSize. (custom audio type only)"
  },
  iconCustomSize: {
    type: "number",
    description:
      "(PRO ONLY — requires Brizy Pro) Custom icon size in pixels (requires iconSize: 'custom')",
    minimum: 1,
    maximum: 100
  },

  // background color
  bgColorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using bgColorHex. For palette colors use 'color1'-'color8'."
  },
  bgColorHex: {
    type: "string",
    description:
      "Background color hex (e.g., '#000000'). Palette is auto-cleared when hex is provided."
  },
  bgColorOpacity: {
    type: "number",
    description: "Background color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },

  // icon/text color (custom type only, disabled for SoundCloud)
  colorPalette: {
    type: "string",
    description:
      "Set to '' when using colorHex. For palette colors use 'color1'-'color8'. (custom audio type only)"
  },
  colorHex: {
    type: "string",
    description:
      "Icon/text color hex (e.g., '#FFFFFF'). Palette is auto-cleared. (custom audio type only)"
  },
  colorOpacity: {
    type: "number",
    description: "Icon/text color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },

  // progress/slider color (custom type only, disabled for SoundCloud)
  bg2ColorPalette: {
    type: "string",
    description:
      "Set to '' when using bg2ColorHex. For palette colors use 'color1'-'color8'. (custom audio type only)"
  },
  bg2ColorHex: {
    type: "string",
    description:
      "Progress bar / slider color hex. Palette is auto-cleared. (custom audio type only)"
  },
  bg2ColorOpacity: {
    type: "number",
    description: "Progress bar color opacity (0-1)",
    minimum: 0,
    maximum: 1
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

  // SoundCloud controls color (SoundCloud type only, disabled for custom)
  controlsPalette: {
    type: "string",
    description:
      "Set to '' when using controlsHex. For palette colors use 'color1'-'color8'. (SoundCloud type only)"
  },
  controlsHex: {
    type: "string",
    description:
      "SoundCloud controls accent color hex (e.g., '#ff7700'). Palette is auto-cleared. (SoundCloud type only)"
  },
  controlsOpacity: {
    type: "number",
    description: "Controls color opacity (0-1)",
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

  // box shadow (set boxShadow: "on" to enable)
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
    description:
      "Width value (use with widthSuffix). Max 1000 for px, 100 for %.",
    minimum: 1
  },
  widthSuffix: {
    type: "string",
    enum: ["%", "px"],
    description: "Width unit: '%' (default) or 'px'"
  },
  height: {
    type: "number",
    description: "Height in pixels (40-300)",
    minimum: 40,
    maximum: 300
  }
} as const;

export const addAudioDefinition: ToolDefinition = {
  name: "addAudio",
  strict: true,
  description:
    "Add an Audio player (SoundCloud or custom) to an EXISTING Section. Default type is SoundCloud. For new sections use generateBlock.",
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
      ...audioPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateAudioDefinition: ToolDefinition = {
  name: "updateAudio",
  strict: true,
  description:
    "Update an Audio element. Use searchElements({type:'Audio'}) to find audio IDs first.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the audio element to update"
      },
      ...audioPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addAudioConfig: AddToolConfig = {
  kind: "add",
  definition: addAudioDefinition,
  elementType: ElementTypes.Audio,
  schema: audioPropsSchema,
  defaults: withAudioDefaults
};

export const updateAudioConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateAudioDefinition,
  elementType: ElementTypes.Audio,
  schema: audioPropsSchema,
  defaults: withAudioDefaults
};

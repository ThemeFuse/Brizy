import { z } from "zod";
import { onOff } from "visual/ai/adapters/schema-primitives";
import type { AddToolConfig, UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { detectVideoType } from "visual/utils/video";

export const videoPropsSchema = z.object({
  // link
  video: z.string().optional(),
  // playback
  autoplay: onOff.optional(),
  loop: onOff.optional(),
  controls: onOff.optional()
});

export type VideoProps = z.infer<typeof videoPropsSchema>;

const videoPropertyDefinitions = {
  video: {
    type: "string",
    description: "Video URL (YouTube, Vimeo, or direct video URL)"
  },
  autoplay: {
    type: "string",
    enum: ["on", "off"],
    description: "Enable autoplay"
  },
  loop: {
    type: "string",
    enum: ["on", "off"],
    description: "Enable loop"
  },
  controls: {
    type: "string",
    enum: ["on", "off"],
    description: "Show video controls"
  }
} as const;

export const addVideoDefinition: ToolDefinition = {
  name: "addVideo",
  strict: true,
  description:
    "Add a Video to an EXISTING Section. For new sections use generateBlock.",
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
      ...videoPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateVideoDefinition: ToolDefinition = {
  name: "updateVideo",
  strict: true,
  description:
    "Update a Video element. Use searchElements({type:'Video'}) to find video IDs first.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the video to update"
      },
      ...videoPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addVideoConfig: AddToolConfig = {
  kind: "add",
  definition: addVideoDefinition,
  elementType: ElementTypes.Video,
  schema: videoPropsSchema,
  transformProps: (parsed) => {
    const initialProperties = { ...parsed };
    if (parsed.video) {
      initialProperties.type = detectVideoType(parsed.video as string);
    }
    return initialProperties;
  }
};

export const updateVideoConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateVideoDefinition,
  elementType: ElementTypes.Video,
  schema: videoPropsSchema,
  transformProps: (parsed) => {
    const changes = { ...parsed };
    if (parsed.video) {
      changes.type = detectVideoType(parsed.video as string);
    }
    return changes;
  }
};

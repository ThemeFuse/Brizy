import { z } from "zod";
import { onOff } from "visual/ai/adapters/schema-primitives";
import type { AddToolConfig, UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const imageGalleryPropsSchema = z.object({
  layout: z.enum(["masonry", "grid", "justified", "bigImage"]).optional(),
  gridColumn: z.number().min(1).max(6).optional(),
  lightBox: onOff.optional(),
  spacing: z.number().min(0).optional()
});

export type ImageGalleryProps = z.infer<typeof imageGalleryPropsSchema>;

const imageGalleryPropertyDefinitions = {
  layout: {
    type: "string",
    enum: ["masonry", "grid", "justified", "bigImage"],
    description: "Gallery layout style"
  },
  gridColumn: {
    type: "number",
    description: "Number of columns in grid layout (1-6)",
    minimum: 1,
    maximum: 6
  },
  lightBox: {
    type: "string",
    enum: ["on", "off"],
    description: "Enable lightbox on image click"
  },
  spacing: {
    type: "number",
    description: "Gap between images in pixels",
    minimum: 0
  }
} as const;

export const addImageGalleryDefinition: ToolDefinition = {
  name: "addImageGallery",
  strict: true,
  description:
    "Add an ImageGallery to an EXISTING Section. Creates a gallery with default images. For new sections use generateBlock.",
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
      ...imageGalleryPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateImageGalleryDefinition: ToolDefinition = {
  name: "updateImageGallery",
  strict: true,
  description:
    "Update an ImageGallery element's properties. Use searchElements({type:'ImageGallery'}) to find IDs.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the ImageGallery to update"
      },
      ...imageGalleryPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addImageGalleryConfig: AddToolConfig = {
  kind: "add",
  definition: addImageGalleryDefinition,
  elementType: ElementTypes.ImageGallery,
  schema: imageGalleryPropsSchema
};

export const updateImageGalleryConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateImageGalleryDefinition,
  elementType: ElementTypes.ImageGallery,
  schema: imageGalleryPropsSchema
};

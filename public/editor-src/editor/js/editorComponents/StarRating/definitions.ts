import { z } from "zod";
import { onOff } from "visual/ai/adapters/schema-primitives";
import type { AddToolConfig, UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const starRatingPropsSchema = z.object({
  rating: z.number().min(0).max(10).optional(),
  ratingScale: z.number().min(1).max(10).optional(),
  text: z.string().optional(),
  label: onOff.optional()
});

export type StarRatingProps = z.infer<typeof starRatingPropsSchema>;

const starRatingPropertyDefinitions = {
  rating: {
    type: "number",
    description: "Rating value (e.g., 4.5)",
    minimum: 0,
    maximum: 10
  },
  ratingScale: {
    type: "number",
    description: "Maximum stars (e.g., 5 for 5-star rating)",
    minimum: 1,
    maximum: 10
  },
  text: {
    type: "string",
    description: "Label text (e.g., 'Rating', 'Quality')"
  },
  label: {
    type: "string",
    enum: ["on", "off"],
    description: "Show/hide the label"
  }
} as const;

export const addStarRatingDefinition: ToolDefinition = {
  name: "addStarRating",
  strict: true,
  description:
    "Add a StarRating display to an EXISTING Section. For new sections use generateBlock.",
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
      ...starRatingPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateStarRatingDefinition: ToolDefinition = {
  name: "updateStarRating",
  strict: true,
  description:
    "Update a StarRating element. Use searchElements({type:'StarRating'}) to find IDs.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the StarRating to update"
      },
      ...starRatingPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addStarRatingConfig: AddToolConfig = {
  kind: "add",
  definition: addStarRatingDefinition,
  elementType: ElementTypes.StarRating,
  schema: starRatingPropsSchema
};

export const updateStarRatingConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateStarRatingDefinition,
  elementType: ElementTypes.StarRating,
  schema: starRatingPropsSchema
};

import { z } from "zod";
import { onOff } from "visual/ai/adapters/schema-primitives";
import type { AddToolConfig, UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const carouselPropsSchema = z.object({
  slidesToShow: z.number().min(1).max(6).optional(),
  sliderAutoPlay: onOff.optional(),
  sliderAutoPlaySpeed: z.number().min(1).max(60).optional()
});

export type CarouselProps = z.infer<typeof carouselPropsSchema>;

const carouselPropertyDefinitions = {
  slidesToShow: {
    type: "number",
    description: "Number of slides visible at once (1-6)",
    minimum: 1,
    maximum: 6
  },
  sliderAutoPlay: {
    type: "string",
    enum: ["on", "off"],
    description: "Enable auto-play"
  },
  sliderAutoPlaySpeed: {
    type: "number",
    description: "Auto-play speed in seconds",
    minimum: 1,
    maximum: 60
  }
} as const;

export const addCarouselDefinition: ToolDefinition = {
  name: "addCarousel",
  strict: true,
  description:
    "Add a Carousel/slider to an EXISTING Section. Creates 4 default slides with Image+Text+Button. For new sections use generateBlock.",
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
      ...carouselPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateCarouselDefinition: ToolDefinition = {
  name: "updateCarousel",
  strict: true,
  description:
    "Update a Carousel/slider element's properties. Use searchElements({type:'Carousel'}) to find IDs.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the Carousel to update"
      },
      ...carouselPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addCarouselConfig: AddToolConfig = {
  kind: "add",
  definition: addCarouselDefinition,
  elementType: ElementTypes.Carousel,
  schema: carouselPropsSchema
};

export const updateCarouselConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateCarouselDefinition,
  elementType: ElementTypes.Carousel,
  schema: carouselPropsSchema
};

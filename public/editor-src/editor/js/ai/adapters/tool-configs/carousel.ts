import { carouselPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import type { AddToolConfig, UpdateToolConfig } from "../types";

export const addCarouselConfig: AddToolConfig = {
  kind: "add",
  alias: "addCarousel",
  elementType: ElementTypes.Carousel,
  schema: carouselPropsSchema
};
export const updateCarouselConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateCarousel",
  elementType: ElementTypes.Carousel,
  schema: carouselPropsSchema
};

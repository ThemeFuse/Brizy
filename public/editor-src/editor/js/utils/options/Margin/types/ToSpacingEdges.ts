import type { Edge } from "visual/component/Controls/Spacing/types";
import type { Config } from "./Config";

export type ToSpacingEdges<E extends Config["edges"]> = {
  all: Edge;
  vertical: "top" | "bottom";
  horizontal: "left" | "right";
}[E];

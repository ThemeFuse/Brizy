import {
  DCPlaceholderObj,
  DCPlaceholderStartObj,
  PlaceholderName
} from "./types";

export const isPlaceholderName = (r: unknown): r is PlaceholderName =>
  r === "placeholder";

export const isPlaceholderStart = (
  o: DCPlaceholderObj
): o is DCPlaceholderStartObj => "content" in o;

export const getVaryAttr = (
  attr: Array<string>
): {
  showEntityType: boolean;
  showEntityId: boolean;
} => {
  return {
    showEntityType: attr.includes("entityType"),
    showEntityId: attr.includes("entityId")
  };
};

export const getPopulatedEntityValues = (
  entityId: string,
  entityType: string
) => {
  const attr: Partial<Record<"entityType" | "entityId", string>> = {};

  if (entityId) {
    attr.entityId = entityId;
  }
  if (entityType) {
    attr.entityType = entityType;
  }

  return attr;
};

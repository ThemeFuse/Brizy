import { ComponentItem } from "./type";
import * as types from "./types/index";

export const getTypeChoices = Object.values<ComponentItem>(types).map(
  (item) => ({
    title: item.componentTitle,
    value: item.componentType
  })
);

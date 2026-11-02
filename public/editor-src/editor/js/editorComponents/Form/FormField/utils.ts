import type { ComponentItem } from "./type";
import { components } from "./types/index";

export const getTypeChoices = () =>
  Object.values<ComponentItem>(components).map((item) => ({
    title: item.componentTitle,
    value: item.componentType
  }));

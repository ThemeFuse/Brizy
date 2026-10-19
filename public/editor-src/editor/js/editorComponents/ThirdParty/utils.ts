import { types } from "visual/component/Options/types";
import type { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { reduce } from "visual/utils/options/reduce";
import type { Value } from ".";

export function getComponentProps(
  v: Omit<Value, "thirdPartyId">,
  config: ToolbarItemType[]
): Record<string, unknown> {
  const getId = (acc: string[], i: ToolbarItemType): string[] => {
    if (i.type in types) {
      acc.push(i.id);
    }
    return acc;
  };
  return config
    .flatMap((item: ToolbarItemType) => reduce(getId, [], item))
    .reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = v[key];
      return acc;
    }, {});
}

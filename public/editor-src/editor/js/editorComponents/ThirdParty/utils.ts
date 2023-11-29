import { types } from "visual/component/Options/types";
import { reduce } from "visual/component/Options/types/utils/reduce";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { Value } from ".";

export function getComponentProps(
  v: Omit<Value, "thirdPartyId">,
  config: ToolbarItemType[]
): Record<string, unknown> {
  const getId = (acc: string[], i: ToolbarItemType): string[] =>
    i.type in types ? [...acc, i.id] : acc;

  return config
    .map((item: ToolbarItemType) => reduce(getId, [], item))
    .flat()
    .reduce((acc, key) => {
      return { ...acc, [key]: v[key] };
    }, {});
}

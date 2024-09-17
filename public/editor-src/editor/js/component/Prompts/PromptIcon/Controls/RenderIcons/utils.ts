import { Arr, Obj, pipe } from "@brizy/readers";
import { Icon } from "visual/config/icons/Icon";
import { TypeId } from "visual/config/icons/Type";
import { pass } from "visual/utils/fp";

const isNormalIcon = (icon: unknown): icon is Icon =>
  Obj.isObject(icon) && "type" in icon && icon.type !== TypeId.Custom;

export const getIcons = pipe(Arr.readWithItemReader(pass(isNormalIcon)));

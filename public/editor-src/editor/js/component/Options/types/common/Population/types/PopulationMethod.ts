import { get } from "visual/utils/object/get";
import * as Obj from "visual/utils/reader/object";
import { String } from "visual/utils/string/specs";
import { Eq, IsEqual } from "visual/utils/types/Eq";
import { Literal } from "visual/utils/types/Literal";
import { Reader, Type } from "visual/utils/types/Type";

export interface PopulationMethod {
  title: string;
  value: string;
  attr?: Record<string, Literal>;
  icon?: string;
  varyAttr: Array<"type" | "id">;
  display?: "inline" | "block";
  alias?: string;
}

export interface PopulationOptgroupMethod {
  title: string;
  optgroup: (PopulationMethod | PopulationOptgroupMethod)[];
  icon?: string;
}

export interface PopulationMethodHandler {
  handlerChoices: (
    response: (r: string) => void,
    reject: (r: string) => void
  ) => void;
}

export const isVaryRead = (v: unknown): PopulationMethod["varyAttr"] => {
  if (Array.isArray(v) && (v.includes("type") || v.includes("id"))) {
    return v;
  }

  return [];
};

export const read: Reader<PopulationMethod> = (v) => {
  if (Obj.isObject(v)) {
    const title = String.read(get("title", v));
    const value = String.read(get("value", v));
    const icon = String.read(get("icon", v));
    const alias = String.read(get("alias", v));
    const varyAttr = isVaryRead(get("varyAttr", v));
    const attr = Obj.read(get("attr", v)) as
      | PopulationMethod["attr"]
      | undefined;
    const display = String.read(get("display", v)) as
      | PopulationMethod["display"]
      | undefined;

    if (title !== undefined && value !== undefined) {
      return { title, value, icon, alias, display, varyAttr, attr };
    }
  }

  return undefined;
};

// Population method identity is represented by it's value, regardless of title or icon
export const eq: IsEqual<PopulationMethod> = (a, b) => a.value === b.value;

export const PopulationMethodType: Type<PopulationMethod> &
  Eq<PopulationMethod> = { read, eq };

import { Reader, Type } from "visual/utils/types/Type";
import { String } from "visual/utils/string/specs";
import { get } from "visual/utils/object/get";
import { Eq, IsEqual } from "visual/utils/types/Eq";

export interface PopulationMethod {
  title: string;
  value: string;
  icon?: string;
}

export const read: Reader<PopulationMethod> = v => {
  if (typeof v === "object") {
    const title = String.read(get("title", v as PopulationMethod));
    const value = String.read(get("value", v as PopulationMethod));
    const icon = String.read(get("icon", v as PopulationMethod));

    if (title !== undefined && value !== undefined) {
      return { title, value, icon };
    }
  }
  return undefined;
};

// Population method identity is represented by it's value, regardless of title or icon
export const eq: IsEqual<PopulationMethod> = (a, b) => a.value === b.value;

export const PopulationMethodType: Type<PopulationMethod> &
  Eq<PopulationMethod> = { read, eq };

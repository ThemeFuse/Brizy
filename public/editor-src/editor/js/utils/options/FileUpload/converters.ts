import * as Option from "visual/component/Options/Type";
import * as Str from "visual/utils/string/specs";

export const defaultValue = {
  id: "",
  name: ""
};

export const fromElementModel: Option.FromElementModel<"fileUpload"> = (
  get
) => {
  const modelValue = Str.read(get("value"));

  if (!modelValue) {
    return defaultValue;
  }
  const [id, name] = modelValue.split("|||");

  return {
    id: id ?? defaultValue.id,
    name: name ?? defaultValue.name
  };
};

export const toElementModel: Option.ToElementModel<"fileUpload"> = (v) =>
  v ? { value: `${v.id}|||${v.name}` } : { value: "" };

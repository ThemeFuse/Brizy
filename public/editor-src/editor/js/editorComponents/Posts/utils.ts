type Attributes = { [k: string]: AttributeValue };
type AttributeValue = undefined | null | string | number | AttributeObj;
type AttributeObj = {
  [k: string]: AttributeObjValue;
};
type AttributeObjValue =
  | undefined
  | null
  | string
  | string[]
  | number
  | number[]
  | AttributeObj;

function stringifyAttributeObjEntity([k, v]: [
  string,
  AttributeObjValue
]): string {
  if (v === null || v === undefined) {
    return "";
  }

  if (typeof v === "string" || typeof v === "number") {
    return `${k}=${v}`;
  }

  if (Array.isArray(v)) {
    return (v as string[]).map(vv => `${k}[]=${vv}`).join("&");
  }

  if (typeof v === "object") {
    return Object.entries(v)
      .map(([kv, vv]) => stringifyAttributeObjEntity([`${k}[${kv}]`, vv]))
      .join("&");
  }

  throw new Error("can't stringify v: " + v);
}

function stringifyAttribute(k: string, v: AttributeValue): string {
  let vs: string;

  if (v === undefined || v === null) {
    vs = "";
  } else if (typeof v === "string" || typeof v === "number") {
    vs = String(v);
  } else {
    vs = Object.entries(v)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([k, v]) => v !== undefined && v !== null)
      .map(stringifyAttributeObjEntity)
      .join("&");
  }

  return `${k}='${vs}'`;
}

export function stringifyAttributes(attributes: Attributes): string {
  return (
    Object.entries(attributes)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([k, v]) => v !== undefined && v !== null)
      .map(([k, v]) => stringifyAttribute(k, v))
      .join(" ")
  );
}

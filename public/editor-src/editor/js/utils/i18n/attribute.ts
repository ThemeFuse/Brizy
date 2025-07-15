import { read } from "visual/utils/reader/string";

interface DatasetObj {
  value: string;
  name: string;
  translatable?: boolean;
}

interface DatasetString extends Omit<DatasetObj, "value"> {
  value?: string;
}

interface DatasetUnknown extends Omit<DatasetObj, "value"> {
  value: unknown;
}

export const makeAttr = (name: string, translatable?: boolean): string =>
  translatable ? `data-brz-translatable-${name}` : `data-brz-${name}`;

export const makeDataAttrString = (data: DatasetString): string => {
  const { name, value, translatable } = data;
  const attrName = makeAttr(name, translatable);
  const attrValue = read(value);

  if (attrValue === undefined) {
    return `[${attrName}]`;
  }

  return `[${attrName}=${attrValue}]`;
};

export const makeDataAttr = (data: DatasetUnknown): Record<string, string> => {
  const { name, value, translatable } = data;
  const attrValue = read(value);

  if (attrValue === undefined) {
    return {};
  }

  const attrName = makeAttr(name, translatable);
  return { [attrName]: attrValue };
};

export const makeBzelmAttr = (value: string): Record<string, string> => ({
  "data-bzelm": value
});

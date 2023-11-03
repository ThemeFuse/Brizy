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

export const makeDataAttrString = ({
  name,
  value,
  translatable
}: DatasetString): string => {
  const attribute = read(value)
    ? translatable
      ? `[data-brz-translatable-${name}=${value}]`
      : `[data-brz-${name}=${value}]`
    : `[${makeAttr(name)}]`;

  if (value === "") return attribute;

  return attribute;
};

export const makeDataAttr = ({ name, value, translatable }: DatasetUnknown) => {
  const attribute = translatable
    ? { [`data-brz-translate-${name}`]: value }
    : { [`data-brz-${name}`]: value };

  if (value === "") return attribute;

  return read(value) ? attribute : {};
};

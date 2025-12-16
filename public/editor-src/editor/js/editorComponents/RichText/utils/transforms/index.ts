import { ElementModel } from "visual/component/Elements/Types";
import { isNumeric } from "visual/utils/math";
import {
  blockValues,
  currentBlockValues,
  currentValues,
  customValues,
  inlineValues,
  legacyValues
} from "./defaultValues";

export {
  blockValues,
  inlineValues,
  customValues,
  currentBlockValues,
  legacyValues
};

export const VToClassNames = (v: ElementModel): string => {
  const classNames = Object.entries(v).reduce((acc, [key, value]) => {
    let className = getPrefixByKey(key);

    className = `${className}-${value}`;
    acc.push(className);

    return acc;
  }, [] as string[]);

  return classNames.join(" ");
};

export const classNamesToV = (classList: string[]): ElementModel => {
  return classNamesToV2(classList).v;
};

export const classNamesToV2 = (
  classList: string[]
): { v: ElementModel; vs: ElementModel; vd: ElementModel } => {
  const vd = getDefaultValues();
  const elemV = getElementValues(classList);

  const v = { ...vd, ...elemV };

  return {
    v,
    vs: {},
    vd
  };
};

export const getDefaultValues = (): ElementModel => {
  const acc: ElementModel = {};
  Object.entries(currentBlockValues).forEach(([, value]) => {
    Object.entries(value).forEach(([key, { defaultValue }]) => {
      acc[key] = defaultValue;
    });
  });

  return acc;
};

export const getElementValues = (classList: string[]): ElementModel => {
  const acc: ElementModel = {};
  // add conditions for data attributes and styles if it's needed

  if (classList.length) {
    const regex = new RegExp("^(.*)-(.*$)");

    classList.forEach((className) => {
      const result = className.match(regex);
      if (result) {
        const [, prefix, value] = result;
        const key = getKeyByPrefix(prefix);

        acc[key] = formatQuilValueToV(value);
      }
    });
  }

  return acc;
};

export function formatVToQuilValue(value: string | number): string | number {
  if (value === "") {
    return "empty";
  }

  return isNumeric(value) ? quillNumberToString(value as number) : value;
}

function getKeyByPrefix(prefix: string): string {
  const acc: { [k: string]: string } = {};
  Object.entries(currentValues).forEach(([, value]) => {
    Object.entries(value).forEach(([key, { prefix }]) => {
      acc[prefix] = key;
    });
  });

  // find a better way to implement this
  Object.entries(legacyValues).forEach(([, value]) => {
    Object.entries(value).forEach(([key, { prefix }]) => {
      acc[prefix] = key;
    });
  });

  return acc[prefix];
}

function getPrefixByKey(key: string): string {
  const acc: { [k: string]: string } = {};
  Object.entries(currentValues).forEach(([, value]) => {
    Object.entries(value).forEach(([key, { prefix }]) => {
      acc[key] = prefix;
    });
  });

  return acc[key];
}

function formatQuilValueToV(value: string): unknown {
  if (value === "empty") {
    return "";
  }
  if (value === undefined) {
    return null;
  }
  if (value.includes(",")) {
    // sometimes quill return values as color2, color7 as example
    // don't know why. This hack takes only first value
    value = value.split(",")[0];
  }

  // value.replace("_", ".") - for letterSpacing & lineHeight
  // find out a better way to implement this
  return isNumeric(value.replace("m_", "-").replace("_", "."))
    ? quillStringToNumber(value)
    : value;
}

function quillStringToNumber(str: string): number {
  return Number(str.replace("m_", "-").replace("_", "."));
}

function quillNumberToString(num: number): string {
  return String(num).replace(".", "_").replace("-", "m_");
}

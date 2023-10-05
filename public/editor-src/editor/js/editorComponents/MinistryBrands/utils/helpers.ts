import {
  Choice,
  ChoicesSync
} from "visual/component/Options/types/dev/MultiSelect2/types";
import { ChoicesAsync } from "visual/component/Options/types/dev/Select/types";
import {
  EkklesiaFields,
  EkklesiaParentsChilds,
  EkklesiaResponse
} from "visual/global/Config/types/configs/modules/ekklesia/Ekklesia";
import { t } from "visual/utils/i18n";
import { Literal } from "visual/utils/types/Literal";
import {
  EkklesiaChoiceParams,
  EkklesiaChoiceParamsWithSubKey,
  EkklesiaParams,
  Switch
} from "./types";

export const getOption = (
  obj: Record<string, Literal> | undefined
): Choice[] => {
  return obj
    ? [
        { title: "None", value: "" },
        ...Object.entries(obj).map(([key, value]) => {
          return {
            title: String(value),
            value: key
          };
        })
      ]
    : [];
};

export const getAttr = (option: Switch, key: string): string => {
  return option === "on" ? `${key}='1'` : `${key}='0'`;
};

export const getFeatures = (option: Switch, placeholder: string) =>
  option === "on" ? `${placeholder}='${placeholder}'` : "";

export const getDetail = (placeholder: string): string =>
  encodeURI(placeholder);

export function changeContentVisibility({
  items,
  activeClassName,
  direction
}: {
  items: HTMLElement[];
  activeClassName: string;
  direction: "next" | "prev";
}) {
  let currentIndex = 0;

  items.forEach((item, index) => {
    if (item.classList.contains(activeClassName)) {
      switch (direction) {
        case "next": {
          currentIndex = index + 1;
          break;
        }
        case "prev": {
          currentIndex = index - 1;
          break;
        }
      }
      item.classList.remove(activeClassName);
    }
  });

  items[currentIndex].classList.add(activeClassName);
}

const request = (url: string): Promise<EkklesiaResponse> => {
  return fetch(url).then((res) => res.json());
};

const fieldHaveParentsChildsKeys = (
  key: Record<string, Literal> | EkklesiaParentsChilds
): key is EkklesiaParentsChilds => {
  return "childs" in key && "parents" in key;
};

const keysHaveSubkey = (
  keys: EkklesiaChoiceParams | EkklesiaChoiceParamsWithSubKey
): keys is EkklesiaChoiceParamsWithSubKey => {
  return "subKey" in keys;
};

export const getEkklesiaFields = async <
  T extends keyof EkklesiaFields = keyof EkklesiaFields
>(
  keys:
    | Required<EkklesiaChoiceParams<T>>
    | Required<EkklesiaChoiceParamsWithSubKey<T>>
): Promise<Choice[]> => {
  try {
    const { url, key } = keys;
    const data = await request(url.concat("?module=", key));
    const field = data.data[key];
    if (field && fieldHaveParentsChildsKeys(field)) {
      if (keysHaveSubkey(keys)) {
        return getOption(field[keys.subKey]);
      }
    } else {
      return getOption(field);
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
  }

  return [];
};

export const getEkklesiaChoiches = <
  T extends keyof EkklesiaFields = keyof EkklesiaFields
>(
  keys: EkklesiaParams<T>
): ChoicesAsync | ChoicesSync => {
  const { url, key } = keys;
  if (!url) {
    return [];
  }

  if (keysHaveSubkey(keys)) {
    return {
      load: () => getEkklesiaFields({ key, subKey: keys.subKey, url }),
      emptyLoad: {
        title: t("There are no choices")
      }
    };
  }

  return {
    load: () => getEkklesiaFields({ key, url }),
    emptyLoad: {
      title: t("There are no choices")
    }
  };
};

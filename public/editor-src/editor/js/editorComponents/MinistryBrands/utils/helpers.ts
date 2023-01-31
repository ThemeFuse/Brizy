import { Choice } from "visual/component/Options/types/dev/MultiSelect2/types";
import { Literal } from "visual/utils/types/Literal";
import { Switch } from "./types";

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

export const getChoicesById = (
  arr: Record<string, Literal>[] | undefined
): Choice[] => {
  return arr
    ? [
        { title: "None", value: "" },
        ...arr.map((item) => ({
          title: String(item.post_title),
          value: item.ID
        }))
      ]
    : [];
};

export const getAttr = (
  option: Switch,
  key: string,
  value?: unknown
): string => {
  if (value) {
    return option === "on" ? `${key}='${value}'` : `${key}=''`;
  }
  return option === "on" ? `${key}='1'` : `${key}='0'`;
};

export const changeContentVisibility = ({
  items,
  activeClassName,
  direction
}: {
  items: HTMLElement[];
  activeClassName: string;
  direction: "next" | "prev";
}) => {
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
};

import { MValue } from "visual/utils/value";
import { Type } from "./types/Type";
import { Target } from "./types/Target";
import { pageDataNoRefsSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import Config from "visual/global/Config";

type Data = { items: Array<{ value: { _id: string; anchorName: string } }> };

const isWP = Config.get("wp");

export const getAttr = (
  attr: JSX.IntrinsicAttributes
): JSX.IntrinsicAttributes => {
  type A = JSX.IntrinsicAttributes;
  type K = keyof A;
  return Object.keys(attr)
    .filter(key => attr[key as keyof typeof attr] !== "")
    .reduce((obj: A, key) => {
      obj[key as K] = attr[key as keyof typeof attr];
      return obj;
    }, {});
};

export const getTarget = (type: Type, target: Target): MValue<"_blank"> => {
  return (type === "external" && target === "on") || type === "upload"
    ? "_blank"
    : undefined;
};

export const getHref = (type: Type, _href: string): string => {
  let href;

  switch (type) {
    case "anchor":
      if (IS_EDITOR) {
        href = `#${_href}`;
      } else {
        // while the orthodox way of getting data from the store is be using connect from react-redux
        // it could be problematic in this case because of potential problems caused be rerenders triggered by connect
        // because Link can hold in children heavy react trees (like columns)
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const pageDataNoRefs = pageDataNoRefsSelector(
          getStore().getState()
        ) as MValue<Data>;
        const pageBlocks = pageDataNoRefs?.items || [];
        const blockByHref = pageBlocks.find(block => block.value._id === _href);
        const anchorName =
          (blockByHref && blockByHref.value.anchorName) || _href;

        href = `#${anchorName}`;
      }
      break;
    case "popup": {
      href = `#${_href}`;
      break;
    }
    case "upload": {
      const { customFile } = Config.get("urls");
      const [name] = _href.split("|||", 1);
      href = isWP ? `${customFile}${name}` : `${customFile}/${name}`;
      break;
    }
    case "lightBox":
    case "external": {
      href = _href;
      break;
    }
    case "action": {
      href = "#";
      break;
    }
  }

  return href;
};

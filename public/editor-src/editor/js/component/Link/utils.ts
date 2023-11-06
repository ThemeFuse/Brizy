import { pageDataNoRefsSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { customFileUrl } from "visual/utils/customFile";
import { MValue } from "visual/utils/value";
import { Target, TargetTypes } from "./types/Target";
import { Type } from "./types/Type";
import {
  getPopulatedEntityValues,
  makePlaceholder
} from "visual/utils/dynamicContent";

interface SectionModel {
  value: {
    _id: string;
    anchorName: string;
    cssIDPopulation: string;
    cssIDPopulationEntityId: string;
    cssIDPopulationEntityType: string;
  };
}

type Data = {
  items: Array<SectionModel>;
};

export const getAttr = (
  attr: JSX.IntrinsicAttributes
): JSX.IntrinsicAttributes => {
  type A = JSX.IntrinsicAttributes;
  type K = keyof A;
  return Object.keys(attr)
    .filter((key) => attr[key as keyof typeof attr] !== "")
    .reduce((obj: A, key) => {
      obj[key as K] = attr[key as keyof typeof attr];
      return obj;
    }, {});
};

export const getTarget = (type: Type, target: Target): TargetTypes => {
  return (type === "external" && target === "on") || type === "upload"
    ? "_blank"
    : "_self";
};

const createAnchor = (data: {
  href: string;
  section?: SectionModel;
}): string => {
  const { href, section } = data;
  const sectionValue = section?.value;

  if (sectionValue?.cssIDPopulation || sectionValue?.anchorName) {
    if (sectionValue.cssIDPopulation) {
      const {
        cssIDPopulation,
        cssIDPopulationEntityId,
        cssIDPopulationEntityType
      } = sectionValue;

      return makePlaceholder({
        content: cssIDPopulation,
        attr: getPopulatedEntityValues(
          cssIDPopulationEntityId,
          cssIDPopulationEntityType
        )
      });
    }

    return sectionValue.anchorName;
  }

  return href;
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
        const pageDataNoRefs = pageDataNoRefsSelector(
          getStore().getState()
        ) as MValue<Data>;
        const pageBlocks = pageDataNoRefs?.items || [];
        const blockByHref = pageBlocks.find(
          (block) => block.value._id === _href
        );
        const anchorName = createAnchor({ href: _href, section: blockByHref });

        href = `#${anchorName}`;
      }
      break;
    case "popup": {
      href = `#${_href}`;
      break;
    }
    case "upload": {
      href = customFileUrl(_href) ?? "";
      break;
    }
    case "page":
    case "lightBox":
    case "external": {
      href = _href;
      break;
    }
    case "story":
    case "action": {
      href = "#";
      break;
    }
  }

  return href;
};

export const getRel = (_rel: string): string => {
  const rel = ["noopener"];

  if (_rel === "on") {
    rel.push("nofollow");
  }

  return rel.join(" ");
};

import { ElementModel } from "visual/component/Elements/Types";
import * as LinkType from "visual/component/Link/types/Type";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { RenderType, isEditor } from "visual/providers/RenderProvider";
import { customFileUrl } from "visual/utils/customFile";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { read as readNum } from "visual/utils/reader/number";
import { read } from "visual/utils/reader/string";
import { Target, TargetTypes } from "./types/Target";
import { LinkData, Type } from "./types/Type";

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
  return ((type === "external" || type === "page") && target === "on") ||
    type === "upload"
    ? "_blank"
    : "_self";
};

const createAnchor = (href: string): string => {
  const uidPlaceholder = makePlaceholder({
    content: "{{ globalblock_anchor }}",
    attr: { uid: href }
  });

  return `${uidPlaceholder}_${href}`;
};

export const getHref = (
  type: Type,
  _href: string,
  renderContext: RenderType,
  config: ConfigCommon
): string => {
  let href;

  switch (type) {
    case "anchor":
      if (isEditor(renderContext)) {
        href = `#${_href}`;
      } else {
        const anchorName = createAnchor(_href);
        href = `#${anchorName}`;
      }
      break;
    case "popup": {
      href = `#${_href}`;
      break;
    }
    case "upload": {
      href = customFileUrl(_href, config) ?? "";
      break;
    }
    case "page":
    case "lightBox":
    case "external": {
      href = _href || "#";
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

export const getLinkValue = (v: ElementModel): LinkData => {
  return {
    linkPage: read(v.linkPage) ?? "",
    linkSource: read(v.linkSource) ?? "",
    linkType: LinkType.mRead(v.linkType),
    linkExternal: read(v.linkExternal) ?? "",
    linkExternalBlank: read(v.linkExternalBlank) ?? "",
    linkExternalRel: read(v.linkExternalRel) ?? "",
    linkPopup: read(v.linkPopup) ?? "",
    linkUpload: read(v.linkUpload) ?? "",
    linkLightBox: read(v.linkLightBox) ?? "",
    linkAnchor: read(v.linkAnchor) ?? "",
    linkToSlide: readNum(v.linkToSlide) ?? 1,
    linkPopulation: read(v.linkPopulation) ?? "",
    linkExternalType: LinkType.readExternalType(v.linkExternalType),
    linkPopulationEntityType: read(v.linkPopulationEntityType) ?? "",
    linkPopulationEntityId: read(v.linkPopulationEntityId) ?? ""
  };
};

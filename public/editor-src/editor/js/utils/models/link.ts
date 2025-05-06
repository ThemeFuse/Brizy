import { isString } from "es-toolkit";
import { ElementModel } from "visual/component/Elements/Types";
import { StoryAnchorAttribute } from "visual/component/Link/types/Slide";
import * as LinkTarget from "visual/component/Link/types/Target";
import * as LinkType from "visual/component/Link/types/Type";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { SizeType } from "visual/global/Config/types/configs/common";
import {
  getPopulatedEntityValues,
  makePlaceholder
} from "visual/utils/dynamicContent";
import { pipe } from "visual/utils/fp";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import {
  defaultImagePopulation,
  getImageUrl,
  imagePopulationUrl
} from "visual/utils/image";
import { isGIFExtension, isSVGExtension } from "visual/utils/image/utils";
import * as Num from "visual/utils/reader/number";
import * as Str from "visual/utils/string/specs";
import { MValue, isNullish } from "visual/utils/value";

export interface Value extends ElementModel {
  link?: unknown;
  linkType?: unknown;
  linkAnchor?: unknown;
  linkToSlide?: unknown;
  linkExternalBlank?: unknown;
  linkInternalBlank?: unknown;
  linkExternalType?: unknown;
  linkExternalRel?: unknown;
  linkPopup?: unknown;
  linkUpload?: unknown;
  linkLightBox?: unknown;
  imagePopulation?: unknown;
  imageExtension?: unknown;
  imageSrc?: unknown;
  imageFileName?: unknown;
}

export interface Link {
  type: LinkType.Type;
  href: MValue<string>;
  target: MValue<LinkTarget.Target>;
  rel: MValue<string>;
  slide: MValue<StoryAnchorAttribute>;
  ariaLabel?: string;
}

const isNan = pipe(Num.read, isNullish);

const getLightBoxUrl = (v: Value, config: ConfigCommon): MValue<string> => {
  const {
    linkLightBox,
    linkType: _linkType,
    imagePopulation: _imagePopulation,
    imagePopulationEntityId: _imagePopulationEntityId,
    imagePopulationEntityType: _imagePopulationEntityType,
    imageExtension: _imageExtension,
    imageSrc: _imageSrc,
    imageFileName: _imageFileName
  } = v;
  const linkType = linkLightBox === "on" ? "lightBox" : _linkType;
  const imageExtension = Str.read(_imageExtension) ?? "";
  const imagePopulation = Str.read(_imagePopulation);
  const imagePopulationEntityId = Str.read(_imagePopulationEntityId) ?? "";
  const imagePopulationEntityType = Str.read(_imagePopulationEntityType) ?? "";
  const imageSrc = Str.read(_imageSrc);
  const imageFileName = Str.read(_imageFileName) ?? "";

  const isInvalidType =
    !imageSrc ||
    linkType !== "lightBox" ||
    isSVGExtension(imageExtension) ||
    isGIFExtension(imageExtension);

  if (isInvalidType) {
    return undefined;
  }

  return imagePopulation
    ? imagePopulationUrl(
        makePlaceholder({
          content: imagePopulation,
          attr: getPopulatedEntityValues(
            imagePopulationEntityId,
            imagePopulationEntityType
          )
        }),
        defaultImagePopulation
      )
    : getImageUrl(
        {
          uid: imageSrc,
          fileName: imageFileName,
          sizeType: SizeType.custom
        },
        config
      );
};

const getExternal = (v: Value): MValue<string> => {
  const linkExternalType = Str.read(v.linkExternalType) ?? "";

  if (linkExternalType === "linkPopulation") {
    const link = Str.read(v.link);
    const linkPopulation = Str.read(v.linkPopulation);

    if (link) {
      return link;
    }

    if (linkPopulation) {
      return makePlaceholder({
        content: linkPopulation,
        attr: getPopulatedEntityValues(
          Str.read(v.linkPopulationEntityId) ?? "",
          Str.read(v.linkPopulationEntityType) ?? ""
        )
      });
    }
  }

  return Str.read(v[linkExternalType]);
};

export const getLinkData = <T extends Value>(
  v: T,
  config: ConfigCommon
): Link => {
  const {
    ariaLabel,
    linkLightBox,
    linkAnchor,
    linkToSlide,
    linkExternalBlank,
    linkInternalBlank,
    linkExternalRel,
    linkPopup,
    linkUpload,
    linkPage,
    linkType: _linkType
  } = v;

  const linkType = linkLightBox === "on" ? "lightBox" : _linkType;
  const type = LinkType.mRead(linkType);

  const data = {
    page: Str.read(linkPage),
    anchor: Str.read(linkAnchor),
    story: isNan(linkToSlide) ? "" : `slide-${linkToSlide}`,
    external: getExternal(v),
    popup: Str.read(linkPopup),
    upload: Str.read(linkUpload),
    lightBox: getLightBoxUrl(v, config),

    // TODO: Builder need to be check where is used
    action: ""
  };
  const slide = Num.read(linkToSlide);

  const slideAnchor =
    type === "story" && !isNullish(slide)
      ? makeDataAttr({ name: "link-story", value: slide })
      : undefined;

  const target =
    type === "page"
      ? LinkTarget.read(linkInternalBlank)
      : LinkTarget.read(linkExternalBlank);

  return {
    type,
    href: data[type],
    target,
    rel: Str.read(linkExternalRel),
    slide: slideAnchor,
    ...(isString(ariaLabel) && { ariaLabel })
  };
};

import classnames from "classnames";
import React from "react";
import Link from "visual/component/Link";
import Config from "visual/global/Config";
import { SizeType } from "visual/global/Config/types/configs/common";
import { pipe } from "visual/utils/fp";
import {
  defaultImagePopulation,
  getImageUrl,
  imagePopulationUrl
} from "visual/utils/image";
import * as Num from "visual/utils/reader/number";
import * as Str from "visual/utils/string/specs";
import { MValue, isNullish } from "visual/utils/value";
import { ImageProps } from "../types";
import { isGIF, isSVG } from "../utils";

const isNan = pipe(Num.read, isNullish);

interface Data {
  linkType: string;
  imagePopulation: string;
  imageExtension: string;
  imageSrc: string;
  imageFileName: string;
}
const getLightBoxUrl = (data: Data): MValue<string> => {
  const { linkType, imagePopulation, imageExtension, imageSrc, imageFileName } =
    data;

  const isInvalidType =
    !imageSrc ||
    linkType !== "lightBox" ||
    isSVG(imageExtension) ||
    isGIF(imageExtension);

  if (isInvalidType) {
    return undefined;
  }

  return imagePopulation
    ? imagePopulationUrl(imagePopulation, {
        ...defaultImagePopulation,
        useCustomPlaceholder:
          Config.getAll().dynamicContent?.useCustomPlaceholder ?? false
      })
    : getImageUrl({
        uid: imageSrc,
        fileName: imageFileName,
        sizeType: SizeType.custom
      });
};

function withLink(
  WrappedComponent: React.ComponentType<ImageProps>
): React.FC<ImageProps> {
  const linkComponent: React.FC<ImageProps> = (props) => {
    const {
      imageSrc,
      imageFileName,
      imageExtension,
      imagePopulation,
      linkType: linkType_,
      linkAnchor,
      linkToSlide,
      linkExternalBlank,
      linkExternalRel,
      linkLightBox,
      linkExternalType,
      linkPopup,
      linkUpload,
      actionClosePopup
    } = props.v;

    const linkType = linkLightBox === "on" ? "lightBox" : linkType_;
    const linkHrefs = {
      anchor: linkAnchor,
      story: isNan(linkToSlide) ? "" : `slide-${linkToSlide}`,
      external: Str.read(props.v[linkExternalType]),
      popup: linkPopup,
      upload: linkUpload,
      lightBox:
        getLightBoxUrl({
          linkType,
          imageSrc,
          imagePopulation,
          imageExtension,
          imageFileName
        }) ?? "",
      action: ""
    };
    if (linkHrefs[linkType] !== "") {
      const className = classnames({
        "brz-popup2__action-close":
          linkType_ === "action" && actionClosePopup === "on"
      });
      const slideAnchor =
        linkType === "story" && !isNan(linkToSlide)
          ? { "data-brz-link-story": linkToSlide }
          : {};

      return (
        <Link
          className={className}
          type={linkType}
          href={linkHrefs[linkType]}
          target={linkExternalBlank}
          rel={linkExternalRel}
          slide={slideAnchor}
        >
          <WrappedComponent {...props} />
        </Link>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return linkComponent;
}

export default withLink;

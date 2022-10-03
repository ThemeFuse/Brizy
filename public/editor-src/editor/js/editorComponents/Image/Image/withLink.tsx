import classnames from "classnames";
import React from "react";
import Link from "visual/component/Link";
import { pipe } from "visual/utils/fp";
import { imagePopulationUrl, imageUrl } from "visual/utils/image";
import * as Num from "visual/utils/reader/number";
import * as Str from "visual/utils/string/specs";
import { isNullish } from "visual/utils/value";
import { ImageProps } from "../types";
import { isGIF, isSVG } from "../utils";

const isNan = pipe(Num.read, isNullish);

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
      lightBox: imagePopulation
        ? imagePopulationUrl(imagePopulation)
        : isSVG(imageExtension) || isGIF(imageExtension)
        ? ""
        : Str.read(imageUrl(imageSrc, { fileName: imageFileName })),
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

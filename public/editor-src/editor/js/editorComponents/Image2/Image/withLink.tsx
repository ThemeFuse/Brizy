import React from "react";
import classnames from "classnames";
import Link from "visual/component/Link";
import { imageUrl, imagePopulationUrl } from "visual/utils/image";
import { isSVG, isGIF } from "../utils";

import { ImageProps } from "../types";

function withLink(
  WrappedComponent: React.ComponentType<ImageProps>
): React.FC<ImageProps> {
  const linkComponent: React.FC<ImageProps> = props => {
    const {
      imageSrc,
      imageExtension,
      imagePopulation,
      linkType: linkType_,
      linkAnchor,
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
      external: props.v[linkExternalType],
      popup: linkPopup,
      upload: linkUpload,
      lightBox: imagePopulation
        ? imagePopulationUrl(imagePopulation)
        : isSVG(imageExtension) || isGIF(imageExtension)
        ? ""
        : imageUrl(imageSrc, { iW: 1200, iH: "any" }),
      action: ""
    };
    if (linkHrefs[linkType] !== "") {
      const className = classnames({
        "brz-popup2__action-close":
          linkType_ === "action" && actionClosePopup === "on"
      });
      return (
        <Link
          className={className}
          type={linkType}
          href={linkHrefs[linkType]}
          target={linkExternalBlank}
          rel={linkExternalRel}
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

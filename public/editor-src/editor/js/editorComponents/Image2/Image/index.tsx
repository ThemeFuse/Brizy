/* eslint-disable @typescript-eslint/no-use-before-define */
import React from "react";

import classnames from "classnames";
import { css } from "visual/utils/cssStyle";
import { stylePicture } from "../styles";

import Placeholder from "./Placeholder";
import SvgImage from "./SvgImage";
import SimpleImage from "./SimpleImage";

import withLink from "./withLink";
import { ImageProps, Styles } from "../types";
import { isSVG, isGIF } from "../utils";

const Content: React.FC<ImageProps> = props => {
  const { v, vs, vd, _id, componentId, wrapperSizes, extraAttributes } = props;
  const { imageSrc, imageExtension, imagePopulation } = v;

  const showImageInPreview = IS_PREVIEW && (imagePopulation || imageSrc);
  const showImageInEditor = IS_EDITOR && !imagePopulation && imageSrc;

  if (showImageInPreview || showImageInEditor) {
    const pictureClassName = IS_EDITOR
      ? "brz-picture"
      : classnames(
          "brz-picture",
          "brz-d-block",
          "brz-p-relative",
          css(
            // hard to explain, but because styles are generated from props in this case
            // we can't rely on the usual way of using css(),
            // so we trick it with a custom class for both default and custom classNames
            // `${componentId}-picture`,
            `${componentId}-${_id}-picture`,
            `${_id}-picture`,
            stylePicture(v, vs, vd, wrapperSizes) as Styles
          )
        );

    const content =
      isSVG(imageExtension) || isGIF(imageExtension) ? (
        <SvgImage
          v={v}
          vs={vs}
          vd={vd}
          _id={_id}
          componentId={componentId}
          extraAttributes={extraAttributes}
          imageSrc={imageSrc}
        />
      ) : (
        <SimpleImage {...props} extraAttributes={extraAttributes} />
      );

    return <picture className={pictureClassName}>{content}</picture>;
  }

  return <Placeholder imagePopulation={imagePopulation} />;
};

export default withLink(Content);

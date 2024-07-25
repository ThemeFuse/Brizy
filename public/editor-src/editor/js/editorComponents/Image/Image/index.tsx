/* eslint-disable @typescript-eslint/no-use-before-define */
import classnames from "classnames";
import React from "react";
import Placeholder from "visual/component/Placeholder";
import { withLink } from "visual/component/hooks/withLink";
import { css } from "visual/utils/cssStyle";
import { isGIFExtension, isSVGExtension } from "visual/utils/image/utils";
import { stylePicture } from "../styles";
import { ImageProps, Styles } from "../types";
import { showOriginalImage } from "../utils";
import OriginalImage from "./OriginalImage";
import Population from "./Population";
import SimpleImage from "./SimpleImage";

const Content = (props: ImageProps): JSX.Element => {
  const { v, vs, vd, _id, componentId, wrapperSizes, extraAttributes, meta } =
    props;
  const { imageSrc, imageExtension, imagePopulation } = v;

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
          stylePicture(v, vs, vd, {
            ...wrapperSizes,
            showOriginalImage: showOriginalImage(v)
          }) as Styles
        )
      );

  if (IS_EDITOR && imagePopulation) {
    return meta._dc?.lastCache?.imageSrc ? (
      <Population v={v} attr={extraAttributes} />
    ) : (
      renderPlaceholder()
    );
  }

  // imagePopulation is rendering during compilation time as usual Image
  if (imageSrc || imagePopulation) {
    const content =
      isSVGExtension(imageExtension) ||
      isGIFExtension(imageExtension) ||
      showOriginalImage(v) ? (
        <OriginalImage
          v={v}
          vs={vs}
          vd={vd}
          _id={_id}
          componentId={componentId}
          extraAttributes={extraAttributes}
          imageSrc={imageSrc}
        />
      ) : (
        <SimpleImage
          {...props}
          extraAttributes={extraAttributes}
          gallery={props?.gallery}
        />
      );

    return <picture className={pictureClassName}>{content}</picture>;
  }

  return renderPlaceholder();

  function renderPlaceholder(): JSX.Element {
    return (
      <div className={pictureClassName}>
        <Placeholder icon="img" />
      </div>
    );
  }
};

export default withLink(Content);

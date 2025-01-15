/* eslint-disable @typescript-eslint/no-use-before-define */
import classnames from "classnames";
import React from "react";
import { isEditor } from "visual/providers/RenderProvider";
import Placeholder from "visual/component/Placeholder";
import { withLink } from "visual/component/hooks/withLink";
import { useCSS } from "visual/providers/StyleProvider/useCSS";
import { isGIFExtension, isSVGExtension } from "visual/utils/image/utils";
import { stylePicture } from "../styles";
import { ImageProps } from "../types";
import { showOriginalImage } from "../utils";
import OriginalImage from "./OriginalImage";
import Population from "./Population";
import SimpleImage from "./SimpleImage";

const Content = (props: ImageProps): JSX.Element => {
  const {
    v,
    vs,
    vd,
    _id,
    componentId,
    wrapperSizes,
    extraAttributes,
    meta,
    store,
    renderContext
  } = props;
  const { imageSrc, imageExtension, imagePopulation } = v;
  const modelClassName = useCSS({
    // hard to explain, but because styles are generated from props in this case
    // we can't rely on the usual way of using css(),
    // so we trick it with a custom class for both default and custom classNames
    // `${componentId}-picture`,
    componentId: `${componentId}-${_id}-picture`,
    id: `${_id}-picture`,
    css: stylePicture({
      v,
      vs,
      vd,
      props: {
        ...wrapperSizes,
        showOriginalImage: showOriginalImage(v)
      },
      store,
      renderContext
    })
  });

  const _isEditor = isEditor(renderContext);
  const pictureClassName = _isEditor
    ? "brz-picture"
    : classnames(
        "brz-picture",
        "brz-d-block",
        "brz-p-relative",
        modelClassName
      );

  if (_isEditor && imagePopulation) {
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

import classnames from "classnames";
import React, { JSX } from "react";
import Placeholder from "visual/component/Placeholder";
import { withLink } from "visual/component/hooks/withLink";
import { useConfig } from "visual/providers/ConfigProvider";
import { isEditor } from "visual/providers/RenderProvider";
import { useCSS } from "visual/providers/StyleProvider/useCSS";
import { MValue } from "visual/utils/value";
import { stylePicture } from "../styles";
import { ImageContent } from "../types";
import { isAbleToRenderOriginal, showOriginalImage } from "../utils";
import HoverSimpleImage from "./HoverSimpleImage";
import HoverSvgImage from "./HoverSvgImage";
import OriginalImage from "./OriginalImage";
import Population from "./Population";
import SimpleImage from "./SimpleImage";

const Content = (props: ImageContent): JSX.Element => {
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
    renderContext,
    editorMode,
    getResponsiveUrls
  } = props;
  const { imageSrc, imagePopulation, hoverImagePopulation, hoverImageSrc } = v;
  const config = useConfig();

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
      contexts: {
        renderContext,
        mode: editorMode,
        getConfig: () => config
      }
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

  const renderImage = () => {
    if (imageSrc || imagePopulation) {
      return isAbleToRenderOriginal(v) ? (
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
        <SimpleImage {...props} extraAttributes={extraAttributes} />
      );
    }

    return <Placeholder icon="img" />;
  };

  const renderHoverImage = () => {
    if (_isEditor && hoverImagePopulation) {
      return (
        <Population
          key="population-hover"
          v={v}
          attr={extraAttributes}
          isHover
        />
      );
    }

    if (hoverImageSrc || hoverImagePopulation) {
      return isAbleToRenderOriginal(v, "hover") ? (
        <HoverSvgImage
          v={v}
          vs={vs}
          vd={vd}
          _id={_id}
          componentId={componentId}
          extraAttributes={extraAttributes}
          hoverImageSrc={hoverImageSrc}
          store={store}
          renderContext={renderContext}
          editorMode={editorMode}
          getResponsiveUrls={getResponsiveUrls}
          meta={meta}
        />
      ) : (
        <HoverSimpleImage
          v={v}
          vs={vs}
          vd={vd}
          _id={_id}
          componentId={componentId}
          meta={meta}
          store={store}
          renderContext={renderContext}
          editorMode={editorMode}
          getResponsiveUrls={getResponsiveUrls}
          extraAttributes={extraAttributes}
        />
      );
    }

    return <></>;
  };

  if (_isEditor && (imagePopulation || hoverImagePopulation)) {
    const content: {
      normal: MValue<JSX.Element>;
      hover: MValue<JSX.Element>;
    } = {
      normal: undefined,
      hover: undefined
    };

    if (imagePopulation) {
      if (meta._dc?.lastCache?.imageSrc) {
        content.normal = (
          <Population key="population-simple" v={v} attr={extraAttributes} />
        );
      } else {
        content.normal = <Placeholder icon="img" />;
      }
    }

    if (hoverImagePopulation && meta._dc?.lastCache?.hoverImage) {
      content.hover = (
        <Population
          key="population-hover"
          v={v}
          attr={extraAttributes}
          isHover
        />
      );
    }

    const hasNormalDC = !!content.normal;
    const hasHoverDC = !!content.hover;

    if (hasNormalDC && hasHoverDC) {
      return (
        <div className="brz-img__hover-population">
          {content.normal}
          {content.hover}
        </div>
      );
    }

    const toRender: JSX.Element[] = [];

    if (hasNormalDC) {
      toRender.push(content.normal as JSX.Element);
    } else {
      toRender.push(renderImage());
    }

    if (hasHoverDC) {
      toRender.push(
        <div className="brz-img__hover-population-wrapper">{content.hover}</div>
      );
    } else {
      toRender.push(renderHoverImage());
    }

    if (toRender.length) {
      return <picture className={pictureClassName}>{toRender}</picture>;
    }
  }

  return (
    <picture className={pictureClassName}>
      {renderImage()}
      {renderHoverImage()}
    </picture>
  );
};

export default withLink(Content);

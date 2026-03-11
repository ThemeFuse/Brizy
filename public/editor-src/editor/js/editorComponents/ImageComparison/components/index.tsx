import classnames from "classnames";
import { noop } from "es-toolkit";
import React, { Fragment, JSX, useCallback } from "react";
import Placeholder from "visual/component/Placeholder";
import { withLink } from "visual/component/hooks/withLink";
import { useConfig } from "visual/providers/ConfigProvider";
import { isEditor } from "visual/providers/RenderProvider";
import { useCSS } from "visual/providers/StyleProvider/useCSS";
import { MValue } from "visual/utils/value";
import OriginalImage from "../../Image/Image/OriginalImage";
import Population from "./Population";
import SimpleImage from "../../Image/Image/SimpleImage";
import { isAbleToRenderOriginal, showOriginalImage } from "../../Image/utils";
import { stylePicture } from "../styles";
import { ImageContent } from "../types";

const SLIDER_POSITION = 50;

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
    editorMode
  } = props;
  const {
    imageSrc,
    imagePopulation,
    hoverImage = "",
    hoverImageSrc = "",
    sliderType = "horizontal"
  } = v;
  const config = useConfig();

  const hasHoverImage = !!hoverImageSrc || !!hoverImage;
  const showComparison = hasHoverImage && (imageSrc || imagePopulation);
  const isVertical = sliderType === "vertical";

  const modelClassName = useCSS({
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
    : classnames("brz-picture", "brz-d-block", modelClassName);

  const renderImage = useCallback(
    (imgSrc: string, imgPopulation: string, isHover = false) => {
      if (imgSrc || imgPopulation) {
        const imageV = isHover
          ? {
              ...v,
              imageSrc: imgPopulation || imgSrc,
              imagePopulation: imgPopulation,
              imageWidth: v.hoverImageWidth || v.imageWidth,
              imageHeight: v.hoverImageHeight || v.imageHeight,
              imageExtension: v.hoverImageExtension || v.imageExtension
            }
          : v;

        return isAbleToRenderOriginal(imageV) ? (
          <OriginalImage
            v={imageV}
            vs={vs}
            vd={vd}
            _id={_id}
            componentId={componentId}
            extraAttributes={extraAttributes}
            imageSrc={imgSrc}
          />
        ) : (
          <SimpleImage
            v={imageV}
            vs={vs}
            vd={vd}
            _id={_id}
            componentId={componentId}
            meta={meta}
            wrapperSizes={wrapperSizes}
            renderContext={renderContext}
            editorMode={editorMode}
            store={store}
            extraAttributes={extraAttributes}
          />
        );
      }

      return <Placeholder icon="img" />;
    },
    [
      v,
      vs,
      vd,
      _id,
      componentId,
      extraAttributes,
      meta,
      wrapperSizes,
      store,
      renderContext,
      editorMode
    ]
  );

  const renderSliderLayout = useCallback(
    (
      normalImage: JSX.Element | MValue<JSX.Element>,
      hoverImage: JSX.Element | MValue<JSX.Element>
    ) => {
      return (
        <div
          className={classnames("brz-image-comparison__slider-wrapper", {
            [`brz-image-comparison__slider-wrapper--${sliderType}`]: sliderType
          })}
        >
          {!_isEditor && <input
            type="range"
            min={0}
            max={100}
            defaultValue={SLIDER_POSITION}
            readOnly={_isEditor}
            disabled={_isEditor}
            onChange={noop}
            className={classnames("brz-image-comparison__range", {
              "brz-image-comparison__range--editor": _isEditor,
              [`brz-image-comparison__range--${sliderType}`]: sliderType
            })}
          />}

          {/* Background image (after/hover image) - rendered first so it's behind */}
          <picture
            className={classnames(
              pictureClassName,
              "brz-image-comparison__picture"
            )}
          >
            {hoverImage}
          </picture>

          {/* Overlay image (before/main image) - rendered on top */}
          <picture
            className={classnames(
              pictureClassName,
              "brz-image-comparison__picture brz-image-comparison__picture--overlay"
            )}
            style={{
              ...(isVertical
                ? { clipPath: `inset(0 0 ${100 - SLIDER_POSITION}% 0)` }
                : { clipPath: `inset(0 ${100 - SLIDER_POSITION}% 0 0)` })
            }}
          >
            {normalImage}
          </picture>

          {/* Slider handle */}
          <div
            className={classnames("brz-image-comparison__slider", {
              [`brz-image-comparison__slider--${sliderType}`]: sliderType
            })}
            style={isVertical ? { top: `${SLIDER_POSITION}%` } : { left: `${SLIDER_POSITION}%` }}
          >
            <span className="brz-image-comparison__thumb">
              <svg
                className={classnames("brz-image-comparison__thumb-icon", {
                  [`brz-image-comparison__thumb-icon--${sliderType}`]:
                    sliderType
                })}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
              >
                <path
                  d="M7 0h2v16H7ZM5 3v10L0 8zm6 0v10l5-5z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </div>
        </div>
      );
    },
    [sliderType, _isEditor, pictureClassName, isVertical]
  );

  if (_isEditor && (imagePopulation || hoverImage)) {
    const content: {
      normal: MValue<JSX.Element>;
      hover: MValue<JSX.Element>;
    } = {
      normal: undefined,
      hover: undefined
    };

    if (imagePopulation) {
      if (meta._dc?.lastCache?.imageSrc) {
        content.normal = <Population v={v} attr={extraAttributes} />;
      } else {
        content.normal = <Placeholder icon="img" />;
      }
    }

    if (hoverImage && meta._dc?.lastCache?.hoverImage) {
      content.hover = <Population v={v} attr={extraAttributes} isHover />;
    }

    const hasNormalDC = !!content.normal;
    const hasHoverDC = !!content.hover;
    const hasAtLeastOneDC = hasNormalDC || hasHoverDC;

    // If both images are set and at least one has DC, render the comparison slider layout
    if (showComparison && hasAtLeastOneDC) {
      const normalImage = hasNormalDC
        ? content.normal
        : renderImage(imageSrc, imagePopulation);
      const hoverImageElement = hasHoverDC
        ? content.hover
        : renderImage(hoverImageSrc, hoverImage, true);

      if (normalImage && (hoverImage || hoverImageSrc)) {
        return renderSliderLayout(normalImage, hoverImageElement);
      }
    }

    // If only one image, render simple picture
    const toRender: JSX.Element[] = [];

    if (hasNormalDC) {
      toRender.push(<Fragment key="normal-dc">{content.normal}</Fragment>);
    } else if (imageSrc || imagePopulation) {
      toRender.push(
        <Fragment key="normal-image">
          {renderImage(imageSrc, imagePopulation)}
        </Fragment>
      );
    }

    if (hasHoverDC) {
      toRender.push(<Fragment key="hover-dc">{content.hover}</Fragment>);
    } else if (hoverImageSrc || hoverImage) {
      toRender.push(
        <Fragment key="hover-image">
          {renderImage(hoverImageSrc, hoverImage, true)}
        </Fragment>
      );
    }

    if (toRender.length) {
      return <picture className={pictureClassName}>{toRender}</picture>;
    }
  }

  if (!showComparison) {
    return (
      <picture className={classnames(pictureClassName, "brz-p-relative")}>
        {renderImage(imageSrc, imagePopulation)}
      </picture>
    );
  }

  return renderSliderLayout(
    renderImage(imageSrc, imagePopulation),
    renderImage(hoverImageSrc, hoverImage, true)
  );
};

export default withLink(Content);

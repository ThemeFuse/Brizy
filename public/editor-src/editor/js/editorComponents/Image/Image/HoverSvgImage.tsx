import classnames from "classnames";
import React from "react";
import { getFallbackMeta } from "visual/editorComponents/Image/Image/utils";
import { SizeType } from "visual/global/Config/types/configs/common";
import { useConfig } from "visual/providers/ConfigProvider";
import { useCSS } from "visual/providers/StyleProvider/useCSS";
import { getImageUrl } from "visual/utils/image";
import { isGIFExtension, isSVGExtension } from "visual/utils/image/utils";
import { FCC } from "visual/utils/react/types";
import { styleSvgHoverWrapper } from "../styles";
import { HoverSvgImageProps } from "../types";
import HoverSimpleImage from "./HoverSimpleImage";

const HoverSvgImage: FCC<HoverSvgImageProps> = ({
  v,
  vs,
  vd,
  _id,
  componentId,
  hoverImageSrc,
  meta,
  extraAttributes,
  store,
  renderContext,
  editorMode,
  getResponsiveUrls
}) => {
  const { tabsState, hoverImageExtension, imageFileName: fileName } = v;

  const isGIF = isGIFExtension(hoverImageExtension);
  const isSvg = isSVGExtension(hoverImageExtension);
  const config = useConfig();

  const hoverUrl = getImageUrl(
    {
      uid: hoverImageSrc,
      sizeType: SizeType.original,
      fileName
    },
    config
  );

  const dynamicCSSClassnames = useCSS({
    id: `${componentId}-${_id}-svg-hover`,
    componentId: `${_id}-svg-hover`,
    css: styleSvgHoverWrapper({
      v,
      vs,
      vd,
      store,
      contexts: {
        renderContext,
        mode: editorMode,
        getConfig: () => config
      }
    })
  });

  const styleHoverImage = classnames(
    "brz-img__hover",
    {
      "brz-img__hover-gif": isGIF,
      "brz-img__hover-svg": isSvg,
      "brz-transparent": tabsState !== "hover"
    },
    dynamicCSSClassnames
  );

  if (isSvg) {
    return (
      <div className="brz-img__hover-wrapper">
        <img
          className={styleHoverImage}
          src={hoverUrl ?? ""}
          draggable={false}
          {...extraAttributes}
        />
      </div>
    );
  }

  return (
    <HoverSimpleImage
      _id={_id}
      v={v}
      vs={vs}
      vd={vd}
      componentId={componentId}
      meta={meta ?? getFallbackMeta()}
      store={store}
      renderContext={renderContext}
      editorMode={editorMode}
      getResponsiveUrls={getResponsiveUrls}
    />
  );
};

export default HoverSvgImage;
